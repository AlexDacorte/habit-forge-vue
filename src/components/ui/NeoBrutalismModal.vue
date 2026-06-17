<template>
  <div v-if="isOpen" class="habit-modal">
    <div class="modal-overlay" @click="$emit('close')"></div>

    <div class="modal-body">
      <div class="modal-header">
        <h2 class="modal-title">
          {{ mode === "edit" ? "Edit Habit" : "New Habit" }}
        </h2>
        <button type="button" class="close-btn" @click="$emit('close')">
          ✕
        </button>
      </div>

      <form class="habit-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label" for="habit-name">Name</label>
          <input
            id="habit-name"
            v-model="form.name"
            type="text"
            placeholder="e.g. Drink water"
            class="form-input"
          />
          <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label class="form-label" for="habit-target">Target</label>
            <input
              id="habit-target"
              v-model.number="form.target"
              type="number"
              min="1"
              class="form-input"
            />
            <p v-if="errors.target" class="form-error">{{ errors.target }}</p>
          </div>

          <div class="form-group half-width">
            <label class="form-label" for="habit-unit">Unit</label>
            <input
              id="habit-unit"
              v-model="form.unit"
              type="text"
              placeholder="pages"
              class="form-input"
            />
            <p v-if="errors.unit" class="form-error">{{ errors.unit }}</p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Category</label>
          <div class="category-grid">
            <button
              v-for="category in HABIT_CATEGORIES"
              :key="category"
              type="button"
              class="category-btn"
              :class="{ 'is-selected': form.category === category }"
              @click="form.category = category"
            >
              {{ category }}
            </button>
          </div>
          <p v-if="errors.category" class="form-error">{{ errors.category }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Color</label>
          <div class="color-row">
            <button
              v-for="color in colorOptions"
              :key="color"
              type="button"
              class="color-picker-btn"
              :class="{ 'is-selected': form.color === color }"
              :style="{ backgroundColor: resolveHabitColor(color) }"
              :aria-label="`Select ${color} color`"
              @click="form.color = color"
            ></button>
          </div>
          <div class="custom-color-row">
            <input
              v-model="customColor"
              type="color"
              class="custom-color-input"
              aria-label="Pick a custom color"
            />
            <button
              type="button"
              class="custom-color-button"
              @click="addCustomColorOption"
            >
              ADD COLOR
            </button>
          </div>
          <p v-if="errors.color" class="form-error">{{ errors.color }}</p>
        </div>

        <div class="form-group">
          <div class="reminder-header">
            <label class="form-label" for="habit-reminder">Reminder</label>
            <button
              type="button"
              class="reminder-toggle"
              @click="toggleReminder"
            >
              {{ reminderEnabled ? "ON" : "OFF" }}
            </button>
          </div>
          <input
            v-if="reminderEnabled"
            id="habit-reminder"
            v-model="form.reminderTime"
            type="time"
            class="form-input"
          />
          <p v-if="errors.reminderTime" class="form-error">
            {{ errors.reminderTime }}
          </p>
        </div>

        <button type="submit" class="submit-btn">
          {{ mode === "edit" ? "Save Changes" : "Create Habit" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { habitFormSchema } from "@/schemas/habit";
import { useHabitStore } from "@/stores/useHabitStore";
import {
  HABIT_CATEGORIES,
  type Habit,
  type HabitColor,
  resolveHabitColor,
} from "@/types/habit";

const emit = defineEmits<{
  close: [];
  create: [habit: Omit<Habit, "id" | "createdAt" | "archived">];
  update: [
    payload: {
      id: string;
      updates: Partial<Omit<Habit, "id" | "createdAt" | "archived">>;
    },
  ];
}>();

const props = defineProps<{
  isOpen: boolean;
  mode?: "create" | "edit";
  initialHabit?: Habit | null;
}>();

const store = useHabitStore();
store.ensureLoaded();

const baseColorKeys = [
  "yellow",
  "pink",
  "cyan",
  "lime",
  "orange",
  "purple",
] as HabitColor[];

const colorOptions = computed(() => [...baseColorKeys, ...store.customColors]);

const createInitialForm = () => ({
  name: "",
  target: 1,
  unit: "",
  category: "Other" as Habit["category"],
  color: "purple" as HabitColor,
  reminderTime: "09:00",
});

const form = reactive(createInitialForm());
const errors = reactive<Record<string, string>>({});
const reminderEnabled = ref(false);
const customColor = ref("#6320ee");

const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
};

const resetForm = () => {
  if (props.mode === "edit" && props.initialHabit) {
    Object.assign(form, {
      name: props.initialHabit.name,
      target: props.initialHabit.target,
      unit: props.initialHabit.unit,
      category: props.initialHabit.category ?? "Other",
      color: props.initialHabit.color,
      reminderTime: props.initialHabit.reminderTime ?? "09:00",
    });
    reminderEnabled.value = Boolean(props.initialHabit.reminderTime);
  } else {
    Object.assign(form, createInitialForm());
    reminderEnabled.value = false;
  }
  customColor.value = "#6320ee";
  clearErrors();
};

watch(
  () => [props.isOpen, props.mode, props.initialHabit] as const,
  () => {
    if (props.isOpen) {
      resetForm();
    }
  },
  { immediate: true },
);

const toggleReminder = () => {
  reminderEnabled.value = !reminderEnabled.value;
};

const addCustomColorOption = () => {
  store.addCustomColor(customColor.value);
  form.color = customColor.value;
};

const handleSubmit = () => {
  clearErrors();
  const parsed = habitFormSchema.safeParse({
    ...form,
    reminderTime: reminderEnabled.value ? form.reminderTime : undefined,
  });

  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      if (typeof fieldName === "string" && !errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    });
    return;
  }

  const payload = {
    ...parsed.data,
    reminderTime:
      reminderEnabled.value && parsed.data.reminderTime
        ? parsed.data.reminderTime
        : undefined,
  };

  if (props.mode === "edit" && props.initialHabit) {
    emit("update", {
      id: props.initialHabit.id,
      updates: payload,
    });
  } else {
    emit("create", payload);
  }

  emit("close");
  resetForm();
};
</script>

