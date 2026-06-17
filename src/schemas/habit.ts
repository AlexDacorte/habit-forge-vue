import { z } from "zod";
import { HABIT_CATEGORIES } from "@/types/habit";

const hexColorRegex = /^#([0-9a-fA-F]{6})$/;

export const habitFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  target: z.coerce.number().positive("Target must be greater than 0."),
  unit: z.string().trim().min(1, "Unit is required."),
  category: z.enum(HABIT_CATEGORIES),
  color: z
    .string()
    .trim()
    .refine(
      (value) =>
        ["yellow", "pink", "cyan", "lime", "orange", "purple"].includes(value) ||
        hexColorRegex.test(value),
      "Choose a valid color.",
    ),
  reminderTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Choose a valid reminder time.")
    .optional()
    .or(z.literal("")),
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;
