<script setup lang="ts">
import Header from "@/components/ui/Header.vue";
import NavBar from "@/components/ui/shared/NavBar.vue";
</script>

<template>
  <Header></Header>
  <div class="app-content">
    <RouterView />
  </div>
  <NavBar></NavBar>
</template>

<style scoped>
.app-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8rem;
  max-width: 1600px;
  width: 100%;
}
</style>
