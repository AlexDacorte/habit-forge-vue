<template>
  <div class="analytics-btn-wrapper">
    <button
      class="analytics-btn"
      :class="{ 'btn-shadow': hasShadow }"
      @click="$emit('click')"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup>
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
  padding: 10px;
  box-sizing: border-box;
}

.analytics-btn {
  width: 100%;
  max-width: 1200px;
  background-color: #e53e7e;
  color: #ffffff;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 20px 30px;
  border: 5px solid #000000;
  cursor: pointer;
  position: relative;
  outline: none;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.analytics-btn.btn-shadow {
  box-shadow: 6px 6px 0px 0px #000000;
}

.analytics-btn:hover {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 2px 1px #000000;
  animation: all 0.1s ease-in-out;
}

.analytics-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0px 0px #000000;
}
</style>
