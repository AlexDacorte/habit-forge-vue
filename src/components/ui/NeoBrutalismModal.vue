<template>
  <div v-if="isOpen" class="habit-modal">
    <div class="modal-overlay" @click="$emit('close')"></div>

    <div class="modal-body">
      <div class="modal-header">
        <h2 class="modal-title">New Habit</h2>
        <button type="button" class="close-btn" @click="$emit('close')">
          ✕
        </button>
      </div>

      <form class="habit-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label" for="habit-title">Title</label>
          <input
            id="habit-title"
            v-model="form.title"
            type="text"
            placeholder="e.g. Drink water"
            class="form-input"
          />
          <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="habit-description">Description</label>
          <textarea
            id="habit-description"
            v-model="form.description"
            rows="3"
            placeholder="What does success look like today?"
            class="form-textarea"
          ></textarea>
          <p v-if="errors.description" class="form-error">
            {{ errors.description }}
          </p>
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
            <select id="habit-unit" v-model="form.unit" class="form-input">
              <option disabled value="">Choose a unit</option>
              <option v-for="unit in habitUnits" :key="unit" :value="unit">
                {{ unit }}
              </option>
            </select>
            <p v-if="errors.unit" class="form-error">{{ errors.unit }}</p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="habit-created-at">Creation Date</label>
          <input
            id="habit-created-at"
            v-model="form.createdAt"
            type="date"
            class="form-input"
          />
          <p v-if="errors.createdAt" class="form-error">
            {{ errors.createdAt }}
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Categories</label>
          <div class="category-grid">
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="category-btn"
              :class="{ 'is-selected': form.categoryIds.includes(category.id) }"
              @click="toggleCategory(category.id)"
            >
              {{ category.title }}
            </button>
          </div>
          <p v-if="errors.categoryIds" class="form-error">
            {{ errors.categoryIds }}
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Color</label>
          <div class="color-row">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              class="color-picker-btn"
              :class="{ 'is-selected': form.color === color }"
              :style="{ backgroundColor: color }"
              :aria-label="`Select ${color} color`"
              @click="form.color = color"
            ></button>
          </div>
          <p v-if="errors.color" class="form-error">{{ errors.color }}</p>
        </div>

        <button type="submit" class="submit-btn">Create Habit</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useHabitStore } from "@/stores/useHabitStore";
import { habitFormSchema } from "@/schemas/habit";
import { habitUnits, type Habit } from "@/types/habit";
import type { Category } from "@/types/category";
import { getTodayDateKey } from "@/utils/habit";

const emit = defineEmits<{
  close: [];
  create: [habit: Habit];
}>();

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const useStore = useHabitStore();
const categories = useStore.fetchCategories() as Category[];
const colors = [...new Set(categories.map((cat) => cat.color))];

const createInitialForm = () => ({
  title: "",
  description: "",
  categoryIds: [] as string[],
  progress: 0,
  target: 1,
  unit: "" as Habit["unit"] | "",
  color: colors[0] ?? "#6320ee",
  createdAt: getTodayDateKey(),
});

const form = reactive(createInitialForm());
const errors = reactive<Record<string, string>>({});

const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
};

const resetForm = () => {
  Object.assign(form, createInitialForm());
  clearErrors();
};

const toggleCategory = (categoryId: string) => {
  form.categoryIds = form.categoryIds.includes(categoryId)
    ? form.categoryIds.filter((id) => id !== categoryId)
    : [...form.categoryIds, categoryId];
};

const handleSubmit = () => {
  clearErrors();
  const parsed = habitFormSchema.safeParse(form);

  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      if (typeof fieldName === "string" && !errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    });
    return;
  }

  const newHabit: Habit = {
    id: crypto.randomUUID(),
    progress: 0,
    ...parsed.data,
  };

  useStore.createHabit(newHabit);
  emit("create", newHabit);
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
  z-index: 5;
  background: rgba(0, 0, 0, 0.5);
}

.modal-body {
  position: relative;
  margin: 6rem auto;
  z-index: 8;
  width: 100%;
  max-width: 460px;
  background-color: #ffffff;
  border: 4px solid #000000;
  padding: 24px;
  font-family: "Courier New", Courier, monospace;
  color: #000000;
  box-shadow: 8px 8px 0 0 #000000;
  box-sizing: border-box;
}

.habit-modal * {
  box-sizing: border-box;
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
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #000000;
  background: #ffffff;
  color: #000000;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  outline: none;
}

.form-error {
  margin: 8px 0 0;
  color: #d11a2a;
  font-size: 0.8rem;
  font-weight: 700;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-btn {
  padding: 10px 14px;
  border: 3px solid #000000;
  background: #ffffff;
  box-shadow: 4px 4px 0 #000000;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
}

.category-btn.is-selected {
  background: #6320ee;
  color: #ffffff;
}

.color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-picker-btn {
  width: 38px;
  height: 38px;
  border: 3px solid #000000;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000000;
}

.color-picker-btn.is-selected {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000000;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  border: 4px solid #000000;
  background: #6320ee;
  color: #ffffff;
  box-shadow: 6px 6px 0 #000000;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
}

@media (max-width: 640px) {
  .modal-body {
    margin: 3rem 16px;
    width: auto;
  }

  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
