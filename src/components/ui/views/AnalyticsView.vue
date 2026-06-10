<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";

type HabitAnalytics = {
  id: number;
  name: string;
  color: string;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  dailyCompletions: number[];
};

const habits = [
  {
    id: 1,
    name: "Drink Water",
    color: "#37c9db",
    currentStreak: 0,
    bestStreak: 5,
    completionRate: 14,
    dailyCompletions: [0, 5, 8, 6, 8, 5, 8, 7, 7, 8, 6, 0, 0, 0],
  },
  {
    id: 2,
    name: "Read",
    color: "#ffe593",
    currentStreak: 3,
    bestStreak: 7,
    completionRate: 61,
    dailyCompletions: [2, 4, 5, 3, 6, 4, 7, 5, 6, 7, 4, 5, 6, 4],
  },
  {
    id: 3,
    name: "Exercise",
    color: "#f7a7b7",
    currentStreak: 4,
    bestStreak: 8,
    completionRate: 68,
    dailyCompletions: [3, 5, 6, 4, 7, 5, 8, 7, 6, 8, 5, 6, 7, 6],
  },
  {
    id: 4,
    name: "Meditate",
    color: "#c7a5ef",
    currentStreak: 6,
    bestStreak: 9,
    completionRate: 79,
    dailyCompletions: [4, 6, 7, 6, 8, 7, 8, 8, 7, 8, 6, 7, 8, 7],
  },
] satisfies HabitAnalytics[];

const defaultHabit = habits[0] as HabitAnalytics;

const labels = [
  "May 27",
  "May 28",
  "May 29",
  "May 30",
  "May 31",
  "Jun 1",
  "Jun 2",
  "Jun 3",
  "Jun 4",
  "Jun 5",
  "Jun 6",
  "Jun 7",
  "Jun 8",
  "Jun 9",
];

const selectedHabitId = ref(defaultHabit.id);
const chartMax = 8;

const selectedHabit = computed<HabitAnalytics>(
  () => habits.find((habit) => habit.id === selectedHabitId.value) ?? defaultHabit,
);

const targetLineOffset = computed(() => `${100 - (chartMax / chartMax) * 100}%`);
</script>

<template>
  <section class="analytics-view">
    <header class="analytics-header">
      <h1 class="analytics-title">ANALYTICS</h1>
    </header>

    <div class="habit-tabs" role="tablist" aria-label="Habit analytics filters">
      <button
        v-for="habit in habits"
        :key="habit.id"
        class="habit-tab"
        :class="{ 'is-active': habit.id === selectedHabit.id }"
        :style="{ '--tab-color': habit.color }"
        :aria-pressed="habit.id === selectedHabit.id"
        @click="selectedHabitId = habit.id"
      >
        {{ habit.name.toUpperCase() }}
      </button>
    </div>

    <div class="stats-grid">
      <article class="stat-card stat-card-accent" :style="{ '--accent-color': selectedHabit.color }">
        <Icon icon="solar:flame-bold-outline" class="stat-icon" />
        <strong class="stat-value">{{ selectedHabit.currentStreak }}</strong>
        <span class="stat-label">CURRENT STREAK</span>
      </article>

      <article class="stat-card">
        <Icon icon="solar:cup-star-bold-outline" class="stat-icon" />
        <strong class="stat-value">{{ selectedHabit.bestStreak }}</strong>
        <span class="stat-label">BEST STREAK</span>
      </article>
    </div>

    <section class="panel">
      <div class="panel-header">
        <h2 class="panel-title">7-DAY COMPLETION</h2>
        <span class="panel-metric">{{ selectedHabit.completionRate }}%</span>
      </div>
      <div class="completion-track" aria-hidden="true">
        <div
          class="completion-fill"
          :style="{
            width: `${selectedHabit.completionRate}%`,
            backgroundColor: selectedHabit.color,
          }"
        />
      </div>
    </section>

    <section class="panel chart-panel">
      <h2 class="panel-title">LAST 14 DAYS</h2>

      <div class="chart">
        <div class="target-line" :style="{ bottom: targetLineOffset }">
          <span>Target</span>
        </div>

        <div class="chart-grid" aria-hidden="true">
          <span v-for="tick in chartMax + 1" :key="tick" class="chart-row" />
        </div>

        <div class="bars">
          <div v-for="(value, index) in selectedHabit.dailyCompletions" :key="labels[index]" class="bar-group">
            <span class="bar-value">{{ value > 0 ? value : "" }}</span>
            <div
              class="bar"
              :style="{
                height: `${(value / chartMax) * 100}%`,
                backgroundColor: value > 0 ? selectedHabit.color : 'transparent',
              }"
            />
            <span class="bar-label">{{ labels[index] }}</span>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.analytics-view {
  width: 100%;
  max-width: 1120px;
  padding: 28px 22px 36px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
  color: #111111;
}

