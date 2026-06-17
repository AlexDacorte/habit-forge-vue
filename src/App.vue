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
  padding: 20px 20px 128px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
