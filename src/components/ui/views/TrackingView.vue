<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHabitStore } from "@/stores/useHabitStore";
import {
  getCompletionDates,
  getCompletionRate,
  getDailyCompletionData,
  getHabitAgeInDays,
  getStreak,
  getWeeklyTrendData,
  formatCompactDate,
} from "@/utils/habit";
import { resolveHabitColor } from "@/types/habit";

const store = useHabitStore();
store.ensureLoaded();

const route = useRoute();
const router = useRouter();
const selectedHabitId = ref<string | null>(null);
const selectedRange = ref<7 | 30 | 365>(7);

const activeHabits = computed(() => store.activeHabits);

watch(
  [() => route.query.habit, activeHabits],
  ([habitId, habits]) => {
    const fromQuery = typeof habitId === "string" ? habitId : null;
    const validQueryHabit = fromQuery
      ? (habits.find((habit) => habit.id === fromQuery)?.id ?? null)
      : null;

    selectedHabitId.value = validQueryHabit ?? habits[0]?.id ?? null;
  },
  { immediate: true },
);

const selectedHabit = computed(() => {
  if (selectedHabitId.value) {
    return activeHabits.value.find(
      (habit) => habit.id === selectedHabitId.value,
    );
  }
  return activeHabits.value[0];
});

const selectHabit = (habitId: string) => {
  selectedHabitId.value = habitId;
  router.replace({
    path: "/analytics",
    query: { habit: habitId },
  });
};

const streak = computed(() =>
  selectedHabit.value
    ? getStreak(store.logs, selectedHabit.value)
    : { current: 0, best: 0 },
);

const completionRate = computed(() =>
  selectedHabit.value
    ? getCompletionRate(store.logs, selectedHabit.value, 7)
    : 0,
);

const completionDates = computed(() =>
  selectedHabit.value
    ? getCompletionDates(store.logs, selectedHabit.value)
        .slice(0, 8)
        .map((date) => ({
          raw: date,
          label: formatCompactDate(date),
        }))
    : [],
);

const dailyData = computed(() =>
  selectedHabit.value
    ? getDailyCompletionData(
        store.logs,
        selectedHabit.value,
        visibleRangeDays.value,
      )
    : [],
);

const weeklyData = computed(() =>
  selectedHabit.value
    ? getWeeklyTrendData(store.logs, selectedHabit.value)
    : [],
);

const habitAgeDays = computed(() =>
  selectedHabit.value ? getHabitAgeInDays(selectedHabit.value) : 0,
);

const visibleRangeDays = computed(() =>
  Math.max(
    1,
    Math.min(selectedRange.value, habitAgeDays.value || selectedRange.value),
  ),
);

const dailyChartTitle = computed(() => {
  const days = visibleRangeDays.value;
  return `LAST ${days} DAY${days === 1 ? "" : "S"}`;
});

const targetLineBottom = computed(() => {
  if (!selectedHabit.value) {
    return "0%";
  }

  const ratio = (selectedHabit.value.target / chartMax.value) * 100;
  return `${Math.min(88, Math.max(0, ratio))}%`;
});

const chartMax = computed(() => {
  if (!selectedHabit.value) {
    return 1;
  }
  const values = dailyData.value.map((entry) => entry.value);
  return Math.max(selectedHabit.value.target, ...values, 1);
});
</script>

