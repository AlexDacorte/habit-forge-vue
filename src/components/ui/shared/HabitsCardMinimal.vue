<template>
  <div class="habit-card">
    <div class="accent-bar" :style="{ backgroundColor: accentColor }"></div>

    <div class="habit-content">
      <h3 class="habit-title">{{ title }}</h3>
      <p class="habit-subtitle">{{ frequency }}</p>
    </div>

    <div class="habit-actions">
      <button class="action-btn btn-white" @click="$emit('edit')" aria-label="Edit habit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
        </svg>
      </button>

      <button class="action-btn btn-white" @click="$emit('archive')" aria-label="Archive habit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"></path>
          <path d="M10 12h4"></path>
          <path d="M3 6h18"></path>
        </svg>
      </button>

      <button class="action-btn btn-red" @click="$emit('delete')" aria-label="Delete habit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'DRINK WATER'
  },
  frequency: {
    type: String,
    default: '8 glasses / day'
  },
  accentColor: {
    type: String,
    default: '#00e5ff'
  }
});

defineEmits(['edit', 'archive', 'delete']);
</script>

<style scoped>
.habit-card {
  display: flex;
  align-items: center;
  position: relative;
  background-color: #ffffff;
  border: 4px solid #000000;
  box-shadow: 5px 5px 0px 0px #000000;
  padding: 14px 20px 14px 28px;
  font-family: 'Arial Black', -apple-system, BlinkMacSystemFont, sans-serif;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  overflow: hidden;
}

.habit-card:hover {
  transform: translate(3px, 3px);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 8px 8px 0px 0px #000000;
}

.habit-card:active {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0px 0px #000000;
}

.accent-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  border-right: 4px solid #000000;
}

.habit-content {
  flex-grow: 1;
}

.habit-title {
  margin: 0 0 4px 0;
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #000000;
}

.habit-subtitle {
  margin: 0;
  font-size: 1rem;
  color: #555555;
  font-weight: 500;
}

.habit-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 3px solid #000000;
  box-shadow: 3px 3px 0px 0px #000000;
  cursor: pointer;
  padding: 0;
  transition: transform 0.05s ease, box-shadow 0.05s ease;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.btn-white {
  background-color: #ffffff;
  color: #000000;
}

.btn-red {
  background-color: #ff2a3a;
  color: #ffffff;
}

.action-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px 0px #000000;
}
</style>