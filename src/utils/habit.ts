import type { HabitUnit } from "@/types/habit";

type UnitConfig = {
  mode: "count" | "measure";
  step: number;
  min: number;
  decimals: number;
  actionLabel: string;
};

const unitConfigMap: Record<HabitUnit, UnitConfig> = {
  ml: {
    mode: "measure",
    step: 250,
    min: 250,
    decimals: 0,
    actionLabel: "Log water",
  },
  problem: {
    mode: "count",
    step: 1,
    min: 1,
    decimals: 0,
    actionLabel: "Solve one",
  },
  km: {
    mode: "measure",
    step: 0.5,
    min: 0.5,
    decimals: 1,
    actionLabel: "Log distance",
  },
  minutes: {
    mode: "measure",
    step: 5,
    min: 5,
    decimals: 0,
    actionLabel: "Log time",
  },
  days: {
    mode: "count",
    step: 1,
    min: 1,
    decimals: 0,
    actionLabel: "Mark day",
  },
  weeks: {
    mode: "count",
    step: 1,
    min: 1,
    decimals: 0,
    actionLabel: "Mark week",
  },
};

export const getTodayDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const isSameDay = (left: string, right: string) => {
  return left.slice(0, 10) === right.slice(0, 10);
};

export const isCreatedToday = (createdAt: string) => {
  return isSameDay(createdAt, getTodayDateKey());
};

export const getUnitConfig = (unit: HabitUnit): UnitConfig => {
  return unitConfigMap[unit];
};

export const formatUnitValue = (value: number, decimals: number) => {
  return Number(value.toFixed(decimals)).toString();
};

export const sanitizeProgressValue = (value: number, decimals: number) => {
  return Number(Math.max(0, value).toFixed(decimals));
};
