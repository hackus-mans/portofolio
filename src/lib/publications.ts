import { getCollection } from "astro:content";
import { formatDate, slugFromId } from "./content";

/** One source for the home feed, counters and full journal. Drafts are excluded from the site. */
export async function getPublications() {
  const groups = await Promise.all([
    getCollection("notes"), getCollection("labs"), getCollection("writeups"),
    getCollection("ctf"), getCollection("homelab")
  ]);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "") + "/";
  const labels = { notes: "Note", labs: "Lab", writeups: "Write-up", ctf: "Compétition CTF", homelab: "Home Lab" };
  return groups.flat().filter(entry => entry.data.status === "published")
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime() || a.id.localeCompare(b.id))
    .map(entry => ({
      title: entry.data.title, summary: entry.data.summary,
      kind: labels[entry.collection], tags: entry.data.tags,
      href: `${base}${entry.collection}/${entry.collection==="ctf"||entry.collection==="homelab"?slugFromId(entry.id).replace(/^obsidian\//,""):slugFromId(entry.id)}/`,
      date: entry.data.publishedAt, dateText: formatDate(entry.data.publishedAt)
    }));
}
