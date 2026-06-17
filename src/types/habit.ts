export const HABIT_CATEGORIES = [
  "Health",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Productivity",
  "Creative",
  "Social",
  "Other",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

export interface Habit {
  id: string;
  name: string;
  target: number;
  unit: string;
  color: HabitColor;
  category?: HabitCategory;
  createdAt: string;
  archived: boolean;
  reminderTime?: string;
}

export interface HabitLog {
  habitId: string;
  date: string;
  value: number;
}

export type HabitColor = string;

export const HABIT_COLORS = {
  yellow: "hsl(50 100% 60%)",
  pink: "hsl(340 85% 65%)",
  cyan: "hsl(185 85% 55%)",
  lime: "hsl(90 75% 55%)",
  orange: "hsl(25 95% 55%)",
  purple: "hsl(262 80% 60%)",
} as const satisfies Record<string, string>;

export function resolveHabitColor(color: HabitColor) {
  return color in HABIT_COLORS
    ? HABIT_COLORS[color as keyof typeof HABIT_COLORS]
    : color;
}