<template>
  <section class="tracking-view">
    <header class="tracking-header">
      <h1 class="tracking-title">ANALYTICS</h1>
    </header>

    <div v-if="activeHabits.length === 0" class="empty-state">
      <strong>NO DATA YET</strong>
      <p>Create habits and log data to see analytics.</p>
    </div>

    <template v-else-if="selectedHabit">
      <div class="habit-tabs">
        <button
          v-for="habit in activeHabits"
          :key="habit.id"
          class="habit-tab"
          :class="{ 'is-active': habit.id === selectedHabit.id }"
          :style="{ '--tab-color': resolveHabitColor(habit.color) }"
          @click="selectHabit(habit.id)"
        >
          {{ habit.name.toUpperCase() }}
        </button>
      </div>

      <div class="stats-grid">
        <article
          class="stat-card stat-card-accent"
          :style="{ '--accent-color': resolveHabitColor(selectedHabit.color) }"
        >
          <Icon icon="lucide:flame" class="stat-icon" />
          <strong class="stat-value">{{ streak.current }}</strong>
          <span class="stat-label">CURRENT STREAK</span>
        </article>

        <article class="stat-card">
          <Icon icon="lucide:trophy" class="stat-icon" />
          <strong class="stat-value">{{ streak.best }}</strong>
          <span class="stat-label">BEST STREAK</span>
        </article>
      </div>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">7-DAY COMPLETION</h2>
          <span class="panel-metric">{{ completionRate }}%</span>
        </div>
        <div class="completion-track">
          <div
            class="completion-fill"
            :style="{
              width: `${completionRate}%`,
              backgroundColor: resolveHabitColor(selectedHabit.color),
            }"
          />
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">RECENT COMPLETIONS</h2>
        <div v-if="completionDates.length > 0" class="completion-dates">
          <article
            v-for="date in completionDates"
            :key="date.raw"
            class="completion-card"
          >
            <span class="completion-pill">{{ date.label }}</span>
          </article>
        </div>
        <p v-else class="empty-copy">No completed dates yet for this habit.</p>
      </section>

      <section class="panel chart-panel">
        <div class="panel-header range-header">
          <h2 class="panel-title">{{ dailyChartTitle }}</h2>
          <div class="range-selector">
            <button
              v-for="option in [
                { label: '1W', value: 7 },
                { label: '1M', value: 30 },
                { label: '1Y', value: 365 },
              ]"
              :key="option.label"
              class="range-button"
              :class="{ active: selectedRange === option.value }"
              @click="selectedRange = option.value as 7 | 30 | 365"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <div class="chart">
          <div
            class="target-line"
            :style="{ bottom: targetLineBottom }"
          >
            <span>Target</span>
          </div>

          <div class="bars">
            <div
              v-for="entry in dailyData"
              :key="entry.rawDate"
              class="bar-group"
            >
              <span class="bar-value">{{
                entry.value > 0 ? entry.value : ""
              }}</span>
              <div
                class="bar"
                :style="{
                  height: `${(entry.value / chartMax) * 100}%`,
                  backgroundColor:
                    entry.value > 0
                      ? resolveHabitColor(selectedHabit.color)
                      : 'transparent',
                }"
              />
              <span class="bar-label">{{ entry.date }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-heading">
          <Icon icon="lucide:trending-up" class="panel-heading-icon" />
          <h2 class="panel-title">WEEKLY TRENDS</h2>
        </div>
        <div class="trend-list">
          <div v-for="week in weeklyData" :key="week.week" class="trend-row">
            <div>
              <strong>{{ week.week }}</strong>
              <span>{{ week.weekLabel }}</span>
            </div>
            <div class="trend-metrics">
              <span>{{ week.average }} avg</span>
              <span>{{ week.completionRate }}%</span>
            </div>
          </div>
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.tracking-view {
  width: 100%;
  max-width: 780px;
  padding: 24px 0 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.tracking-title,
.panel-title,
.stat-label,
.panel-metric,
.bar-label,
.bar-value,
.habit-tab,
.completion-pill,
.empty-copy {
  font-family: var(--font-body);
}

.tracking-title {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 3.3rem);
  font-weight: 900;
  font-family: var(--font-title);
}

.empty-state,
.stat-card,
.panel {
  border: 5px solid #111111;
  box-shadow: 8px 8px 0 #111111;
  background: #ffffff;
}

.empty-state {
  padding: 32px;
  text-align: center;
}

.habit-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.habit-tab {
  padding: 12px 18px;
  border: 5px solid #111111;
  background: var(--tab-color);
  box-shadow: 7px 7px 0 #7d7a73;
  font-size: 0.85rem;
  font-weight: 900;
  cursor: pointer;
  opacity: 0.55;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease,
    box-shadow 0.15s ease;
}

.habit-tab.is-active {
  opacity: 1;
}

.habit-tab:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 #7d7a73;
  opacity: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  min-height: 180px;
  padding: 24px;
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

.stat-icon,
.panel-heading-icon {
  width: 26px;
  height: 26px;
}

.stat-value {
  font-size: clamp(2.4rem, 6vw, 3.5rem);
  font-weight: 900;
  font-family: var(--font-title);
}

.stat-label {
  font-size: 0.95rem;
  font-weight: 900;
}

.panel {
  padding: 18px 20px 20px;
}

.panel-header,
.trend-row,
.trend-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.range-header {
  align-items: flex-start;
  position: relative;
  z-index: 2;
  background: #ffffff;
  padding-bottom: 14px;
}

.range-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.range-button {
  border: 3px solid #111111;
  background: #ffffff;
  box-shadow: 4px 4px 0 #111111;
  padding: 6px 10px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.range-button.active {
  background: #111111;
  color: #ffffff;
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.panel-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 900;
  font-family: var(--font-title);
}

.panel-metric {
  font-size: 2rem;
  font-weight: 900;
  font-family: var(--font-title);
}

.completion-track {
  height: 24px;
  border: 4px solid #111111;
  background: #efece1;
}

.completion-fill {
  height: 100%;
  border-right: 4px solid #111111;
}

.completion-dates {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  gap: 12px;
  align-items: stretch;
}

.completion-card {
  border: 3px solid #111111;
  box-shadow: 4px 4px 0 #111111;
  background: #ffffff;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.completion-pill {
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
}

.empty-copy {
  margin: 0;
  color: #666666;
}

.chart {
  position: relative;
  min-height: 236px;
  padding-top: 14px;
}

.bars {
  height: 180px;
  display: grid;
  grid-template-columns: repeat(14, minmax(0, 1fr));
  gap: 10px;
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
  border: 3px solid #111111;
  border-bottom: none;
  min-height: 2px;
}

.bar-label,
.bar-value {
  font-size: 0.7rem;
  text-align: center;
}

.target-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 2px dashed #111111;
}

.target-line span {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  padding: 0 8px;
}

.trend-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trend-row {
  border: 3px solid #111111;
  padding: 10px 12px;
}

.trend-row span {
  display: block;
  color: #666666;
}

@media (max-width: 760px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .bars {
    gap: 6px;
  }

  .bar-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
}
</style>
