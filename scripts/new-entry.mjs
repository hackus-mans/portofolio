import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// GitHub form values are read as data, never inserted into shell commands.
export async function createEntry(input, root = process.cwd()) {
  const { category = "notes", title = "", summary = "", body = "", tags = "", status = "draft" } = input;
  if (!["notes", "labs", "writeups"].includes(category)) throw Error("Catégorie : notes, labs ou writeups.");
  if (!["draft", "published"].includes(status)) throw Error("Statut : draft ou published.");
  if (!title.trim() || title.length > 160) throw Error("Le titre doit contenir entre 1 et 160 caractères.");
  if (!summary.trim() || summary.length > 400) throw Error("Le résumé doit contenir entre 1 et 400 caractères.");
  if (status === "published" && !body.trim()) throw Error("Le texte de la publication est obligatoire.");
  const slug = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80).replace(/-$/, "");
  if (!slug) throw Error("Ajoute au moins une lettre latine ou un chiffre au titre.");
  const date = new Date().toISOString().slice(0, 10);
  const name = `${date}-${slug}.md`;
  const extra = category === "notes" ? 'topic: "Journal"' : category === "labs" ? 'domain: "Cybersécurité"\nstate: "active"' : 'platform: "Personnel"';
  const content = `---\ntitle: ${JSON.stringify(title.trim())}\nsummary: ${JSON.stringify(summary.trim())}\npublishedAt: ${date}\ntags: ${JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean))}\nstatus: ${JSON.stringify(status)}\n${extra}\n---\n\n${body.trim() || "## Observation\n\nÀ compléter.\n\n## Hypothèse et test\n\nÀ compléter.\n\n## Résultat et interprétation\n\nÀ compléter.\n\n## Prochaine étape\n\nÀ compléter."}\n`;
  const relative = `src/content/${category}/${name}`;
  const target = resolve(root, relative);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, { flag: "wx" }); // Never overwrite an existing entry.
  return relative;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const fromForm = process.argv.includes("--from-env");
    const [, , category, title, summary] = process.argv;
    const input = fromForm ? {
      category: process.env.ENTRY_CATEGORY, title: process.env.ENTRY_TITLE,
      summary: process.env.ENTRY_SUMMARY, body: process.env.ENTRY_BODY,
      tags: process.env.ENTRY_TAGS, status: "published"
    } : { category, title, summary };
    const file = await createEntry(input);
    console.log(`Créé : ${file}`);
    if (!fromForm) console.log('Complète le texte, puis remplace status: "draft" par status: "published".');
  } catch (error) {
    console.error(error.code === "EEXIST" ? "Une publication de ce nom existe déjà : choisis un titre différent." : error.message);
    process.exitCode = 1;
  }
}
