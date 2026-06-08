<script setup lang="ts">
import Header from "@/components/ui/Header.vue";
import TodayView from "@/components/ui/views/TodayView.vue";
import NavBar from "@/components/ui/shared/NavBar.vue";
</script>

<template>
  <Header></Header>
  <RouterView />
  <NavBar ></NavBar>
</template>

<style scoped>

</style>
