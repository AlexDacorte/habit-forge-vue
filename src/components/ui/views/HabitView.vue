<template>
  <div class="habits-view-wrapper">
    <HabitsCardMinimal
      v-for="habit in habits"
      :key="habit.id"
      v-bind="habit"
      :title="habit.title"
      :frequency="habit.progress"
      :accentColor="habit.color"
    />
  </div>
</template>
<script setup lang="ts">
import HabitsCardMinimal from "@/components/ui/shared/HabitsCardMinimal.vue";
import type { Habit } from "@/types/habit";
import { useHabitStore } from "@/stores/useHabitStore";
import { ref, onMounted } from "vue";
const useStore = useHabitStore();
const habits = ref<Habit[]>([]);
onMounted(() => {
  habits.value.push(...useStore.fetchHabits());
});
</script>
<style scoped>
.habits-view-wrapper {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}
</style>
