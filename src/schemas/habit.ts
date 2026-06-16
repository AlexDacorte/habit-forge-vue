import { z } from "zod";
import { habitUnits } from "@/types/habit";

export const habitFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters."),
  target: z.coerce.number().positive("Target must be greater than 0."),
  unit: z.enum(habitUnits, {
    error: "Choose a supported unit.",
  }),
  categoryIds: z
    .array(z.string())
    .min(1, "Select at least one category."),
  color: z
    .string()
    .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Choose a color."),
  createdAt: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Choose a valid date."),
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;
