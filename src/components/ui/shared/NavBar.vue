<template>
  <nav class="neo-navbar">
    <div class="nav-container">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="nav-item"
        :class="{ 'is-active': activeTab === tab.id }"
        @click="setActiveTab(tab.id)"
      >
        <component :is="tab.icon" class="nav-icon" />
        <span class="nav-label">{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, h, } from 'vue';
import { useRouter } from 'vue-router';

const HomeIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
  h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
  h('polyline', { points: '9 22 9 12 15 12 15 22' })
]);

const HabitsIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
  h('line', { x1: '4', y1: '6', x2: '14', y2: '6' }),
  h('line', { x1: '4', y1: '12', x2: '11', y2: '12' }),
  h('line', { x1: '4', y1: '18', x2: '11', y2: '18' }),
  h('line', { x1: '16', y1: '12', x2: '22', y2: '12' }),
  h('line', { x1: '19', y1: '9', x2: '19', y2: '15' })
]);

const AnalyticsIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
  h('line', { x1: '6', y1: '20', x2: '6', y2: '12' }),
  h('line', { x1: '12', y1: '20', x2: '12', y2: '4' }),
  h('line', { x1: '18', y1: '20', x2: '18', y2: '10' })
]);

const tabs = [
  { id: 'today', label: 'TODAY', icon: HomeIcon },
  { id: 'habits', label: 'HABITS', icon: HabitsIcon },
  { id: 'analytics', label: 'ANALYTICS', icon: AnalyticsIcon }
];

const activeTab = ref('today');
const router = useRouter();

const setActiveTab = (id) => {
  activeTab.value = id;
  router.push(`/${id}`);
};
</script>

<style scoped>
.neo-navbar {
  width: 100%;
  background-color: #ffffff;
  border-top: 6px solid #000000;
  box-sizing: border-box;
  bottom: 0;
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
  transition: background-color 0.15s ease, color 0.15s ease;
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.nav-item:not(.is-active):hover {
  background-color: #f5f5f5;
}
</style>