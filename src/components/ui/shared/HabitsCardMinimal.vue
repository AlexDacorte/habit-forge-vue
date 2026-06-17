<template>
  <article class="habit-card" :class="{ archived }">
    <div class="accent-bar" :style="{ backgroundColor: accentColor }"></div>

    <div class="habit-content">
      <h3 class="habit-title">{{ title }}</h3>
      <p class="habit-subtitle">{{ subtitle }}</p>
    </div>

    <div class="habit-actions">
      <button class="action-btn btn-white" aria-label="Edit habit" @click="$emit('edit')">
        <Icon icon="lucide:pencil" />
      </button>

      <button class="action-btn btn-white" :aria-label="archiveLabel" @click="$emit('archive')">
        <Icon :icon="archived ? 'lucide:archive-restore' : 'lucide:archive'" />
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
  archived?: boolean;
  archiveLabel?: string;
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
  min-height: 100px;
  padding: 18px 22px 18px 40px;
  border: 5px solid #111111;
  background: #ffffff;
  box-shadow: 8px 8px 0 #111111;
  box-sizing: border-box;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.habit-card:hover {
  box-shadow: var(--neo-shadow-lg);
  transform: translate(-2px, -2px);
}

.habit-card.archived {
  opacity: 0.65;
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
  font-size: clamp(1.2rem, 2.4vw, 1.6rem);
  line-height: 1;
  font-weight: 900;
  text-transform: uppercase;
  font-family: var(--font-title);
}

.habit-subtitle {
  margin: 0;
  color: #585858;
  font-size: 0.95rem;
  font-weight: 600;
}

.habit-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  width: 42px;
  height: 42px;
  border: 5px solid #111111;
  box-shadow: 6px 6px 0 #111111;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.action-btn :deep(svg) {
  width: 18px;
  height: 18px;
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
}
</style>
