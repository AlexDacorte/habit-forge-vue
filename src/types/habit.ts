export type Habit = {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
  progress: number;
  target: number;
  unit: string;
  color: string;
  createdAt: string;
  archived: boolean;
  reminderTime?: string;
};

export type HabitLog = {
  habitId: string;
  date: string;
  value: number;
};
