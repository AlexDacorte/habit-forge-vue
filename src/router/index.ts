import { createRouter, createWebHistory } from "vue-router";
import TodayView from "@/components/ui/views/TodayView.vue";
import HabitView from "@/components/ui/views/HabitView.vue";
import TrackingView from "@/components/ui/views/TrackingView.vue";
import HabitDetailView from "@/components/ui/views/HabitDetailView.vue";
import NotFoundView from "@/components/ui/views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    
    {
      path:"/",
      redirect: '/today'
    },
    {
      path:'/today',
      name: 'Today',
      component:TodayView
    },
    {
      path: "/habits",
      name: "Habits",
      component: HabitView,
    },
    {
      path: "/analytics",
      name: "Analytics",
      component: TrackingView,
    },
    {
      path: "/tracking",
      redirect: "/analytics",
    },
    {
      path: "/habit/:id",
      name: "HabitDetail",
      component: HabitDetailView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
    },
  ],
});

export default router;
