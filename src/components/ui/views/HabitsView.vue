<script setup lang="ts">
import HabitsControlCard from "@/components/ui/shared/HabitsControlCard.vue";
import { ref } from "vue";

const categories = ["FITNESS", "HEALTH", "LEARNING", "MINDFULNESS"];
const activeCategory = ref("ALL");

const handleClick = (event: MouseEvent) => {
  console.log("New habit clicked");
};

const setActiveCategory = (category: string) => {
  activeCategory.value = category;
};
</script>

<template>
  <div class="view-wrapper">
    <header class="header-section">
      <div class="title-area">
        <h1 class="main-title">TODAY</h1>
        <p class="subtitle">0/4 completed</p>
      </div>

      <button
        class="neo-button"
        @click="handleClick"
        aria-label="Create new habit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>NEW HABIT</span>
      </button>
    </header>

    <div class="filters-row">
      <button
        class="filter-tag"
        :class="{ active: activeCategory === 'ALL' }"
        @click="setActiveCategory('ALL')"
      >
        ALL
      </button>

      <button
        v-for="cat in categories"
        :key="cat"
        class="filter-tag"
        :class="{ active: activeCategory === cat }"
        @click="setActiveCategory(cat)"
      >
        <svg
          v-if="activeCategory !== cat"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="tag-icon"
        >
          <path
            d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
          ></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
        {{ cat }}
      </button>
    </div>

    <div class="progress-card">
      <div class="progress-track">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
      <span class="progress-text">0% COMPLETE</span>
    </div>
    <div>
      <HabitsControlCard></HabitsControlCard>
    </div>
  </div>
</template>

<style scoped>
.view-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  gap: 32px;
  padding: 40px;
  background-color: #fdf9ee;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  box-sizing: border-box;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-area {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0;
  color: #000;
  line-height: 1;
  letter-spacing: 0.05em;
}

.subtitle {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.1rem;
  color: #555;
  margin: 0;
  font-weight: 600;
}

.neo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: #6d28d9;
  color: #ffffff;
  padding: 12px 24px;
  border: 4px solid #000000;
  box-shadow: 6px 6px 0px #000000;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.neo-button:active {
  transform: translate(4px, 4px);
  box-shadow: 2px 2px 0px #000000;
}

.icon {
  margin-top: 2px;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #ffffff;
  color: #000000;
  border: 3px solid #000000;
  box-shadow: 4px 4px 0px #000000;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.filter-tag:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000000;
}

.filter-tag.active {
  background-color: #6d28d9;
  color: #ffffff;
  padding: 8px 20px;
}

.tag-icon {
  margin-top: -1px;
}

.progress-card {
  background-color: #ffffff;
  border: 4px solid #000000;
  box-shadow: 8px 8px 0px #000000;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.progress-track {
  width: 100%;
  height: 24px;
  background-color: #e5e5e5;
  border: 2px solid #000000;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: #6d28d9;
  border-right: 2px solid #000000;
  transition: width 0.3s ease;
}

.progress-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 800;
  font-size: 1rem;
  color: #000000;
  letter-spacing: 0.05em;
}
</style>
