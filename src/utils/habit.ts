import type { Habit, HabitLog } from "@/types/habit";

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateKey() {
  return formatDateKey(new Date());
}

export function parseDateKey(dateKey: string) {
  const [yearPart, monthPart, dayPart] = dateKey.slice(0, 10).split("-");
  const year = Number(yearPart) || 1970;
  const month = Number(monthPart) || 1;
  const day = Number(dayPart) || 1;
  return new Date(year, month - 1, day);
}

export function subDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() - days);
  return next;
}

export function differenceInDays(left: Date, right: Date) {
  const leftStart = new Date(
    left.getFullYear(),
    left.getMonth(),
    left.getDate(),
  ).getTime();
  const rightStart = new Date(
    right.getFullYear(),
    right.getMonth(),
    right.getDate(),
  ).getTime();
  return Math.round((leftStart - rightStart) / 86400000);
}

export function getHabitAgeInDays(habit: Habit) {
  return Math.max(1, differenceInDays(new Date(), new Date(habit.createdAt)) + 1);
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(dateKey: string) {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCompactDate(dateKey: string) {
  const date = parseDateKey(dateKey);
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const year = `${date.getFullYear()}`.slice(-2);
  return `${day}/${month}/${year}`;
}

export function getStreak(logs: HabitLog[], habit: Habit) {
  const today = new Date();
  const logDates = new Set(
    logs
      .filter((log) => log.habitId === habit.id && log.value >= habit.target)
      .map((log) => log.date),
  );

  let current = 0;
  let day = today;
  while (true) {
    const dateKey = formatDateKey(day);
    if (logDates.has(dateKey)) {
      current += 1;
      day = subDays(day, 1);
      continue;
    }

    if (differenceInDays(today, day) === 0) {
      day = subDays(day, 1);
      continue;
    }

    break;
  }

  const sortedDates = Array.from(logDates).sort();
  let best = 0;
  let streak = 0;
  let previousDate: Date | null = null;

  sortedDates.forEach((dateKey) => {
    const date = parseDateKey(dateKey);
    if (previousDate && differenceInDays(date, previousDate) === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
    best = Math.max(best, streak);
    previousDate = date;
  });

  return { current, best };
}

export function getCompletionRate(logs: HabitLog[], habit: Habit, days: number) {
  const today = new Date();
  let completed = 0;

  for (let offset = 0; offset < days; offset += 1) {
    const dateKey = formatDateKey(subDays(today, offset));
    const log = logs.find(
      (entry) => entry.habitId === habit.id && entry.date === dateKey,
    );
    if (log && log.value >= habit.target) {
      completed += 1;
    }
  }

  return Math.round((completed / days) * 100);
}

export function getDailyCompletionData(
  logs: HabitLog[],
  habit: Habit,
  days: number,
) {
  const today = new Date();
  const actualDays = Math.max(1, Math.min(days, getHabitAgeInDays(habit)));

  return Array.from({ length: actualDays }, (_, index) => {
    const date = subDays(today, actualDays - 1 - index);
    const dateKey = formatDateKey(date);
    const log = logs.find(
      (entry) => entry.habitId === habit.id && entry.date === dateKey,
    );

    return {
      date: formatShortDate(date),
      value: log?.value ?? 0,
      target: habit.target,
      rawDate: dateKey,
    };
  });
}

export function getWeeklyTrendData(
  logs: HabitLog[],
  habit: Habit,
  weeks?: number,
) {
  const today = new Date();
  const habitStart = new Date(habit.createdAt);
  const totalWeeks = weeks ?? Math.max(1, Math.ceil(getHabitAgeInDays(habit) / 7));
  const result: Array<{
    week: string;
    weekLabel: string;
    average: number;
    completionRate: number;
  }> = [];

  for (let weekIndex = totalWeeks - 1; weekIndex >= 0; weekIndex -= 1) {
    let weekEnd = subDays(today, weekIndex * 7);
    let weekStart = subDays(weekEnd, 6);

    if (weekStart < habitStart) {
      weekStart = habitStart;
    }
    if (weekEnd < habitStart) {
      continue;
    }

    let total = 0;
    let completed = 0;
    const dayCount =
      Math.max(0, differenceInDays(weekEnd, weekStart)) + 1;

    for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
      const day = subDays(weekEnd, dayCount - 1 - dayIndex);
      const dateKey = formatDateKey(day);
      const log = logs.find(
        (entry) => entry.habitId === habit.id && entry.date === dateKey,
      );

      if (log) {
        total += log.value;
      }
      if (log && log.value >= habit.target) {
        completed += 1;
      }
    }

    result.push({
      week: `W${totalWeeks - weekIndex}`,
      weekLabel: `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`,
      average: Math.round((total / dayCount) * 10) / 10,
      completionRate: Math.round((completed / dayCount) * 100),
    });
  }

  return result;
}

export function getHeatmapData(
  logs: HabitLog[],
  habit: Habit,
  days = 365,
) {
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = subDays(today, days - 1 - index);
    const dateKey = formatDateKey(date);
    const log = logs.find(
      (entry) => entry.habitId === habit.id && entry.date === dateKey,
    );
    const value = log?.value ?? 0;
    const intensity = habit.target > 0 ? Math.min(value / habit.target, 1) : 0;

    return {
      date: dateKey,
      displayDate: formatLongDate(dateKey),
      value,
      intensity,
      dayOfWeek: date.getDay(),
    };
  });
}

export function getCompletionDates(logs: HabitLog[], habit: Habit) {
  return logs
    .filter((entry) => entry.habitId === habit.id && entry.value >= habit.target)
    .map((entry) => entry.date)
    .sort((left, right) => right.localeCompare(left));
}

export function getHabitStats(logs: HabitLog[], habit: Habit) {
  const habitLogs = logs.filter((entry) => entry.habitId === habit.id);

  if (habitLogs.length === 0) {
    return {
      average: 0,
      bestDay: "-",
      totalLogged: 0,
      consistency: 0,
      totalEntries: 0,
    };
  }

  const values = habitLogs.map((entry) => entry.value);
  const average =
    Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) /
    10;
  const bestValue = Math.max(...values);
  const bestLog = habitLogs.find((entry) => entry.value === bestValue);
  const completedDays = habitLogs.filter(
    (entry) => entry.value >= habit.target,
  ).length;
  const daysSinceCreation = Math.max(
    1,
    differenceInDays(new Date(), new Date(habit.createdAt)) + 1,
  );

  return {
    average,
    bestDay: bestLog ? formatLongDate(bestLog.date) : "-",
    totalLogged: values.reduce((sum, value) => sum + value, 0),
    consistency: Math.round((completedDays / daysSinceCreation) * 100),
    totalEntries: habitLogs.length,
  };
}
