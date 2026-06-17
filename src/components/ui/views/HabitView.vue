<template>
  <section class="habits-view">
    <header class="habits-header">
      <div class="title-block">
        <h1 class="page-title">HABITS</h1>
      </div>

      <div class="toolbar">
        <div class="menu-wrapper">
          <button class="toolbar-btn" @click="toggleExportMenu">
            <Icon icon="lucide:download" class="toolbar-icon" />
            <span>EXPORT</span>
          </button>

          <div v-if="isExportMenuOpen" class="menu-popover">
            <button class="menu-item" @click="exportAs('pdf')">PDF</button>
            <button class="menu-item" @click="exportAs('csv')">CSV</button>
            <button class="menu-item" @click="exportAs('txt')">TXT</button>
          </div>
        </div>

        <div class="menu-wrapper">
          <button class="toolbar-btn" @click="toggleImportMenu">
            <Icon icon="lucide:upload" class="toolbar-icon" />
            <span>IMPORT</span>
          </button>

          <div v-if="isImportMenuOpen" class="menu-popover">
            <button class="menu-item" @click="openImport('pdf')">PDF</button>
            <button class="menu-item" @click="openImport('csv')">CSV</button>
            <button class="menu-item" @click="openImport('txt')">TXT</button>
          </div>
        </div>

        <button
          class="toolbar-btn toolbar-btn-primary"
          @click="openCreateModal"
        >
          <Icon icon="lucide:plus" class="toolbar-icon" />
          <span>NEW HABIT</span>
        </button>
      </div>
    </header>

    <input
      ref="csvInputRef"
      type="file"
      accept=".csv,text/csv"
      class="hidden-input"
      @change="handleImportFile('csv', $event)"
    />
    <input
      ref="txtInputRef"
      type="file"
      accept=".txt,text/plain"
      class="hidden-input"
      @change="handleImportFile('txt', $event)"
    />
    <input
      ref="pdfInputRef"
      type="file"
      accept=".pdf,application/pdf"
      class="hidden-input"
      @change="handleImportFile('pdf', $event)"
    />

    <p v-if="transferMessage" class="transfer-message">
      {{ transferMessage }}
    </p>

    <div class="habit-groups">
      <section
        v-for="group in groupedHabits"
        :key="group.habit.id"
        class="habit-group"
      >
        <div class="group-label">
          <Icon icon="lucide:tag" />
          <span>{{
            group.category?.title?.toUpperCase() ?? "UNCATEGORIZED"
          }}</span>
        </div>

        <HabitsCardMinimal
          :title="group.habit.title"
          :subtitle="formatHabitSubtitle(group.habit)"
          :accent-color="group.habit.color"
          @edit="openEditModal(group.habit)"
          @archive="toggleArchive(group.habit.id)"
          @delete="deleteHabit(group.habit.id)"
        />
      </section>

      <div v-if="groupedHabits.length === 0" class="empty-state">
        No active habits yet. Create one or import a file to get started.
      </div>
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
import HabitsCardMinimal from "@/components/ui/shared/HabitsCardMinimal.vue";
import NeoBrutalismModal from "@/components/ui/NeoBrutalismModal.vue";
import { useHabitStore } from "@/stores/useHabitStore";
import type { Habit } from "@/types/habit";
import type { Category } from "@/types/category";
import {
  exportHabitsAsCsv,
  exportHabitsAsPdf,
  exportHabitsAsTxt,
  importHabitsFromCsv,
  importHabitsFromPdf,
  importHabitsFromTxt,
} from "@/utils/habitTransfer";
import { Icon } from "@iconify/vue";
import { computed, onMounted, ref } from "vue";

type ImportFormat = "csv" | "txt" | "pdf";
type ExportFormat = "csv" | "txt" | "pdf";

const useStore = useHabitStore();

const habits = computed(() => useStore.getHabits as Habit[]);
const categories = computed(() => useStore.getCategories as Category[]);
const activeHabits = computed(() =>
  habits.value.filter((habit) => !habit.archived),
);

const isModalOpen = ref(false);
const modalMode = ref<"create" | "edit">("create");
const selectedHabit = ref<Habit | null>(null);
const isExportMenuOpen = ref(false);
const isImportMenuOpen = ref(false);
const transferMessage = ref("");
const csvInputRef = ref<HTMLInputElement | null>(null);
const txtInputRef = ref<HTMLInputElement | null>(null);
const pdfInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  useStore.fetchHabits();
  useStore.fetchCategories();
});

const groupedHabits = computed(() =>
  activeHabits.value.map((habit) => ({
    habit,
    category: categories.value.find(
      (category) => category.id === habit.categoryIds[0],
    ),
  })),
);

const formatHabitSubtitle = (habit: Habit) => {
  const label = habit.target === 1 ? habit.unit.replace(/s$/, "") : habit.unit;
  return `${habit.target} ${label} / day`;
};

