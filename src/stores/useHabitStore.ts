import { defineStore } from "pinia";
import mockHabits from "@/mock/mockHabits.json";
import { Habit } from "@/types/habit";

export const useHabitStore = defineStore("habits", {
  state: () => ({
    habits: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    getHabits: (state) => {
      state.habits;
    },
  },
  actions: {},
});