.analytics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.analytics-title,
.panel-title,
.stat-label,
.panel-metric,
.bar-label,
.bar-value,
.habit-tab {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
}

.analytics-title {
  margin: 0;
  font-size: clamp(2.6rem, 6vw, 4rem);
  line-height: 0.95;
  letter-spacing: 0;
  font-weight: 900;
}

.habit-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.habit-tab {
  min-height: 70px;
  padding: 16px 26px;
  border: 5px solid #111111;
  background: #ffffff;
  box-shadow: 7px 7px 0 #7d7a73;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}

.habit-tab.is-active {
  background: var(--tab-color);
}

.habit-tab:hover {
  transform: translate(2px, 2px);
  box-shadow: 5px 5px 0 #7d7a73;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}

.stat-card,
.panel {
  border: 5px solid #111111;
  box-shadow: 8px 8px 0 #111111;
  background: #ffffff;
}

.stat-card {
  min-height: 220px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
}

.stat-card-accent {
  background: var(--accent-color);
}

.stat-icon {
  font-size: 3rem;
}

.stat-value {
  font-size: clamp(3.2rem, 7vw, 4.6rem);
  line-height: 1;
  font-weight: 900;
}

.stat-label {
  font-size: clamp(1.2rem, 2.2vw, 1.9rem);
  font-weight: 900;
}

.panel {
  padding: 30px 34px 34px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.panel-title {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 900;
}

.panel-metric {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 900;
}

.completion-track {
  height: 24px;
  border: 4px solid #111111;
  background: #efece1;
  overflow: hidden;
}

.completion-fill {
  height: 100%;
  border-right: 4px solid #111111;
}

.chart-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart {
  position: relative;
  padding: 30px 12px 0 56px;
  min-height: 420px;
}

.chart-grid {
  position: absolute;
  inset: 28px 12px 48px 56px;
  display: grid;
  grid-template-rows: repeat(9, 1fr);
  pointer-events: none;
}

.chart-row {
  border-top: 2px dashed #e8decb;
}

.bars {
  position: relative;
  z-index: 1;
  min-height: 390px;
  display: grid;
  grid-template-columns: repeat(14, minmax(36px, 1fr));
  align-items: end;
  gap: 14px;
  border-left: 3px solid #777777;
  border-bottom: 3px solid #777777;
  padding: 0 8px 0 14px;
}

.bar-group {
  height: 390px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: stretch;
  gap: 10px;
}

.bar-value {
  min-height: 20px;
  text-align: center;
  font-size: 0.88rem;
  font-weight: 700;
  color: #555555;
}

.bar {
  width: 100%;
  min-height: 0;
  border: 4px solid #111111;
  border-bottom-width: 0;
  box-sizing: border-box;
}

.bar-label {
  min-height: 40px;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #555555;
}

.target-line {
  position: absolute;
  left: 56px;
  right: 12px;
  border-top: 3px dashed #6f6f6f;
  z-index: 2;
}

.target-line span {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  padding: 0 8px;
  font-size: 0.95rem;
  color: #666666;
}

@media (max-width: 820px) {
  .analytics-view {
    padding: 22px 16px 28px;
    gap: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .panel {
    padding: 22px 18px 24px;
  }

  .chart {
    min-height: 360px;
    padding-left: 22px;
  }

  .chart-grid,
  .target-line {
    left: 22px;
  }

  .bars {
    overflow-x: auto;
    grid-template-columns: repeat(14, minmax(42px, 1fr));
    gap: 10px;
    padding-left: 10px;
  }
}
</style>
