import { defineStore } from "pinia";
import mockHabits from "@/mock/mockHabits.json";
import mockCategories from "@/mock/mockCategories.json";
import type { Habit } from "@/types/habit";
import type { Category } from "@/types/category";

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
      this.habits = [...this.habits, ...habit];
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
        this.habits = JSON.parse(storedHabits);
      } else {
        this.habits = mockHabits.habits;
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
