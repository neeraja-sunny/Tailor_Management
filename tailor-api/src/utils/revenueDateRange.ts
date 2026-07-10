import { Request } from "express";

export type RevenuePeriod = "daily" | "weekly" | "monthly" | "yearly";

const isValidDateString = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

const isValidWeekString = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-W\d{2}$/.test(value);

const isValidMonthString = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}$/.test(value);

const isValidYearString = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}$/.test(value);

const startOfToday = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const getISOWeekValue = (date: Date) => {
  const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((day.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

export const getRevenueDateRange = (period: unknown, query: Request["query"]) => {
  const selectedPeriod: RevenuePeriod =
    period === "weekly" || period === "monthly" || period === "yearly" ? period : "daily";

  if (selectedPeriod === "daily") {
    const selectedDate = isValidDateString(query.date)
      ? query.date
      : startOfToday().toISOString().slice(0, 10);
    const start = new Date(`${selectedDate}T00:00:00.000`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { period: selectedPeriod, selectedValue: selectedDate, start, end };
  }

  if (selectedPeriod === "weekly") {
    const selectedWeek = isValidWeekString(query.week)
      ? query.week
      : getISOWeekValue(startOfToday());
    const [year, week] = selectedWeek.split("-W").map(Number);
    const firstThursday = new Date(year, 0, 4);
    const firstMonday = new Date(firstThursday);
    firstMonday.setDate(firstThursday.getDate() - ((firstThursday.getDay() || 7) - 1));
    const start = new Date(firstMonday);
    start.setDate(firstMonday.getDate() + (week - 1) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { period: selectedPeriod, selectedValue: selectedWeek, start, end };
  }

  if (selectedPeriod === "monthly") {
    const today = startOfToday();
    const selectedMonth = isValidMonthString(query.month)
      ? query.month
      : `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const [year, month] = selectedMonth.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    return { period: selectedPeriod, selectedValue: selectedMonth, start, end };
  }

  const selectedYear = isValidYearString(query.year)
    ? query.year
    : String(startOfToday().getFullYear());
  const year = Number(selectedYear);
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  return { period: selectedPeriod, selectedValue: selectedYear, start, end };
};