const closeMenus = () => {
  isExportMenuOpen.value = false;
  isImportMenuOpen.value = false;
};

const openCreateModal = () => {
  modalMode.value = "create";
  selectedHabit.value = null;
  isModalOpen.value = true;
  closeMenus();
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

const handleCreate = () => {
  closeModal();
  transferMessage.value = "Habit created.";
};

const handleUpdate = () => {
  closeModal();
  transferMessage.value = "Habit updated.";
};

const toggleArchive = (habitId: string) => {
  useStore.toggleArchiveHabit(habitId);
  transferMessage.value = "Habit archived.";
};

const deleteHabit = (habitId: string) => {
  if (!window.confirm("Delete this habit?")) {
    return;
  }
  useStore.deleteHabit(habitId);
  transferMessage.value = "Habit deleted.";
};

const toggleExportMenu = () => {
  isExportMenuOpen.value = !isExportMenuOpen.value;
  isImportMenuOpen.value = false;
};

const toggleImportMenu = () => {
  isImportMenuOpen.value = !isImportMenuOpen.value;
  isExportMenuOpen.value = false;
};

const exportAs = (format: ExportFormat) => {
  const exportableHabits = activeHabits.value;
  if (format === "pdf") {
    exportHabitsAsPdf(exportableHabits);
  } else if (format === "csv") {
    exportHabitsAsCsv(exportableHabits);
  } else {
    exportHabitsAsTxt(exportableHabits);
  }

  transferMessage.value = `Exported ${exportableHabits.length} habits as ${format.toUpperCase()}.`;
  closeMenus();
};

const openImport = (format: ImportFormat) => {
  closeMenus();
  const map = {
    csv: csvInputRef.value,
    txt: txtInputRef.value,
    pdf: pdfInputRef.value,
  };

  map[format]?.click();
};

const mergeHabits = (incomingHabits: Habit[]) => {
  const byId = new Map<string, Habit>();

  habits.value.forEach((habit) => {
    byId.set(habit.id, habit);
  });

  incomingHabits.forEach((habit) => {
    byId.set(habit.id, habit);
  });

  useStore.replaceHabits([...byId.values()]);
};

const handleImportFile = async (format: ImportFormat, event: Event) => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];

  if (!file) {
    return;
  }

  try {
    const importedHabits =
      format === "pdf"
        ? await importHabitsFromPdf(file)
        : format === "csv"
          ? await importHabitsFromCsv(file)
          : await importHabitsFromTxt(file);

    if (importedHabits.length === 0) {
      transferMessage.value = `No habits could be imported from ${format.toUpperCase()}.`;
    } else {
      mergeHabits(importedHabits);
      transferMessage.value = `Imported ${importedHabits.length} habits from ${format.toUpperCase()}.`;
    }
  } catch (error) {
    transferMessage.value = `Import failed for ${format.toUpperCase()}.`;
    console.error(error);
  } finally {
    if (input) {
      input.value = "";
    }
  }
};
</script>

<style scoped>
.habits-view {
  padding: 28px 24px 36px;
  box-sizing: border-box;
  color: #111111;
}

.habits-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 36px;
}

.page-title,
.group-label,
.toolbar-btn,
.menu-item {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

.page-title {
  margin: 0;
  font-size: clamp(3rem, 6vw, 4.8rem);
  line-height: 0.95;
  font-weight: 900;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 16px;
}

.menu-wrapper {
  position: relative;
}

.toolbar-btn {
  min-height: 110px;
  padding: 24px 28px;
  border: 5px solid #111111;
  background: #ffffff;
  box-shadow: 7px 7px 0 #111111;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.toolbar-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 2px 2px 0 #111111;
}

.toolbar-btn-primary {
  background: #6320ee;
  color: #ffffff;
}

.toolbar-icon {
  width: 32px;
  height: 32px;
}

.menu-popover {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 140px;
  padding: 10px;
  border: 4px solid #111111;
  background: #ffffff;
  box-shadow: 6px 6px 0 #111111;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.menu-item {
  padding: 10px 14px;
  border: 3px solid #111111;
  background: #fffbe8;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
}

.hidden-input {
  display: none;
}

.transfer-message {
  margin: 0 0 18px;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #5b5b5b;
}

.habit-groups {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.habit-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.group-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #606060;
  font-size: 1.15rem;
  font-weight: 900;
}

.empty-state {
  padding: 28px;
  border: 5px solid #111111;
  background: #ffffff;
  box-shadow: 8px 8px 0 #111111;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 1.05rem;
  font-weight: 800;
  text-align: center;
}

@media (max-width: 1180px) {
  .habits-header {
    flex-direction: column;
  }

  .toolbar {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 720px) {
  .habits-view {
    padding: 18px 12px 28px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-btn {
    width: 100%;
    justify-content: center;
    min-height: 84px;
    font-size: 1.15rem;
  }

  .menu-popover {
    left: 0;
    right: auto;
  }
}
</style>
