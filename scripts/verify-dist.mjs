import fs from "node:fs";
import path from "node:path";
const root=path.resolve("dist");
const base="/portofolio/";
const required=[
 "index.html","about/index.html","projects/index.html",
 "projects/cybermind-x/index.html","projects/honeyshield/index.html",
 "projects/lumina-academy/index.html","projects/mcp-automation/index.html",
 "projects/labs-ctf/index.html","writeups/index.html","labs/index.html",
 "notes/index.html","roadmap/index.html","journal/index.html"
];
const bad=[];
for(const rel of required){if(!fs.existsSync(path.join(root,rel)))bad.push("Route missing: "+rel)}
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(v=>v.isDirectory()?walk(path.join(dir,v.name)):[path.join(dir,v.name)]);
const htmls=walk(root).filter(f=>f.endsWith(".html"));
for(const file of htmls){
 const content=fs.readFileSync(file,"utf8");
 for(const [,uri] of content.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(!uri.startsWith(base))continue;
  let rel=uri.slice(base.length).split(/[?#]/)[0];
  try{rel=decodeURIComponent(rel)}catch{}
  const local=path.join(root,rel.endsWith("/")||!rel?"index.html":"");
  // Rebuild the target explicitly for URL paths (root, directory, or asset).
  const target=path.join(root,rel,rel===""||rel.endsWith("/")?"index.html":"");
  const alt=path.join(root,rel,"index.html");
  if(!fs.existsSync(target)&&!fs.existsSync(alt))bad.push(path.relative(root,file)+": broken internal asset/link "+uri);
 }
}
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
for(const marker of ["Security Constellation","CyberMind X","Comprendre. Construire.","Dernières publications","Exercices","NAKORE"]){
 if(!home.includes(marker))bad.push("Homepage marker missing: "+marker);
}
if(bad.length){console.error("Site checks failed:\n"+bad.join("\n"));process.exit(1)}
console.log("Site checks passed: "+htmls.length+" HTML pages; "+required.length+" required routes; all internal href/src references resolved.");
