<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHabitStore } from "@/stores/useHabitStore";
import {
  getDailyCompletionData,
  getHabitStats,
  getHeatmapData,
  getStreak,
  getWeeklyTrendData,
} from "@/utils/habit";
import { resolveHabitColor } from "@/types/habit";

const route = useRoute();
const router = useRouter();
const store = useHabitStore();
store.ensureLoaded();

const habit = computed(() =>
  store.habits.find((entry) => entry.id === String(route.params.id)),
);

const streak = computed(() =>
  habit.value ? getStreak(store.logs, habit.value) : { current: 0, best: 0 },
);
const stats = computed(() =>
  habit.value
    ? getHabitStats(store.logs, habit.value)
    : { average: 0, bestDay: "-", totalLogged: 0, consistency: 0, totalEntries: 0 },
);
const dailyData = computed(() =>
  habit.value ? getDailyCompletionData(store.logs, habit.value, 30) : [],
);
const weeklyData = computed(() =>
  habit.value ? getWeeklyTrendData(store.logs, habit.value, 8) : [],
);
const heatmapData = computed(() =>
  habit.value ? getHeatmapData(store.logs, habit.value, 84) : [],
);
const chartMax = computed(() => {
  if (!habit.value) {
    return 1;
  }
  return Math.max(habit.value.target, ...dailyData.value.map((entry) => entry.value), 1);
});
</script>

<template>
  <section class="detail-view">
    <button class="back-btn" @click="router.back()">BACK</button>

    <div v-if="!habit" class="empty-state">
      <strong>HABIT NOT FOUND</strong>
    </div>

    <template v-else>
      <div
        class="hero-card"
        :style="{ backgroundColor: resolveHabitColor(habit.color) }"
      >
        <h1>{{ habit.name }}</h1>
        <p>{{ habit.target }} {{ habit.unit }} / day</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <strong>{{ streak.current }} days</strong>
          <span>Current Streak</span>
        </div>
        <div class="stat-card">
          <strong>{{ streak.best }} days</strong>
          <span>Best Streak</span>
        </div>
        <div class="stat-card">
          <strong>{{ stats.average }} {{ habit.unit }}</strong>
          <span>Average</span>
        </div>
        <div class="stat-card">
          <strong>{{ stats.consistency }}%</strong>
          <span>Consistency</span>
        </div>
        <div class="stat-card">
          <strong>{{ stats.totalLogged }} {{ habit.unit }}</strong>
          <span>Total Logged</span>
        </div>
        <div class="stat-card">
          <strong>{{ stats.bestDay }}</strong>
          <span>Best Day</span>
        </div>
      </div>

      <section class="panel">
        <h2>LAST 30 DAYS</h2>
        <div class="chart">
          <div class="target-line" :style="{ bottom: `${(habit.target / chartMax) * 100}%` }"></div>
          <div class="bars">
            <div v-for="entry in dailyData" :key="entry.rawDate" class="bar-group">
              <div
                class="bar"
                :style="{
                  height: `${(entry.value / chartMax) * 100}%`,
                  backgroundColor: resolveHabitColor(habit.color),
                }"
              />
              <span>{{ entry.date }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>WEEKLY TREND</h2>
        <div class="trend-list">
          <div v-for="week in weeklyData" :key="week.week" class="trend-row">
            <strong>{{ week.week }}</strong>
            <span>{{ week.average }} avg</span>
            <span>{{ week.completionRate }}%</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>HEATMAP</h2>
        <div class="heatmap-grid">
          <div
            v-for="cell in heatmapData"
            :key="cell.date"
            class="heatmap-cell"
            :title="`${cell.displayDate}: ${cell.value}`"
            :style="{
              backgroundColor: resolveHabitColor(habit.color),
              opacity: Math.max(0.12, cell.intensity),
            }"
          />
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.detail-view {
  width: 100%;
  max-width: 780px;
  padding: 24px 0 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.back-btn,
.stat-card,
.panel,
.hero-card,
.empty-state {
  border: 4px solid #111111;
  box-shadow: 8px 8px 0 #111111;
  background: #ffffff;
  font-family: var(--font-body);
}

.back-btn {
  align-self: flex-start;
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 900;
}

.hero-card {
  padding: 20px 24px;
}

.hero-card h1,
.hero-card p,
.panel h2 {
  margin: 0;
}

.hero-card h1 {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  text-transform: uppercase;
  font-family: var(--font-title);
}

.hero-card p {
  margin-top: 8px;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-card,
.panel,
.empty-state {
  padding: 14px;
}

.stat-card strong,
.stat-card span {
  display: block;
}

.stat-card strong {
  font-size: 1.1rem;
}

.stat-card span {
  margin-top: 6px;
  color: #666666;
  font-size: 0.85rem;
}

.chart {
  position: relative;
  padding-top: 20px;
}

.bars {
  height: 180px;
  display: grid;
  grid-template-columns: repeat(30, minmax(0, 1fr));
  gap: 6px;
  align-items: end;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 8px;
}

.bar {
  width: 100%;
  border: 2px solid #111111;
  border-bottom: none;
  min-height: 2px;
}

.bar-group span {
  font-size: 0.6rem;
}

.target-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 2px dashed #111111;
}

.trend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  border: 3px solid #111111;
  padding: 12px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 6px;
}

.heatmap-cell {
  aspect-ratio: 1;
  border: 2px solid #111111;
}

@media (max-width: 760px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .heatmap-grid {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}
</style>