<style scoped>
.habit-modal {
  position: absolute;
  inset: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 31;
  background: rgba(0, 0, 0, 0.9);
}

.modal-body {
  position: relative;
  margin: 1.5rem auto;
  z-index: 8;
  width: calc(100% - 24px);
  max-width: 460px;
  background-color: #ffffff;
  border: 4px solid #000000;
  padding: 24px;
  font-family: var(--font-body);
  color: #000000;
  box-shadow: 8px 8px 0 0 #000000;
  box-sizing: border-box;
  z-index: 32;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 4px solid #000000;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-title);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
  color: #000000;
}

.habit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 16px;
}

.half-width {
  flex: 1;
}

.form-label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  border: 3px solid #000000;
  background: #ffffff;
  padding: 12px 14px;
  font: inherit;
}

.category-grid,
.color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-btn,
.reminder-toggle,
.submit-btn {
  border: 3px solid #000000;
  background: #ffffff;
  box-shadow: 4px 4px 0 #000000;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

.category-btn {
  padding: 10px 12px;
}

.category-btn.is-selected,
.reminder-toggle {
  background: #5d1df1;
  color: #ffffff;
}

.color-picker-btn {
  width: 34px;
  height: 34px;
  border: 3px solid #000000;
  cursor: pointer;
}

.color-picker-btn.is-selected {
  transform: scale(1.1);
}

.custom-color-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.custom-color-input {
  width: 56px;
  height: 44px;
  padding: 0;
  border: 3px solid #000000;
  background: #ffffff;
  box-shadow: 4px 4px 0 #000000;
  cursor: pointer;
}

.custom-color-button {
  border: 3px solid #000000;
  background: #ffffff;
  box-shadow: 4px 4px 0 #000000;
  padding: 10px 14px;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}

.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reminder-toggle {
  padding: 8px 12px;
}

.submit-btn {
  padding: 14px 18px;
  background: #111111;
  color: #ffffff;
}

.form-error {
  margin: 8px 0 0;
  color: #b91c1c;
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }
}
</style>
