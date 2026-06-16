<template>
  <div class="tracker-card">
    <div class="color-band"></div>

    <div class="card-content">
      <div class="header">
        <h2 class="title">{{ habit.title }}</h2>
        <p class="description">{{ habit.description }}</p>
        <p class="target-label">
          Target: {{ formatValue(habit.target) }} {{ habit.unit }}
        </p>
      </div>

      <div class="progress-container">
        <div
          class="progress-fill"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

      <div v-if="unitConfig.mode === 'count'" class="controls-row">
        <div class="counter">
          <button
            class="btn"
            :disabled="habit.progress <= 0"
            aria-label="Decrease progress"
            @click="applyDelta(-unitConfig.step)"
          >
            -
          </button>

          <span class="count-display">{{ formatValue(habit.progress) }}</span>

          <button
            class="btn"
            :disabled="habit.progress >= habit.target"
            :aria-label="unitConfig.actionLabel"
            @click="applyDelta(unitConfig.step)"
          >
            +
          </button>
        </div>

        <div class="total-label">
          / {{ formatValue(habit.target) }} {{ habit.unit }}
        </div>
      </div>

      <div v-else class="measure-controls">
        <label class="entry-field">
          <span class="entry-label">Log {{ habit.unit }}</span>
          <input
            v-model.number="entryAmount"
            type="number"
            class="entry-input"
            :min="unitConfig.min"
            :step="unitConfig.step"
          />
        </label>

        <div class="measure-actions">
          <button
            class="btn wide-btn"
            :disabled="habit.progress >= habit.target"
            @click="applyEntry"
          >
            +{{ formatValue(entryAmount) }} {{ habit.unit }}
          </button>

          <button
            class="btn subtle-btn"
            :disabled="habit.progress <= 0"
            @click="applyDelta(-unitConfig.step)"
          >
            -{{ formatValue(unitConfig.step) }}
          </button>
        </div>

        <div class="total-label">
          {{ formatValue(habit.progress) }} / {{ formatValue(habit.target) }}
          {{ habit.unit }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useHabitStore } from "@/stores/useHabitStore";
import type { Habit } from "@/types/habit";
import {
  formatUnitValue,
  getUnitConfig,
  sanitizeProgressValue,
} from "@/utils/habit";

const props = defineProps<{
  habit: Habit;
}>();

const useStore = useHabitStore();

const unitConfig = computed(() => getUnitConfig(props.habit.unit));
const currentColor = computed(() => props.habit.color || "#5ce1e6");
const progressPercentage = computed(() => {
  if (props.habit.target <= 0) {
    return 0;
  }

  return Math.min((props.habit.progress / props.habit.target) * 100, 100);
});

const entryAmount = ref(unitConfig.value.step);

watch(
  () => props.habit.unit,
  () => {
    entryAmount.value = getUnitConfig(props.habit.unit).step;
  },
  { immediate: true },
);

const formatValue = (value: number) => {
  return formatUnitValue(value, unitConfig.value.decimals);
};

const persistProgress = (nextValue: number) => {
  const normalized = sanitizeProgressValue(
    nextValue,
    unitConfig.value.decimals,
  );
  const clamped = Math.min(normalized, props.habit.target);
  useStore.updateHabitProgress(props.habit.id, clamped);
};

const applyDelta = (delta: number) => {
  persistProgress(props.habit.progress + delta);
};

const applyEntry = () => {
  const normalizedEntry = sanitizeProgressValue(
    entryAmount.value || unitConfig.value.min,
    unitConfig.value.decimals,
  );

  if (normalizedEntry <= 0) {
    entryAmount.value = unitConfig.value.min;
    return;
  }

  persistProgress(props.habit.progress + normalizedEntry);
  entryAmount.value = unitConfig.value.step;
};
</script>

<style scoped>
.tracker-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 220px;
  border: 4px solid #000000;
  background-color: #fdfdf2;
  box-shadow: 8px 8px 0 #000000;
  font-family: "Courier New", Courier, monospace;
  transition: all 0.1s ease-in-out;
}

.tracker-card:hover {
  transform: translate(-2px, 1px);
  box-shadow: 6px 6px 0 #000000;
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
  gap: 1.1rem;
  padding: 20px 20px 20px 28px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  margin: 0;
  font-size: 1.65rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #000000;
}

.description,
.target-label,
.total-label,
.entry-label {
  margin: 0;
  color: #555555;
  font-size: 0.98rem;
  font-weight: 700;
}

.progress-container {
  width: 100%;
  height: 24px;
  border: 3px solid #000000;
  background-color: #eae6db;
  box-sizing: border-box;
}

.progress-fill {
  height: 100%;
  background-color: v-bind(currentColor);
  border-right: 2px solid #000000;
  transition: width 0.25s ease-in-out;
}

.progress-fill[style*="0%"] {
  border-right: none;
}

.controls-row,
.measure-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.counter,
.measure-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn {
  min-height: 48px;
  padding: 0 18px;
  border: 4px solid #000000;
  background-color: #ffffff;
  box-shadow: 4px 4px 0 #000000;
  font-size: 1.05rem;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.btn:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #000000;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.wide-btn {
  min-width: 160px;
}

.subtle-btn {
  background: #fff7e8;
}

.count-display {
  min-width: 46px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 900;
  color: #000000;
}

.entry-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.entry-input {
  width: 120px;
  padding: 10px 12px;
  border: 3px solid #000000;
  font-size: 1rem;
  font-weight: 800;
  font-family: inherit;
}

@media (max-width: 720px) {
  .card-content {
    padding-right: 16px;
  }

  .measure-actions {
    width: 100%;
    justify-content: stretch;
  }

  .wide-btn {
    flex: 1;
  }
}
</style>
