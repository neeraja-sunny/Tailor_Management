"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { IndianRupee, ArrowRight, CalendarDays, Download } from "lucide-react";
import Link from "next/link";

type DailyRevenue = {
  _id: { date: string };
  total: number;
};

type RevenuePeriod = "daily" | "weekly" | "monthly" | "yearly";

type RevenueSummary = {
  totalRevenue: number;
  orderCount: number;
  period: RevenuePeriod;
  selectedValue: string;
  startDate: string;
  endDate: string;
};

const periodOptions: { value: RevenuePeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const getISOWeekValue = (date: Date) => {
  const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((day.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

const getInitialFilters = () => {
  const today = new Date();
  return {
    daily: toDateInputValue(today),
    weekly: getISOWeekValue(today),
    monthly: toDateInputValue(today).slice(0, 7),
    yearly: String(today.getFullYear()),
  };
};

export default function RevenuePage() {
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [period, setPeriod] = useState<RevenuePeriod>("daily");
  const [filters, setFilters] = useState(getInitialFilters);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [showAllBreakdown, setShowAllBreakdown] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchDailyRevenue();
    setShowAllBreakdown(false);
  }, [period, filters.daily, filters.weekly, filters.monthly, filters.yearly]);

  useEffect(() => {
    fetchSummary();
  }, [period, filters.daily, filters.weekly, filters.monthly, filters.yearly]);

  const fetchDailyRevenue = async () => {
    const params = getRevenueParams();

    try {
      setLoading(true);
      const res = await api.get("/api/revenue/daily", { params });
      setDailyRevenue(res.data || []);
    } catch (err) {
      console.error("Revenue fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const getRevenueParams = () => ({
      period,
      date: filters.daily,
      week: filters.weekly,
      month: filters.monthly,
      year: filters.yearly,
  });

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const res = await api.get("/api/revenue/summary", { params: getRevenueParams() });
      setSummary(res.data || null);
    } catch (err) {
      console.error("Revenue summary fetch failed", err);
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilters((current) => ({
      ...current,
      [period]: value,
    }));
  };

  const downloadStatement = async () => {
    try {
      setDownloading(true);
      const res = await api.get("/api/reports/revenue/csv", {
        params: getRevenueParams(),
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `revenue-${period}-${selectedFilterValue}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Revenue statement download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const selectedFilterValue = filters[period];
  const rangeEnd = summary ? new Date(summary.endDate) : null;
  if (rangeEnd) rangeEnd.setDate(rangeEnd.getDate() - 1);
  const rangeLabel = summary && rangeEnd
    ? `${new Date(summary.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} - ${rangeEnd.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`
    : "Select a range";
  const visibleRevenue = showAllBreakdown ? dailyRevenue : dailyRevenue.slice(0, 5);
  const selectedPeriodLabel = periodOptions.find((option) => option.value === period)?.label;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-700">
          Revenue Overview
        </h1>
        <p className="text-gray-600 mt-2 font-semibold">
          Track total revenue by day, week, month, or year
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border p-5 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500">Revenue filter</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setPeriod(option.value);
                    setShowAllBreakdown(false);
                  }}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                    period === option.value
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <label className="w-full lg:w-64">
            <span className="text-sm font-semibold text-gray-500">
              Select {periodOptions.find((option) => option.value === period)?.label}
            </span>
            <input
              type={period === "yearly" ? "number" : period === "daily" ? "date" : period === "weekly" ? "week" : "month"}
              value={selectedFilterValue}
              min={period === "yearly" ? "2000" : undefined}
              max={period === "yearly" ? "2100" : undefined}
              onChange={(event) => handleFilterChange(event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>
      </div>

      {/* TOTAL REVENUE CARD */}
      <div className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="opacity-90 mb-1 font-semibold text-md">
              {selectedPeriodLabel} Total Revenue
            </p>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-7 h-7" />
              <span className="text-3xl font-bold">
                {summaryLoading ? "..." : (summary?.totalRevenue || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="rounded-md bg-white/15 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <CalendarDays className="h-4 w-4" />
              Selected range
            </div>
            <p className="mt-1 opacity-90">{rangeLabel}</p>
            <p className="mt-2 font-semibold">{summary?.orderCount || 0} paid orders</p>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadStatement}
          disabled={downloading || summaryLoading}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Downloading..." : "Download statement"}
        </button>
      </div>

      {/* DAILY REVENUE */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            {selectedPeriodLabel} Revenue Breakdown
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Showing revenue days inside the selected range
          </p>
        </div>

        {loading && (
          <p className="p-6 text-gray-500">Loading revenue data...</p>
        )}

        {!loading && dailyRevenue.length === 0 && (
          <p className="p-6 text-gray-500">
            No revenue data available
          </p>
        )}

        <ul className="divide-y">
          {visibleRevenue.map((d) => (
            <li
              key={d._id.date}
              className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {new Date(d._id.date).toDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Daily earnings
                </p>
              </div>

              <div className="flex items-center gap-6">
                <span className="font-semibold text-gray-900">
                  {"\u20B9"}
                  {d.total.toLocaleString("en-IN")}
                </span>

                <Link
                  href={`/tailor/dashboard/revenue/${d._id.date}`}
                  className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {!loading && dailyRevenue.length > 5 && (
          <div className="border-t p-4 text-center">
            <button
              type="button"
              onClick={() => setShowAllBreakdown((current) => !current)}
              className="rounded-md border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              {showAllBreakdown ? "Show first 5" : `View all ${dailyRevenue.length} days`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
