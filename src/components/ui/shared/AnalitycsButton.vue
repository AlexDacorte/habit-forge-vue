<template>
  <div class="analytics-btn-wrapper">
    <button
      class="analytics-btn"
      :class="{ 'btn-shadow': hasShadow }"
      @click="$emit('click')"
    >
      <span>{{ label }}</span>
      <Icon icon="lucide:arrow-right" class="arrow-icon" />
    </button>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { defineProps, defineEmits } from "vue";

defineProps({
  label: {
    type: String,
    default: "VIEW ANALYTICS →",
  },
  hasShadow: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["click"]);
</script>

<style scoped>
.analytics-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.analytics-btn {
  width: 100%;
  background-color: #e53e7e;
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 18px 24px;
  border: 5px solid #000000;
  cursor: pointer;
  position: relative;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.analytics-btn.btn-shadow {
  box-shadow: 6px 6px 0px 0px #000000;
}

.analytics-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px 0px #000000;
}

.analytics-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px 0px #000000;
}

.arrow-icon {
  width: 18px;
  height: 18px;
}
</style>
