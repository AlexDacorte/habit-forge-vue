import { createRouter, createWebHistory } from "vue-router";
import TodayView from "@/components/ui/views/TodayView.vue";
import HabitView from "@/components/ui/views/HabitView.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/today"
    },
    {
      path: "/today",
      name: "Today",
      component: TodayView
    },
    {
      path: "/habits",
      name: "Habits",
      component: HabitView
    }
  ],
});


  

export default router;
