<template>
  <nav class="neo-navbar">
    <div class="nav-container">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-item"
        :class="{ 'is-active': activeTab === tab.id }"
        @click="router.push(tab.path)"
      >
        <Icon :icon="tab.icon" class="nav-icon" />
        <span class="nav-label">{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const tabs = [
  { id: "today", label: "TODAY", icon: "mynaui:home", path: "/" },
  { id: "habits", label: "HABITS", icon: "boxicons:list-plus", path: "/habits" },
  { id: "analytics", label: "ANALYTICS", icon: "mdi:graph-line", path: "/analytics" },
];

const router = useRouter();
const route = useRoute();

const activeTab = computed(() => {
  if (route.path.startsWith("/habit/")) {
    return "today";
  }
  if (route.path === "/") {
    return "today";
  }
  return route.path.slice(1);
});
</script>

<style scoped>
.neo-navbar {
  width: 100%;
  background-color: #ffffff;
  border-top: 6px solid #000000;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 30;
}

.nav-container {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  height: 85px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #000000;
  cursor: pointer;
  padding: 10px 0;
}

.nav-item.is-active {
  background-color: #5d1df1;
  color: #ffffff;
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
