<script setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "MODAL TITLE",
  },
  accentColor: {
    type: String,
    default: "#E15A84",
  },
});

const emit = defineEmits(["close", "confirm"]);

const handleKeyDown = (e) => {
  if (e.key === "Escape" && props.isOpen) {
    emit("close");
  }
};

onMounted(() => window.addEventListener("keydown", handleKeyDown));
onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="nb-modal-overlay" @click.self="emit('close')">
      <div
        class="nb-modal-container"
        :style="{ '--accent-color': accentColor }"
        role="dialog"
        aria-modal="true"
      >
        <div class="nb-modal-top-bar"></div>

        <header class="nb-modal-header">
          <h2 class="nb-modal-title">{{ title.toUpperCase() }}</h2>
          <button
            class="nb-modal-close-btn"
            @click="emit('close')"
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        <div class="nb-modal-body">
          <slot>
            <p>
              Your content goes here. You can pass any custom elements or forms
              inside the default slot.
            </p>
          </slot>
        </div>

        <footer class="nb-modal-footer">
          <button class="nb-btn nb-btn-secondary" @click="emit('close')">
            CANCEL
          </button>
          <button class="nb-btn nb-btn-primary" @click="emit('confirm')">
            CONFIRM →
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.nb-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1.5rem;
}

.nb-modal-container {
  position: relative;
  background-color: #fffdf6;
  border: 4px solid #000000;
  box-shadow: 8px 8px 0px #000000;
  width: 100%;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Courier New", Courier, monospace, system-ui;
}

.nb-modal-top-bar {
  height: 8px;
  background-color: var(--accent-color);
  border-bottom: 4px solid #000000;
}

.nb-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 4px solid #000000;
  background-color: #ffffff;
}

.nb-modal-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: #000000;
  margin: 0;
  letter-spacing: 0.05em;
}

.nb-modal-close-btn {
  background: none;
  border: 2px solid transparent;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 2px 6px;
  transition: all 0.1s ease;
}

.nb-modal-close-btn:hover {
  border-color: #000000;
  background-color: #f0f0f0;
}

.nb-modal-body {
  padding: 1.5rem;
  font-size: 1rem;
  color: #1a1a1a;
  line-height: 1.5;
  background-color: #fffdf6;
}

.nb-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border-top: 4px solid #000000;
}

.nb-btn {
  font-family: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.6rem 1.2rem;
  border: 3px solid #000000;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.nb-btn-secondary {
  background-color: #ffffff;
  color: #000000;
  box-shadow: 3px 3px 0px #000000;
}

.nb-btn-primary {
  background-color: var(--accent-color);
  color: #ffffff;
  box-shadow: 3px 3px 0px #000000;
  text-shadow: 1px 1px 0px #000000;
}

.nb-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #000000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .nb-modal-container {
  animation: pop-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
  0% {
    transform: scale(0.92);
  }
  100% {
    transform: scale(1);
  }
}
</style>
