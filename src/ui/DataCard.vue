<script setup lang="ts">
import { ref } from "vue";

const chartData = ref([
  { date: "May 19", value: 0 },
  { date: "May 20", value: 0 },
  { date: "May 21", value: 5 },
  { date: "May 22", value: 8 },
  { date: "May 23", value: 6 },
  { date: "May 24", value: 8 },
  { date: "May 25", value: 5 },
  { date: "May 26", value: 8 },
  { date: "May 27", value: 7 },
  { date: "May 28", value: 7 },
  { date: "May 29", value: 8 },
  { date: "May 30", value: 6 },
  { date: "May 31", value: 0 },
  { date: "Jun 1", value: 0 },
]);

const maxValue = 8;
const yAxisLabels = [8, 6, 4, 2, 0];

const getBarHeight = (value: number) => {
  return `${(value / maxValue) * 100}%`;
};
</script>

<template>
  <div class="widget-wrapper">
    <div class="chart-card">
      <h2 class="chart-title">LAST 14 DAYS</h2>

      <div class="chart-layout">
        <div class="y-axis">
          <div v-for="label in yAxisLabels" :key="label" class="y-label">
            {{ label }}
          </div>
        </div>

        <div class="chart-area">
          <div class="grid-lines">
            <div
              v-for="label in yAxisLabels"
              :key="'grid-' + label"
              class="grid-line"
              :class="{ 'base-line': label === 0 }"
            ></div>
          </div>

          <!-- Línea de Target -->
          <div class="target-line">
            <span class="target-text">Target</span>
          </div>

          <!-- Barras -->
          <div class="bars-container">
            <div
              v-for="(day, index) in chartData"
              :key="index"
              class="bar-column"
            >
              <div class="bar-wrapper">
                <div
                  v-if="day.value > 0"
                  class="bar"
                  :style="{ height: getBarHeight(day.value) }"
                ></div>
              </div>
              <div class="x-label">{{ day.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget-wrapper {
  background-color: #fdf9ee;
  padding: 40px;
  display: flex;
  justify-content: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.chart-card {
  background-color: #fdf9ee;
  border: 5px solid #111;
  box-shadow: 12px 12px 0px #111;
  padding: 30px 40px 40px 20px;
  width: 100%;
  max-width: 1000px;
  box-sizing: border-box;
}

.chart-title {
  margin: 0 0 30px 20px;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #111;
  text-transform: uppercase;
}

.chart-layout {
  display: flex;
  height: 250px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 15px;
  padding-bottom: 24px;
  color: #555;
  font-size: 0.85rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.y-label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 0;
}

.chart-area {
  position: relative;
  flex-grow: 1;
  border-left: 1px solid #777;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.grid-line {
  border-bottom: 1px dashed #e5e5e5;
  width: 100%;
  height: 0;
}

.grid-line.base-line {
  border-bottom: 1px solid #777;
}

.target-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-top: 1px dashed #111;
  z-index: 10;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.target-text {
  position: relative;
  top: -12px;
  background-color: #fdf9ee;
  padding: 0 10px;
  color: #666;
  font-size: 1.1rem;
  font-weight: 600;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.bars-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
}

.bar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-wrapper {
  flex-grow: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 4px;
  box-sizing: border-box;
}

.bar {
  width: 100%;
  max-width: 50px;
  background-color: #2ee2f4;
  border: 3px solid #111;
  border-bottom: none;
  z-index: 5;
  transition: height 0.3s ease;
}

.x-label {
  height: 24px;
  display: flex;
  align-items: flex-end;
  font-size: 0.75rem;
  color: #555;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  margin-top: 8px;
}
</style>
