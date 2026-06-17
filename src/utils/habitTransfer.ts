import { jsPDF } from "jspdf";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { habitUnits, type Habit } from "@/types/habit";
import { getTodayDateKey } from "@/utils/habit";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const exportHeaders = [
  "id",
  "title",
  "description",
  "categoryIds",
  "target",
  "unit",
  "progress",
  "color",
  "createdAt",
  "archived",
] as const;

type ExportHeader = (typeof exportHeaders)[number];

const ensureHabitUnit = (value: string): Habit["unit"] => {
  return habitUnits.includes(value as Habit["unit"])
    ? (value as Habit["unit"])
    : "problem";
};

const csvEscape = (value: string) => {
  const safe = value.replace(/"/g, '""');
  return /[",\n]/.test(safe) ? `"${safe}"` : safe;
};

const serializeHabitField = (habit: Habit, header: ExportHeader) => {
  if (header === "categoryIds") {
    return habit.categoryIds.join("|");
  }

  return String(habit[header]);
};

const buildTxtRecord = (habit: Habit) => {
  return [
    "HABIT",
    ...exportHeaders.map((header) => `${header}: ${serializeHabitField(habit, header)}`),
  ].join("\n");
};

const downloadBlob = (content: BlobPart, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportHabitsAsCsv = (habits: Habit[]) => {
  const rows = [
    exportHeaders.join(","),
    ...habits.map((habit) =>
      exportHeaders
        .map((header) => csvEscape(serializeHabitField(habit, header)))
        .join(","),
    ),
  ];

  downloadBlob(rows.join("\n"), "habit-forge-export.csv", "text/csv;charset=utf-8");
};

export const exportHabitsAsTxt = (habits: Habit[]) => {
  const content = [
    "Habit Forge Export",
    `Generated: ${new Date().toISOString()}`,
    "",
    ...habits.map((habit) => buildTxtRecord(habit)),
  ].join("\n\n");

  downloadBlob(content, "habit-forge-export.txt", "text/plain;charset=utf-8");
};

export const exportHabitsAsPdf = (habits: Habit[]) => {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  let y = 48;

  doc.setFont("courier", "bold");
  doc.setFontSize(28);
  doc.text("HABIT FORGE EXPORT", 40, y);
  y += 28;

  doc.setFont("courier", "normal");
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toISOString()}`, 40, y);
  y += 24;

  habits.forEach((habit, index) => {
    const block = buildTxtRecord(habit).split("\n");
    const estimatedHeight = block.length * 16 + 12;

    if (y + estimatedHeight > 780) {
      doc.addPage();
      y = 48;
    }

    doc.setFont("courier", "bold");
    doc.setFontSize(14);
    doc.text(`Habit ${index + 1}`, 40, y);
    y += 18;

    doc.setFont("courier", "normal");
    doc.setFontSize(11);
    block.forEach((line) => {
      doc.text(line, 40, y);
      y += 14;
    });
    y += 12;
  });

  doc.save("habit-forge-export.pdf");
};

const parseCsvLines = (content: string) => {
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
      if (currentRow.some((field) => field.trim() !== "")) {
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
};

const normalizeImportedHabit = (record: Partial<Record<ExportHeader, string>>): Habit | null => {
  const title = record.title?.trim();
  const description = record.description?.trim();
  const target = Number(record.target);
  const progress = Number(record.progress ?? "0");
  const unit = ensureHabitUnit(record.unit?.trim() ?? "problem");
  const color = record.color?.trim() || "#6320ee";
  const createdAt = record.createdAt?.trim() || getTodayDateKey();
  const categoryIds = (record.categoryIds ?? "")
    .split(/[|,]/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (!title || !description || Number.isNaN(target) || target <= 0) {
    return null;
  }

  return {
    id: record.id?.trim() || crypto.randomUUID(),
    title,
    description,
    categoryIds,
    target,
    unit,
    progress: Number.isNaN(progress) ? 0 : progress,
    color,
    createdAt,
    archived: record.archived?.trim() === "true",
  };
};

export const importHabitsFromCsv = async (file: File) => {
  const content = await file.text();
  const [headers = [], ...rows] = parseCsvLines(content);
  const normalizedHeaders = headers.map((header) => header.trim()) as ExportHeader[];

  return rows
    .map((row) => {
      const record = Object.fromEntries(
        normalizedHeaders.map((header, index) => [header, row[index] ?? ""]),
      ) as Partial<Record<ExportHeader, string>>;
      return normalizeImportedHabit(record);
    })
    .filter((habit): habit is Habit => Boolean(habit));
};

const parseTxtBlock = (block: string) => {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const record: Partial<Record<ExportHeader, string>> = {};

  lines.forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim() as ExportHeader;
    const value = line.slice(separatorIndex + 1).trim();
    if (exportHeaders.includes(key)) {
      record[key] = value;
    }
  });

  return normalizeImportedHabit(record);
};

export const importHabitsFromTxt = async (file: File) => {
  const content = await file.text();

  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("HABIT"))
    .map(parseTxtBlock)
    .filter((habit): habit is Habit => Boolean(habit));
};

export const importHabitsFromPdf = async (file: File) => {
  const data = await file.arrayBuffer();
  const document = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join("\n");
    pages.push(pageText);
  }

  return pages
    .join("\n")
    .split(/\bHABIT\b/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => parseTxtBlock(`HABIT\n${block}`))
    .filter((habit): habit is Habit => Boolean(habit));
};
