<script setup lang="ts">
import HabitsControlCard from "@/components/ui/shared/HabitsControlCard.vue";
import AnalitycsButton from "@/components/ui/shared/AnalitycsButton.vue";
import NeoBrutalismModal from "@/components/ui/NeoBrutalismModal.vue";
import { Icon } from "@iconify/vue";
import { useHabitStore } from "@/stores/useHabitStore";
import { getStreak, getTodayDateKey } from "@/utils/habit";
import type { Habit } from "@/types/habit";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const store = useHabitStore();
store.ensureLoaded();

const router = useRouter();
const today = getTodayDateKey();
const filterCategory = ref<string | null>(null);
const isModalOpen = ref(false);
const canRequestNotifications =
  typeof Notification !== "undefined" && Notification.permission !== "granted";

const activeHabits = computed(() => store.activeHabits);
const habits = computed(() => store.habits);
const logs = computed(() => store.logs);

const hasAnyReminders = computed(() =>
  habits.value.some((habit) => Boolean(habit.reminderTime)),
);

const categories = computed(() => {
  const categorySet = new Set(
    activeHabits.value.map((habit) => habit.category ?? "Other"),
  );
  return Array.from(categorySet).sort();
});

const groupedHabits = computed(() => {
  const filtered = filterCategory.value
    ? activeHabits.value.filter(
        (habit) => (habit.category ?? "Other") === filterCategory.value,
      )
    : activeHabits.value;

  return filtered.reduce<Record<string, Habit[]>>((groups, habit) => {
    const category = habit.category ?? "Other";
    groups[category] ??= [];
    groups[category].push(habit);
    return groups;
  }, {});
});

const filteredHabits = computed(() =>
  filterCategory.value
    ? activeHabits.value.filter(
        (habit) => (habit.category ?? "Other") === filterCategory.value,
      )
    : activeHabits.value,
);

const completedCount = computed(
  () =>
    filteredHabits.value.filter(
      (habit) => store.getLog(habit.id, today) >= habit.target,
    ).length,
);

const totalCount = computed(() => filteredHabits.value.length);
const completionRate = computed(() => {
  if (totalCount.value === 0) {
    return 0;
  }
  return Math.round((completedCount.value / totalCount.value) * 100);
});

const requestPermission = async () => {
  if (typeof Notification === "undefined") {
    return;
  }
  try {
    await Notification.requestPermission();
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="view-wrapper">
    <header class="header-section">
      <div class="title-area">
        <h1 class="main-title">TODAY</h1>
        <p v-if="totalCount > 0" class="subtitle">
          {{ completedCount }}/{{ totalCount }} completed
        </p>
      </div>

      <div class="header-actions">
        <button
          v-if="hasAnyReminders && canRequestNotifications"
          class="neo-button accent-button"
          @click="requestPermission"
        >
          ENABLE
        </button>

        <button class="neo-button new-habit-button" @click="isModalOpen = true">
          <Icon icon="lucide:plus" class="button-icon" />
          NEW HABIT
        </button>
      </div>
    </header>

    <NeoBrutalismModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @create="store.addHabit($event)"
    />

    <div v-if="categories.length > 1" class="filters-row">
      <button
        class="filter-tag"
        :class="{ active: !filterCategory }"
        @click="filterCategory = null"
      >
        ALL
      </button>

      <button
        v-for="category in categories"
        :key="category"
        class="filter-tag"
        :class="{ active: filterCategory === category }"
        @click="filterCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div v-if="totalCount > 0" class="progress-card">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${completionRate}%` }"></div>
      </div>
      <span class="progress-text">
        {{ completedCount === totalCount && totalCount > 0 ? "ALL DONE!" : `${completionRate}% COMPLETE` }}
      </span>
    </div>

    <div v-if="activeHabits.length === 0" class="empty-state">
      <strong>NO HABITS YET</strong>
      <p>Create your first habit to get started.</p>
    </div>

    <div v-else class="habits-list">
      <section v-for="(categoryHabits, category) in groupedHabits" :key="category">
        <h3 class="group-title">{{ category }}</h3>
        <div class="group-list">
          <RouterLink
            v-for="habit in categoryHabits"
            :key="habit.id"
            :to="`/analytics?habit=${habit.id}`"
            class="habit-link"
          >
            <HabitsControlCard
              :habit="habit"
              :current-value="store.getLog(habit.id, today)"
              :streak="getStreak(logs, habit).current"
              @log="store.logHabit(habit.id, today, $event)"
            />
          </RouterLink>
        </div>
      </section>
    </div>

    <AnalitycsButton
      v-if="activeHabits.length > 0"
      label="VIEW ANALYTICS"
      @click="router.push('/analytics')"
    />
  </div>
</template>

<style scoped>
.view-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 760px;
  gap: 22px;
  padding: 24px 0 0;
  box-sizing: border-box;
}

.header-section,
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.title-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.main-title {
  font-size: clamp(2.4rem, 6vw, 3.2rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.03em;
  font-family: var(--font-title);
}

.subtitle,
.group-title,
.progress-text {
  font-family: var(--font-body);
}

.subtitle {
  margin: 0;
  color: #555;
  font-weight: 700;
}

.neo-button,
.filter-tag {
  border: 4px solid #000000;
  background: #ffffff;
  box-shadow: 6px 6px 0 #000000;
  padding: 10px 16px;
  font-family: var(--font-body);
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.neo-button:hover,
.filter-tag:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 #000000;
}

.neo-button:active,
.filter-tag:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #000000;
}

.accent-button,
.filter-tag.active {
  background: #5d1df1;
  color: #ffffff;
}

.new-habit-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #5d1df1;
  color: #ffffff;
}

.button-icon {
  width: 18px;
  height: 18px;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  padding: 6px 10px;
  font-size: 0.75rem;
}

.progress-card {
  border: 4px solid #000000;
  padding: 14px;
  background: #ffffff;
  box-shadow: 8px 8px 0 #000000;
}

.progress-track {
  height: 22px;
  border: 3px solid #000000;
  background: #ece7d8;
}

.progress-fill {
  height: 100%;
  background: #ec4899;
}

.progress-text {
  display: block;
  margin-top: 10px;
  text-align: center;
  font-weight: 900;
}

.empty-state {
  border: 4px solid #000000;
  background: #ffffff;
  box-shadow: 8px 8px 0 #000000;
  padding: 32px;
  text-align: center;
}

.empty-state p {
  margin-bottom: 0;
}

.habits-list,
.group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-title {
  margin: 0 0 10px;
  font-size: 0.95rem;
  color: #666;
  text-transform: uppercase;
}

.habit-link {
  text-decoration: none;
  color: inherit;
}

@media (max-width: 760px) {
  .header-section {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
