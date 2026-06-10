import { createRouter, createWebHistory } from "vue-router";
import TodayView from "@/components/ui/views/TodayView.vue";
import HabitView from "@/components/ui/views/HabitView.vue";
import AnalyticsView from "@/components/ui/views/AnalyticsView.vue";

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
    },
    {
      path: "/analytics",
      name: "Analytics",
      component: AnalyticsView
    }
  ],
});

export default router;
