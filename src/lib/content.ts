export function slugFromId(id: string) {
  return id.replace(/\.md$/i, "").replace(/\/index$/i, "");
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}
