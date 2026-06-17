<template>
  <article class="tracker-card">
    <div class="color-band"></div>

    <div class="card-content">
      <div class="top-row">
        <div>
          <div class="title-line">
            <h2 class="title">{{ habit.name }}</h2>
            <span v-if="isComplete" class="done-badge">Done</span>
          </div>
          <p class="target-label">Target: {{ habit.target }} {{ habit.unit }}</p>
        </div>
        <div v-if="streak > 0" class="streak-pill">
          {{ streak }}
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
      </div>

      <div class="controls-row">
        <div class="counter">
          <button
            class="btn"
            aria-label="Decrease progress"
            @click.stop.prevent="$emit('log', Math.max(0, currentValue - 1))"
          >
            -
          </button>

          <span class="count-display">{{ currentValue }}</span>

          <button
            class="btn"
            aria-label="Increase progress"
            @click.stop.prevent="$emit('log', currentValue + 1)"
          >
            +
          </button>
        </div>

        <div class="total-label">/ {{ habit.target }} {{ habit.unit }}</div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { resolveHabitColor, type Habit } from "@/types/habit";

const props = defineProps<{
  habit: Habit;
  currentValue: number;
  streak: number;
}>();

defineEmits<{
  log: [value: number];
}>();

const currentColor = computed(() => resolveHabitColor(props.habit.color));
const progressPercentage = computed(() => {
  if (props.habit.target <= 0) {
    return 0;
  }

  return Math.min((props.currentValue / props.habit.target) * 100, 100);
});

const isComplete = computed(() => props.currentValue >= props.habit.target);
</script>

<style scoped>
.tracker-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 4px solid #000000;
  background-color: #fdfdf2;
  box-shadow: 8px 8px 0 #000000;
  font-family: var(--font-body);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.tracker-card:hover {
  box-shadow: var(--neo-shadow-lg);
  transform: translate(-2px, -2px);
}

.color-band {
  position: absolute;
  inset: 0 auto 0 0;
  width: 12px;
  background-color: v-bind(currentColor);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 18px 18px 18px 26px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.title-line {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  font-family: var(--font-title);
}

.done-badge,
.streak-pill {
  border: 3px solid #000000;
  background: v-bind(currentColor);
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 900;
}

.target-label,
.total-label {
  margin: 0;
  color: #555555;
  font-size: 0.98rem;
  font-weight: 700;
}

.progress-container {
  width: 100%;
  height: 18px;
  border: 3px solid #000000;
  background-color: #eae6db;
}

.progress-fill {
  height: 100%;
  background-color: v-bind(currentColor);
  border-right: 2px solid #000000;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.counter {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn {
  min-height: 42px;
  min-width: 42px;
  border: 4px solid #000000;
  background-color: #ffffff;
  box-shadow: 4px 4px 0 #000000;
  font-size: 1.2rem;
  font-weight: 900;
  cursor: pointer;
}

.count-display {
  min-width: 4rem;
  text-align: center;
  font-size: 1.7rem;
  font-weight: 900;
}
</style>
