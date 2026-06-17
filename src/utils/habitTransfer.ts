import type { Habit, HabitLog } from "@/types/habit";

const habitHeaders = [
  "type",
  "id",
  "name",
  "target",
  "unit",
  "color",
  "category",
  "createdAt",
  "archived",
  "reminderTime",
] as const;

const logHeaders = ["type", "habitId", "date", "value"] as const;

function csvEscape(value: string) {
  const safe = value.replace(/"/g, '""');
  return /[",\n]/.test(safe) ? `"${safe}"` : safe;
}

export function exportHabitsCsv(habits: Habit[], logs: HabitLog[]) {
  const rows = [
    habitHeaders.join(","),
    ...habits.map((habit) =>
      [
        "habit",
        habit.id,
        habit.name,
        String(habit.target),
        habit.unit,
        habit.color,
        habit.category ?? "",
        habit.createdAt,
        String(habit.archived),
        habit.reminderTime ?? "",
      ]
        .map(csvEscape)
        .join(","),
    ),
    logHeaders.join(","),
    ...logs.map((log) =>
      ["log", log.habitId, log.date, String(log.value)].map(csvEscape).join(","),
    ),
  ];

  return rows.join("\n");
}

export function downloadCsv(content: string, fileName: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function parseCsv(content: string) {
  const rows: string[][] = [];
  let currentField = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const nextChar = content[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      currentRow.push(currentField);
      if (currentRow.some((value) => value.trim() !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
      continue;
    }

    currentField += char;
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

export function importHabitsCsv(content: string) {
  const rows = parseCsv(content);
  const habits: Habit[] = [];
  const logs: HabitLog[] = [];
  let mode: "habit" | "log" | null = null;

  rows.forEach((row) => {
    if (row[0] === "type" && row[1] === "id") {
      mode = "habit";
      return;
    }

    if (row[0] === "type" && row[1] === "habitId") {
      mode = "log";
      return;
    }

    if (mode === "habit" && row[0] === "habit") {
      const [
        _type,
        id,
        name,
        target,
        unit,
        color,
        category,
        createdAt,
        archived,
        reminderTime,
      ] = row;

      if (!id || !name || !target || !unit || !color || !createdAt) {
        return;
      }

      habits.push({
        id,
        name,
        target: Number(target),
        unit,
        color: color as Habit["color"],
        category: category ? (category as Habit["category"]) : undefined,
        createdAt,
        archived: archived === "true",
        reminderTime: reminderTime || undefined,
      });
      return;
    }

    if (mode === "log" && row[0] === "log") {
      const [, habitId, date, value] = row;
      if (!habitId || !date || !value) {
        return;
      }

      logs.push({
        habitId,
        date,
        value: Number(value),
      });
    }
  });

  return { habits, logs };
}
