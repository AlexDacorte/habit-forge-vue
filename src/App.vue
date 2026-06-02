<script setup lang="ts">
import Header from "@/components/ui/Header.vue";
import HabitsView from "@/components/ui/views/HabitsView.vue";
</script>

<template>
  <Header></Header>
  <section class="data-habits">
    <HabitsView></HabitsView>
  </section>
</template>

<style scoped>
.data-habits {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}
</style>
