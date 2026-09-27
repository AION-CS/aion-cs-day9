/** Lowercase ASCII, spaces to "-", diacritics stripped (ü → u, ß → ss). */
export function slug(input: string): string {
  return input
    .trim()
    .replace(/ß/g, "ss")
    .replace(/æ/gi, "ae")
    .replace(/ø/gi, "o")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TaskSlug = "l1l2-real-time-file" | "l3-real-time-memo";
export const TASK_NUMBER: Record<TaskSlug, 1 | 2> = { "l1l2-real-time-file": 1, "l3-real-time-memo": 2 };

/** `{route}-{name}-day9-{task}`, e.g. `1-muchson-day9-l1l2-real-time-file`. The file name stays English in both languages. */
export function exportName(name: string, task: TaskSlug): string {
  return `${TASK_NUMBER[task]}-${slug(name) || "participant"}-day9-${task}`;
}
