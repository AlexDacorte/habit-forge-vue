<template>
  <article class="habit-card">
    <div class="accent-bar" :style="{ backgroundColor: accentColor }"></div>

    <div class="habit-content">
      <h3 class="habit-title">{{ title }}</h3>
      <p class="habit-subtitle">{{ subtitle }}</p>
    </div>

    <div class="habit-actions">
      <button class="action-btn btn-white" aria-label="Edit habit" @click="$emit('edit')">
        <Icon icon="lucide:pencil" />
      </button>

      <button class="action-btn btn-white" aria-label="Archive habit" @click="$emit('archive')">
        <Icon icon="lucide:archive" />
      </button>

      <button class="action-btn btn-red" aria-label="Delete habit" @click="$emit('delete')">
        <Icon icon="lucide:trash-2" />
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  title: string;
  subtitle: string;
  accentColor: string;
}>();

defineEmits<{
  edit: [];
  archive: [];
  delete: [];
}>();
</script>

<style scoped>
.habit-card {
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  width: 100%;
  min-height: 148px;
  padding: 22px 26px 22px 46px;
  border: 5px solid #111111;
  background: #ffffff;
  box-shadow: 8px 8px 0 #111111;
  box-sizing: border-box;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.habit-card:hover {
  transform: translate(2px, 2px);
  box-shadow: 6px 6px 0 #111111;
}

.accent-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 14px;
}

.habit-content {
  flex: 1;
  min-width: 0;
}

.habit-title {
  margin: 0 0 10px;
  color: #111111;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: clamp(1.9rem, 3vw, 2.35rem);
  line-height: 1;
  font-weight: 900;
  text-transform: uppercase;
}

.habit-subtitle {
  margin: 0;
  color: #585858;
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  font-weight: 500;
}

.habit-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-btn {
  width: 76px;
  height: 76px;
  border: 5px solid #111111;
  box-shadow: 6px 6px 0 #111111;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.action-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 2px 2px 0 #111111;
}

.action-btn :deep(svg) {
  width: 32px;
  height: 32px;
}

.btn-white {
  background: #ffffff;
  color: #111111;
}

.btn-red {
  background: #ff2222;
  color: #ffffff;
}

@media (max-width: 900px) {
  .habit-card {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
    padding: 22px 18px 22px 34px;
  }

  .habit-actions {
    justify-content: flex-end;
  }

  .action-btn {
    width: 60px;
    height: 60px;
  }

  .action-btn :deep(svg) {
    width: 26px;
    height: 26px;
  }
}
</style>
