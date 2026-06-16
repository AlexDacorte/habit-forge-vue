import { defineStore } from "pinia";
import mockHabits from "@/mock/mockHabits.json";
import mockCategories from "@/mock/mockCategories.json";
import { habitUnits, type Habit } from "@/types/habit";
import type { Category } from "@/types/category";
import { getTodayDateKey } from "@/utils/habit";

type HabitRecord = Omit<Habit, "unit" | "createdAt"> & {
  unit: string;
  createdAt?: string;
};

const normalizeHabitUnit = (unit: string): Habit["unit"] => {
  return habitUnits.includes(unit as Habit["unit"])
    ? (unit as Habit["unit"])
    : "problem";
};

const normalizeHabit = (habit: HabitRecord): Habit => ({
  ...habit,
  unit: normalizeHabitUnit(habit.unit),
  createdAt: habit.createdAt ?? getTodayDateKey(),
});

export const useHabitStore = defineStore("habits", {
  state: () => ({
    habits: [] as Habit[],
    categories: [] as Category[],
    isLoading: false,
    error: null,
  }),
  getters: {
    getHabits: (state) => {
      return state.habits;
    },
    getCategories: (state) => {
      return state.categories;
    },
  },
  actions: {
    createHabit(...habit: Habit[]) {
      this.habits = [...this.habits, ...habit.map(normalizeHabit)];
      localStorage.setItem("habit-storage", JSON.stringify(this.habits));
    },
    updateHabitProgress(habitId: string, progress: number) {
      this.habits = this.habits.map((habit) =>
        habit.id === habitId ? { ...habit, progress } : habit,
      );
      localStorage.setItem("habit-storage", JSON.stringify(this.habits));
    },
    createCategory(...category: Category[]) {
      this.categories = [...this.categories, ...category];
      localStorage.setItem("category-storage", JSON.stringify(this.categories));
    },
    fetchHabits() {
      this.isLoading = true;
      const storedHabits = localStorage.getItem("habit-storage");
      if (storedHabits) {
        this.habits = JSON.parse(storedHabits).map(normalizeHabit);
      } else {
        this.habits = mockHabits.habits.map(normalizeHabit);
      }
      this.isLoading = false;
      return this.habits;
    },
    fetchCategories() {
      this.isLoading = true;
      const storedCategories = localStorage.getItem("category-storage");
      if (storedCategories) {
        this.categories = JSON.parse(storedCategories);
      } else {
        this.categories = mockCategories.Categories;
      }
      this.isLoading = false;
      return this.categories;
    },
  },
});
