<template>
  <section class="habits-view">
    <header class="habits-header">
      <h1 class="page-title">HABITS</h1>

      <div class="toolbar">
        <button class="toolbar-btn" @click="handleExport">
          <Icon icon="lucide:download" class="toolbar-icon" />
          EXPORT
        </button>
        <label class="toolbar-btn">
          <Icon icon="lucide:upload" class="toolbar-icon" />
          IMPORT
          <input
            type="file"
            accept=".csv"
            class="hidden-input"
            @change="handleImport"
          />
        </label>
        <button
          class="toolbar-btn toolbar-btn-primary"
          @click="openCreateModal"
        >
          <Icon icon="lucide:plus" class="toolbar-icon" />
          NEW HABIT
        </button>
      </div>
    </header>

    <p v-if="transferMessage" class="transfer-message">{{ transferMessage }}</p>

    <div
      v-if="activeHabits.length === 0 && archivedHabits.length === 0"
      class="empty-state"
    >
      <strong>NO HABITS YET</strong>
      <p>Create your first habit above.</p>
    </div>

    <div v-else class="habit-groups">
      <section
        v-for="(categoryHabits, category) in groupedActive"
        :key="category"
        class="habit-group"
      >
        <div class="group-label">{{ category }}</div>

        <HabitsCardMinimal
          v-for="habit in categoryHabits"
          :key="habit.id"
          :title="habit.name"
          :subtitle="formatHabitSubtitle(habit)"
          :accent-color="resolveHabitColor(habit.color)"
          archive-label="Archive"
          @edit="openEditModal(habit)"
          @archive="toggleArchive(habit.id, true)"
          @delete="deleteHabit(habit.id)"
        />
      </section>

      <section v-if="archivedHabits.length > 0" class="habit-group">
        <div class="group-label">ARCHIVED</div>

        <HabitsCardMinimal
          v-for="habit in archivedHabits"
          :key="habit.id"
          :title="habit.name"
          :subtitle="formatHabitSubtitle(habit)"
          :accent-color="resolveHabitColor(habit.color)"
          archived
          archive-label="Restore"
          @edit="openEditModal(habit)"
          @archive="toggleArchive(habit.id, false)"
          @delete="deleteHabit(habit.id)"
        />
      </section>
    </div>

    <NeoBrutalismModal
      :is-open="isModalOpen"
      :mode="modalMode"
      :initial-habit="selectedHabit"
      @close="closeModal"
      @create="handleCreate"
      @update="handleUpdate"
    />
  </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import HabitsCardMinimal from "@/components/ui/shared/HabitsCardMinimal.vue";
import NeoBrutalismModal from "@/components/ui/NeoBrutalismModal.vue";
import { useHabitStore } from "@/stores/useHabitStore";
import { resolveHabitColor, type Habit } from "@/types/habit";
import {
  downloadCsv,
  exportHabitsCsv,
  importHabitsCsv,
} from "@/utils/habitTransfer";

const store = useHabitStore();
store.ensureLoaded();

const isModalOpen = ref(false);
const modalMode = ref<"create" | "edit">("create");
const selectedHabit = ref<Habit | null>(null);
const transferMessage = ref("");

const activeHabits = computed(() =>
  store.habits.filter((habit) => !habit.archived),
);
const archivedHabits = computed(() =>
  store.habits.filter((habit) => habit.archived),
);

const groupedActive = computed(() =>
  activeHabits.value.reduce<Record<string, Habit[]>>((groups, habit) => {
    const category = habit.category ?? "Other";
    groups[category] ??= [];
    groups[category].push(habit);
    return groups;
  }, {}),
);

const formatHabitSubtitle = (habit: Habit) => {
  return `${habit.target} ${habit.unit} / day${
    habit.reminderTime ? ` • ${habit.reminderTime}` : ""
  }`;
};

const openCreateModal = () => {
  modalMode.value = "create";
  selectedHabit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (habit: Habit) => {
  modalMode.value = "edit";
  selectedHabit.value = { ...habit };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedHabit.value = null;
};

const handleCreate = (habit: Omit<Habit, "id" | "createdAt" | "archived">) => {
  store.addHabit(habit);
  transferMessage.value = "Habit created.";
  closeModal();
};

const handleUpdate = (payload: {
  id: string;
  updates: Partial<Omit<Habit, "id" | "createdAt" | "archived">>;
}) => {
  store.updateHabit(payload.id, payload.updates);
  transferMessage.value = "Habit updated.";
  closeModal();
};

const toggleArchive = (habitId: string, archived: boolean) => {
  store.updateHabit(habitId, { archived });
  transferMessage.value = archived ? "Habit archived." : "Habit restored.";
};

const deleteHabit = (habitId: string) => {
  if (!window.confirm("Delete this habit?")) {
    return;
  }
  store.deleteHabit(habitId);
  transferMessage.value = "Habit deleted.";
};

const handleExport = () => {
  const csv = exportHabitsCsv(store.habits, store.logs);
  downloadCsv(
    csv,
    `habits-backup-${new Date().toISOString().slice(0, 10)}.csv`,
  );
  transferMessage.value = "Data exported successfully.";
};

const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];

  if (!file) {
    return;
  }

  try {
    const content = await file.text();
    const { habits, logs } = importHabitsCsv(content);
    if (habits.length === 0) {
      transferMessage.value = "No habits found in CSV.";
    } else {
      store.importData(habits, logs);
      transferMessage.value = `Imported ${habits.length} habits and ${logs.length} logs.`;
    }
  } catch (error) {
    console.error(error);
    transferMessage.value = "Failed to parse CSV file.";
  } finally {
    if (input) {
      input.value = "";
    }
  }
};
</script>

<style scoped>
.habits-view {
  width: 100%;
  max-width: 780px;
  padding: 24px 0 24px;
  box-sizing: border-box;
}

.habits-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-title,
.group-label,
.toolbar-btn,
.transfer-message {
  font-family: var(--font-body);
}

.page-title {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 3.3rem);
  line-height: 0.95;
  font-weight: 900;
  font-family: var(--font-title);
}

.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-btn {
  border: 4px solid #111111;
  box-shadow: 6px 6px 0 #111111;
  padding: 12px 16px;
  background: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.toolbar-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 #111111;
}

.toolbar-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #111111;
}

.toolbar-btn-primary {
  background: #5d1df1;
  color: #ffffff;
}

.hidden-input {
  display: none;
}

.toolbar-icon {
  width: 18px;
  height: 18px;
}

.transfer-message {
  margin: 0 0 20px;
  font-weight: 700;
}

.habit-groups {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.habit-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.group-label {
  font-size: 0.9rem;
  font-weight: 900;
  color: #666666;
}

.empty-state {
  border: 4px solid #111111;
  box-shadow: 8px 8px 0 #111111;
  padding: 32px;
  background: #ffffff;
  text-align: center;
}

@media (max-width: 860px) {
  .habits-header {
    flex-direction: column;
  }
}
</style>
