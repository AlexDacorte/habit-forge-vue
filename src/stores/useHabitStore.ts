import { defineStore } from "pinia";
import type { Habit, HabitLog } from "@/types/habit";

const HABITS_KEY = "habits-tracker-habits";
const LOGS_KEY = "habits-tracker-logs";
const CUSTOM_COLORS_KEY = "habits-tracker-custom-colors";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function loadInitialState() {
  const existingHabits = loadFromStorage<Habit[]>(HABITS_KEY, []).filter(
    (habit) => !habit.id.startsWith("demo-"),
  );
  const validHabitIds = new Set(existingHabits.map((habit) => habit.id));
  const existingLogs = loadFromStorage<HabitLog[]>(LOGS_KEY, []).filter(
    (log) => validHabitIds.has(log.habitId),
  );

  return {
    habits: existingHabits,
    logs: existingLogs,
    customColors: loadFromStorage<string[]>(CUSTOM_COLORS_KEY, []),
  };
}

type NewHabit = Omit<Habit, "id" | "createdAt" | "archived">;

export const useHabitStore = defineStore("habits", {
  state: () => ({
    habits: [] as Habit[],
    logs: [] as HabitLog[],
    customColors: [] as string[],
    isLoaded: false,
  }),
  getters: {
    activeHabits: (state) => state.habits.filter((habit) => !habit.archived),
  },
  actions: {
    saveState() {
      localStorage.setItem(HABITS_KEY, JSON.stringify(this.habits));
      localStorage.setItem(LOGS_KEY, JSON.stringify(this.logs));
      localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(this.customColors));
    },
    ensureLoaded() {
      if (this.isLoaded) {
        return;
      }

      const initial = loadInitialState();
      this.habits = initial.habits;
      this.logs = initial.logs;
      this.customColors = initial.customColors;
      this.isLoaded = true;
      this.saveState();
    },
    addCustomColor(color: string) {
      this.ensureLoaded();
      if (!this.customColors.includes(color)) {
        this.customColors = [...this.customColors, color];
        this.saveState();
      }
    },
    addHabit(habit: NewHabit) {
      this.ensureLoaded();
      const created: Habit = {
        ...habit,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        archived: false,
      };
      this.habits = [...this.habits, created];
      this.saveState();
      return created;
    },
    updateHabit(id: string, updates: Partial<Omit<Habit, "id" | "createdAt">>) {
      this.ensureLoaded();
      this.habits = this.habits.map((habit) =>
        habit.id === id ? { ...habit, ...updates } : habit,
      );
      this.saveState();
    },
    deleteHabit(id: string) {
      this.ensureLoaded();
      this.habits = this.habits.filter((habit) => habit.id !== id);
      this.logs = this.logs.filter((log) => log.habitId !== id);
      this.saveState();
    },
    logHabit(habitId: string, date: string, value: number) {
      this.ensureLoaded();
      const filtered = this.logs.filter(
        (log) => !(log.habitId === habitId && log.date === date),
      );

      this.logs =
        value > 0
          ? [...filtered, { habitId, date, value }]
          : filtered;

      this.saveState();
    },
    getLog(habitId: string, date: string) {
      return this.logs.find((log) => log.habitId === habitId && log.date === date)
        ?.value ?? 0;
    },
    getLogsForHabit(habitId: string) {
      return this.logs.filter((log) => log.habitId === habitId);
    },
    importData(habits: Habit[], logs: HabitLog[]) {
      this.habits = habits;
      this.logs = logs;
      this.isLoaded = true;
      this.saveState();
    },
  },
});
