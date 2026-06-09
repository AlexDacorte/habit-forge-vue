<template>
    <div class="habits-view-wrapper">
        
        <HabitsCardMinimal v-for="habit in habits" :key="habit.id" v-bind="habit" :title="habit.name" :frequency="habit.progress" :accentColor="habit.color" />
    </div>
</template>
<script setup lang="ts">
import HabitsCardMinimal from "@/components/ui/shared/HabitsCardMinimal.vue";
import MockHabitsData from "@/mock/mockData.json";

const habits = MockHabitsData.habits;
</script>
<style scoped>
.habits-view-wrapper {
    height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
   gap:4rem;
}
</style>