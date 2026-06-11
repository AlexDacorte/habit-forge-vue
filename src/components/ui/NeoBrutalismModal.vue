<template>
  <div class="habit-modal">
    <div class="modal-header">
      <h2 class="modal-title">New Habit</h2>
      <button type="button" @click="$emit('close')" class="close-btn">✕</button>
    </div>

    <form @submit.prevent="handleSubmit" class="habit-form">
      <div class="form-group">
        <label class="form-label">Title</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="e.g. Drink water"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea
          v-model="form.description"
          placeholder="Optional notes about this habit"
          rows="3"
          class="form-textarea"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group half-width">
          <label class="form-label">Target</label>
          <input
            v-model.number="form.target"
            type="number"
            placeholder="8"
            class="form-input"
            required
          />
        </div>
        <div class="form-group half-width">
          <label class="form-label">Unit</label>
          <input
            v-model="form.unit"
            type="text"
            placeholder="glasses"
            class="form-input"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Categories</label>
        <div class="category-grid">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            @click="form.category = category"
            :class="[
              'category-btn',
              { 'is-selected': form.category === category },
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Color</label>
        <div class="color-row">
          <button
            v-for="color in colors"
            :key="color.value"
            type="button"
            @click="form.color = color.value"
            :style="{ backgroundColor: color.hex }"
            :class="[
              'color-picker-btn',
              { 'is-selected': form.color === color.value },
            ]"
            :aria-label="`Select ${color.value} color`"
          ></button>
        </div>
      </div>

      <div class="reminder-row">
        <span class="form-label no-margin">Reminder</span>
        <button
          type="button"
          @click="form.reminder = !form.reminder"
          class="reminder-toggle-btn"
        >
          <span v-if="form.reminder" class="icon">🔔 ON</span>
          <span v-else class="icon">🔕 OFF</span>
        </button>
      </div>

      <button type="submit" class="submit-btn">Create Habit</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const emit = defineEmits(["close", "create"]);

const form = reactive({
  title: "",
  description: "",
  target: null,
  unit: "",
  category: "OTHER",
  color: "purple",
  reminder: false,
});

const categories = [
  "HEALTH",
  "FITNESS",
  "LEARNING",
  "MINDFULNESS",
  "PRODUCTIVITY",
  "CREATIVE",
  "SOCIAL",
  "OTHER",
];

const colors = [
  { value: "yellow", hex: "#F4D03F" },
  { value: "pink", hex: "#E54B86" },
  { value: "cyan", hex: "#29D1E6" },
  { value: "green", hex: "#7ED321" },
  { value: "orange", hex: "#F5A623" },
  { value: "purple", hex: "#6320EE" },
];

const handleSubmit = () => {
  emit("create", { ...form });
};
</script>

<style scoped>
.habit-modal {
  --border-color: #000000;
  --primary-purple: #6320ee;

  width: 100%;
  max-width: 440px;
  background-color: #ffffff;
  border: 4px solid var(--border-color);
  padding: 24px;
  font-family: "Courier New", Courier, monospace;
  color: var(--border-color);
  box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
  box-sizing: border-box;
}

.habit-modal * {
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-b: 4px solid var(--border-color);
  padding-bottom: 16px;
  margin-bottom: 24px;
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
  color: var(--border-color);
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
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.form-label.no-margin {
  margin-bottom: 0;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 2px solid var(--border-color);
  padding: 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: bold;
  background: #ffffff;
  color: var(--border-color);
  outline: none;
  transition: box-shadow 0.15s ease-in-out;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #b0b0b0;
}

.form-input:focus,
.form-textarea:focus {
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
}

.form-textarea {
  resize: vertical;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn {
  background-color: #ffffff;
  color: var(--border-color);
  border: 2px solid var(--border-color);
  padding: 6px 12px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 1);
  transition: all 0.1s ease;
}

.category-btn.is-selected {
  background-color: var(--primary-purple);
  color: #ffffff;
}

.category-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.color-row {
  display: flex;
  gap: 8px;
}

.color-picker-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s ease;
}

.color-picker-btn:hover {
  transform: scale(1.05);
}

.color-picker-btn.is-selected {
  border: 3px solid var(--border-color);
  outline: 2px solid var(--border-color);
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 1);
  transform: scale(1.05);
}

.reminder-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.reminder-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  border: 2px solid var(--border-color);
  padding: 6px 12px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 1);
}

.reminder-toggle-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.submit-btn {
  width: 100%;
  background-color: var(--primary-purple);
  color: #ffffff;
  border: 4px solid var(--border-color);
  padding: 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
  transition: all 0.1s ease;
}

.submit-btn:hover {
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 1);
}

.submit-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 1);
}
</style>
