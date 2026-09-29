import http from "node:http";
import { execFile, spawn } from "node:child_process";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { URL } from "node:url";
import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const CONTAINER_CLI = process.env.CONTAINER_CLI || "docker";
const SANDBOX_IMAGE = process.env.SANDBOX_IMAGE || "portfolio-sandbox:latest";
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 15 * 60_000);
const IDLE_TTL_MS = Number(process.env.IDLE_TTL_MS || 5 * 60_000);
const MAX_SESSIONS = Number(process.env.MAX_SESSIONS || 20);
const MAX_SESSIONS_PER_IP = Number(process.env.MAX_SESSIONS_PER_IP || 2);
const MAX_STARTS_PER_HOUR = Number(process.env.MAX_STARTS_PER_HOUR || 12);
const TRUST_PROXY = process.env.TRUST_PROXY === "1";
const ALLOW_NO_ORIGIN = process.env.ALLOW_NO_ORIGIN === "1";
const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS || "https://hackus-mans.github.io,http://localhost:4321,http://127.0.0.1:4321")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

const sessions = new Map();
const startsByIp = new Map();

function json(res, status, payload, origin = "") {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    ...(origin && ALLOWED_ORIGINS.has(origin)
      ? {
          "Access-Control-Allow-Origin": origin,
          Vary: "Origin",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        }
      : {}),
  });
  res.end(body);
}

function originAllowed(req) {
  const origin = String(req.headers.origin || "");
  if (!origin) return ALLOW_NO_ORIGIN;
  return ALLOWED_ORIGINS.has(origin);
}

function requestIp(req) {
  if (TRUST_PROXY) {
    const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (forwarded) return forwarded;
  }
  return req.socket.remoteAddress || "unknown";
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}

function execFilePromise(file, args) {
  return new Promise((resolve, reject) => {
    execFile(file, args, { timeout: 8_000 }, (error, stdout, stderr) => {
      if (error) reject(Object.assign(error, { stderr }));
      else resolve(stdout);
    });
  });
}

async function runtimeReady() {
  try {
    await execFilePromise(CONTAINER_CLI, ["image", "inspect", SANDBOX_IMAGE]);
    return true;
  } catch {
    return false;
  }
}

function pruneStarts(ip) {
  const cutoff = Date.now() - 60 * 60_000;
  const recent = (startsByIp.get(ip) || []).filter((time) => time > cutoff);
  startsByIp.set(ip, recent);
  return recent;
}

function canStart(ip) {
  if (sessions.size >= MAX_SESSIONS) return { ok: false, reason: "Sandbox capacity reached. Try again later." };
  const perIp = [...sessions.values()].filter((session) => session.ip === ip).length;
  if (perIp >= MAX_SESSIONS_PER_IP) return { ok: false, reason: "Too many active sessions from this address." };
  if (pruneStarts(ip).length >= MAX_STARTS_PER_HOUR) return { ok: false, reason: "Session start rate limit reached." };
  return { ok: true };
}

function broadcast(session, message) {
  const encoded = JSON.stringify(message);
  for (const socket of session.sockets) {
    if (socket.readyState === WebSocket.OPEN) socket.send(encoded);
  }
}

function destroySession(id, reason = "ended") {
  const session = sessions.get(id);
  if (!session || session.destroying) return;
  session.destroying = true;
  sessions.delete(id);
  broadcast(session, { type: "notice", data: "Session " + reason + ". Environment is being destroyed." });
  for (const socket of session.sockets) {
    try { socket.close(1000, reason); } catch {}
  }
  try { session.process.stdin.end(); } catch {}
  execFile(CONTAINER_CLI, ["rm", "-f", session.containerName], { timeout: 8_000 }, () => {
    try { session.process.kill("SIGKILL"); } catch {}
  });
}

async function createSession(ip, req) {
  const allowed = canStart(ip);
  if (!allowed.ok) throw Object.assign(new Error(allowed.reason), { status: 429 });
  if (!(await runtimeReady())) {
    throw Object.assign(new Error("Sandbox image is not available on the runtime host."), { status: 503 });
  }

  const id = randomBytes(10).toString("hex");
  const token = randomBytes(24).toString("base64url");
  const containerName = "portfolio-" + id;
  const createdAt = Date.now();
  const expiresAt = createdAt + SESSION_TTL_MS;

  const args = [
    "run", "--rm", "-i",
    "--name", containerName,
    "--hostname", "sandbox",
    "--network", "none",
    "--memory", "256m",
    "--memory-swap", "256m",
    "--cpus", "0.50",
    "--pids-limit", "64",
    "--read-only",
    "--cap-drop", "ALL",
    "--security-opt", "no-new-privileges:true",
    "--tmpfs", "/tmp:rw,nosuid,nodev,noexec,size=64m",
    "--tmpfs", "/home/guest:rw,nosuid,nodev,size=128m,uid=1000,gid=1000",
    "--user", "1000:1000",
    "--env", "HOME=/home/guest",
    "--env", "TERM=xterm-256color",
    "--env", "HISTFILE=/home/guest/.bash_history",
    "--ulimit", "nofile=256:256",
    SANDBOX_IMAGE,
  ];

  const child = spawn(CONTAINER_CLI, args, { stdio: ["pipe", "pipe", "pipe"] });
  const session = {
    id, token, ip, containerName, process: child,
    sockets: new Set(), buffer: "", createdAt, expiresAt,
    lastActivity: createdAt, destroying: false,
  };
  sessions.set(id, session);
  startsByIp.set(ip, [...pruneStarts(ip), Date.now()]);

  const output = (chunk) => {
    session.lastActivity = Date.now();
    const data = chunk.toString("utf8");
    if (session.sockets.size) broadcast(session, { type: "output", data });
    else session.buffer = (session.buffer + data).slice(-65_536);
  };
  child.stdout.on("data", output);
  child.stderr.on("data", output);
  child.on("error", (error) => {
    broadcast(session, { type: "notice", data: "Container runtime error: " + error.message });
    destroySession(id, "runtime-error");
  });
  child.on("exit", () => {
    if (sessions.has(id)) {
      broadcast(session, { type: "notice", data: "Linux process exited. Environment destroyed." });
      sessions.delete(id);
      for (const socket of session.sockets) {
        try { socket.close(1000, "process-exited"); } catch {}
      }
    }
  });

  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const proto = PUBLIC_BASE_URL
    ? PUBLIC_BASE_URL
    : (forwardedProto || "http") + "://" + req.headers.host;
  const wsBase = proto.replace(/^http:/, "ws:").replace(/^https:/, "wss:");

  return {
    id,
    token,
    createdAt: new Date(createdAt).toISOString(),
    expiresAt: new Date(expiresAt).toISOString(),
    wsUrl: wsBase + "/ws/" + id + "?token=" + encodeURIComponent(token),
  };
}

