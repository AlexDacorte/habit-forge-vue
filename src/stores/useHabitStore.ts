import { defineStore } from "pinia";
import mockHabits from "@/mock/mockHabits.json";
import { Habit } from "@/types/habit";

export const useHabitStore = defineStore("habits", {
  state: () => ({
    habits: [] as Habit[],
    isLoading: false,
    error: null,
  }),
  getters: {
    getHabits: (state) => {
      return state.habits;
    },
  },
  actions: {
    createHabit(...habit: Habit[]) {
      this.habits=[...this.habits, ...habit];
      localStorage.setItem('habit-storage', JSON.stringify(this.habits));
    },
  }});

