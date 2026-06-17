export const habitUnits = ["ml", "problem", "km", "minutes", "days", "weeks"] as const;

export type HabitUnit = (typeof habitUnits)[number];

export type Habit = {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
  progress: number;
  target: number;
  unit: HabitUnit;
  color: string;
  createdAt: string;
  archived: boolean;
};

export type HabitLog = {
  habitId: string;
  date: string;
  value: number;
};