async function handleRequest(req, res) {
  const origin = String(req.headers.origin || "");
  if (req.method === "OPTIONS") {
    if (!origin || !ALLOWED_ORIGINS.has(origin)) return json(res, 403, { error: "Origin not allowed." });
    res.writeHead(204, {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Max-Age": "600",
    });
    return res.end();
  }

  const url = new URL(req.url || "/", "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/health") {
    const ready = await runtimeReady();
    return json(res, ready ? 200 : 503, {
      ready,
      activeSessions: sessions.size,
      capacity: MAX_SESSIONS,
      image: SANDBOX_IMAGE,
    }, origin);
  }

  if (req.method === "GET" && url.pathname === "/") {
    return json(res, 200, {
      service: "portfolio-sandbox-gateway",
      ephemeral: true,
      network: "disabled",
    }, origin);
  }

  if (!originAllowed(req)) return json(res, 403, { error: "Origin not allowed." }, origin);

  if (req.method === "POST" && url.pathname === "/api/sessions") {
    req.resume();
    try {
      const session = await createSession(requestIp(req), req);
      return json(res, 201, session, origin);
    } catch (error) {
      return json(res, error.status || 500, { error: error.message || "Unable to create session." }, origin);
    }
  }

  const match = url.pathname.match(/^\/api\/sessions\/([a-f0-9]{20})$/);
  if (req.method === "DELETE" && match) {
    const session = sessions.get(match[1]);
    if (!session) return json(res, 404, { error: "Session not found." }, origin);
    const auth = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!safeEqual(auth, session.token)) return json(res, 401, { error: "Invalid session token." }, origin);
    destroySession(session.id, "closed-by-client");
    return json(res, 200, { destroyed: true }, origin);
  }

  return json(res, 404, { error: "Not found." }, origin);
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => json(res, 500, { error: error.message || "Internal error." }));
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 20_000 });

server.on("upgrade", (req, socket, head) => {
  const origin = String(req.headers.origin || "");
  if ((!origin && !ALLOW_NO_ORIGIN) || (origin && !ALLOWED_ORIGINS.has(origin))) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    return socket.destroy();
  }
  const url = new URL(req.url || "/", "http://localhost");
  const match = url.pathname.match(/^\/ws\/([a-f0-9]{20})$/);
  const session = match ? sessions.get(match[1]) : null;
  const token = url.searchParams.get("token") || "";
  if (!session || !safeEqual(token, session.token)) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    return socket.destroy();
  }
  if (session.sockets.size >= 1) {
    socket.write("HTTP/1.1 409 Conflict\r\n\r\n");
    return socket.destroy();
  }
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, session));
});

wss.on("connection", (ws, session) => {
  session.sockets.add(ws);
  session.lastActivity = Date.now();
  ws.send(JSON.stringify({ type: "notice", data: "Connected to isolated Linux sandbox." }));
  if (session.buffer) {
    ws.send(JSON.stringify({ type: "output", data: session.buffer }));
    session.buffer = "";
  }

  ws.on("message", (raw) => {
    session.lastActivity = Date.now();
    try {
      const message = JSON.parse(raw.toString());
      if (message.type === "input" && typeof message.data === "string" && message.data.length <= 16_384) {
        if (!session.process.stdin.destroyed) session.process.stdin.write(message.data);
      }
      if (message.type === "resize") {
        const cols = Math.max(40, Math.min(240, Number(message.cols) || 120));
        const rows = Math.max(12, Math.min(80, Number(message.rows) || 34));
        ws.send(JSON.stringify({ type: "resize-ack", cols, rows }));
      }
    } catch {
      ws.send(JSON.stringify({ type: "notice", data: "Invalid terminal frame ignored." }));
    }
  });

  ws.on("close", () => {
    session.sockets.delete(ws);
    if (!session.sockets.size && sessions.has(session.id)) destroySession(session.id, "browser-disconnected");
  });
});

setInterval(() => {
  const now = Date.now();
  for (const session of sessions.values()) {
    if (now >= session.expiresAt) destroySession(session.id, "ttl-expired");
    else if (now - session.lastActivity >= IDLE_TTL_MS) destroySession(session.id, "idle-timeout");
  }
}, 15_000).unref();

async function shutdown() {
  for (const id of [...sessions.keys()]) destroySession(id, "gateway-shutdown");
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5_000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

server.listen(PORT, HOST, () => {
  console.log("portfolio-sandbox-gateway listening on http://" + HOST + ":" + PORT);
});
