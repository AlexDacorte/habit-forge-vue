<template>
  
  <div class="tracker-card">
    
    <div class="color-band"></div>

    <div class="card-content">
      <div class="header">
        <h2 class="title">{{ props.habit.name }}</h2>
        <p class="target-label">Target: {{ props.habit.description }} glasses</p>
      </div>

      <div class="progress-container">
        <div
          class="progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>

      <div class="controls-row">
        <div class="counter">
          <button
            class="btn"
            @click="decrement"
            :disabled="count <= 0"
            aria-label="Decrease count"
          >
            -
          </button>

          <span class="count-display">{{ count }}</span>

          <button
            class="btn"
            @click="increment"
            :disabled="count >= target"
            aria-label="Increase count"
          >
            +
          </button>
        </div>

        <div class="total-label">/ {{ target }} glasses</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  habit: {
    type: Object,
    required: true
  }
});

const count = ref(0);

const progressPercentage = computed(() => {
  if (props.habit.progress <= 0) return 0;
  return Math.min((count.value / props.habit.progress) * 100, 100);
});

const currentColor = computed(() => {
  return props.habit.color || "#5ce1e6";
});


const increment = () => {
  if (count.value < props.habit.progress) {
    count.value++;
  }
};

const decrement = () => {
  if (count.value > 0) {
    count.value--;
  }
};
</script>

<style scoped>
.tracker-card {
  position: relative;
  font-family: "Courier New", Courier, monospace;
  background-color: #fdfdf2;
  border: 4px solid #000;
  box-shadow: 8px 8px 0px #000;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.1s ease-in-out;
}

.tracker-card:hover {
  transform: translate(-2px, 1px);
  box-shadow: 6px 6px 0px #000000;
  transition: all 0.1s ease-in-out;
}

.color-band {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  background-color: v-bind(currentColor);
}

.card-content {
  padding: 20px 20px 20px 32px;
}

.header {
  margin-bottom: 20px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  text-transform: uppercase;
  font-weight: 900;
  color: #000;
  letter-spacing: 1px;
}

.target-label {
  margin: 0;
  color: #555;
  font-size: 1.1rem;
  font-weight: bold;
}

.progress-container {
  width: 100%;
  height: 24px;
  background-color: #eae6db;
  border: 3px solid #000;
  margin-bottom: 24px;
  box-sizing: border-box;
}

.progress-fill {
  height: 100%;
  background-color: v-bind(currentColor)  ;
  transition: width 0.3s ease-in-out;
  border-right: 2px solid #000;
}
.progress-fill[style*="width: 0%"] {
  border-right: none;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.counter {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn {
  width: 44px;
  height: 44px;
  background-color: #fff;
  border: 4px solid #000;
  box-shadow: 4px 4px 0 #000;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}

.btn:active:not(:disabled) {
  box-shadow: 0 0 0 #000;
  transform: translate(4px, 4px);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.count-display {
  font-size: 1.8rem;
  font-weight: 900;
  min-width: 30px;
  text-align: center;
  color: #000;
}

.total-label {
  font-size: 1.1rem;
  color: #555;
  font-weight: bold;
}
</style>
