<script setup lang="ts">
import { ref } from "vue";

const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script>

<template>
  <header class="header-container">
    <div class="logo-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        />
      </svg>
      <span class="logo-text">HABITS</span>
    </div>

    <button @click="toggleTheme" class="theme-btn" aria-label="Toggle theme">
      <svg
        v-if="!isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    </button>
  </header>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: #6200ea;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom: 3px solid black;
  padding: 0 16px;
  box-sizing: border-box;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.logo-text {
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: white;
  border: 3px solid black;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s ease-in-out;
}

.theme-btn:hover {
  background-color: #f3f4f6;
}

.theme-btn:active {
  transform: translateY(1px);
}
</style>
