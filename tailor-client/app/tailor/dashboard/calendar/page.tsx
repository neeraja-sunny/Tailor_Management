"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  PackageCheck,
  Scissors,
} from "lucide-react";
import api from "@/lib/axios";

const DEFAULT_DAILY_LIMIT = 15;

type ScheduleType = "all" | "delivery" | "trial" | "overdue";

type OrderItem = {
  _id: string;
  name?: string;
  deliveryDate?: string;
  trialDate?: string;
};

type CalendarOrder = {
  _id: string;
  orderNumber: string;
  status: string;
  customer?: { name?: string };
  items?: OrderItem[];
};

type ScheduleItem = {
  id: string;
  kind: "delivery" | "trial";
  orderId: string;
  orderNumber: string;
  customerName: string;
  itemName: string;
  date: Date;
  orderStatus: string;
};

type TimeSlot = {
  id: string;
  label: string;
  matches: (date: Date) => boolean;
};

const TIME_SLOTS: TimeSlot[] = [
  { id: "morning", label: "Before 12", matches: (date) => hasTime(date) && date.getHours() < 12 },
  { id: "early-afternoon", label: "12 - 3", matches: (date) => hasTime(date) && date.getHours() >= 12 && date.getHours() < 15 },
  { id: "late-afternoon", label: "3 - 6", matches: (date) => hasTime(date) && date.getHours() >= 15 && date.getHours() < 18 },
  { id: "evening", label: "After 6", matches: (date) => hasTime(date) && date.getHours() >= 18 },
  { id: "unscheduled", label: "No time", matches: (date) => !hasTime(date) },
];

function hasTime(date: Date) {
  return date.getHours() !== 0 || date.getMinutes() !== 0;
}

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const startOfWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  start.setHours(0, 0, 0, 0);
  return start;
};

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const sameDay = (left: Date, right: Date) => dateKey(left) === dateKey(right);

const isOverdue = (item: ScheduleItem, today: Date) =>
  item.kind === "delivery" && item.orderStatus !== "delivered" && item.date < today;

export default function CalendarPage() {
  const [orders, setOrders] = useState<CalendarOrder[]>([]);
  const [dailyLimit, setDailyLimit] = useState(DEFAULT_DAILY_LIMIT);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedType, setSelectedType] = useState<ScheduleType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get("/api/orders/all"),
      api.get("/api/boutique/daily-limit"),
    ])
      .then(([ordersResponse, limitResponse]) => {
        if (!active) return;
        setOrders(ordersResponse.data.orders || []);
        setDailyLimit(limitResponse.data?.dailyOrderLimit ?? DEFAULT_DAILY_LIMIT);
      })
      .catch(() => {
        if (active) setError("Unable to load calendar data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const schedule = useMemo<ScheduleItem[]>(
    () =>
      orders.flatMap((order) =>
        (order.items || []).flatMap((item) => {
          const base = {
            orderId: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customer?.name || "Customer",
            itemName: item.name || "Outfit",
            orderStatus: order.status,
          };
          const entries: ScheduleItem[] = [];

          if (item.deliveryDate) {
            entries.push({
              ...base,
              id: `${item._id}-delivery`,
              kind: "delivery",
              date: new Date(item.deliveryDate),
            });
          }
          if (item.trialDate) {
            entries.push({
              ...base,
              id: `${item._id}-trial`,
              kind: "trial",
              date: new Date(item.trialDate),
            });
          }

          return entries;
        })
      ),
    [orders]
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart]
  );
  const weekEnd = addDays(weekStart, 7);
  const weekSchedule = schedule.filter((item) => item.date >= weekStart && item.date < weekEnd);
  const weekDeliveries = weekSchedule.filter((item) => item.kind === "delivery");
  const weekTrials = weekSchedule.filter((item) => item.kind === "trial");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueCount = schedule.filter((item) => isOverdue(item, today)).length;
  const selectedDayItems = schedule
    .filter((item) => sameDay(item.date, selectedDate))
    .sort((left, right) => left.date.getTime() - right.date.getTime());
  const selectedDeliveries = selectedDayItems.filter((item) => item.kind === "delivery");
  const selectedTrials = selectedDayItems.filter((item) => item.kind === "trial");
  const selectedOverdue = selectedDayItems.filter((item) => isOverdue(item, today));
  const visibleItems = selectedDayItems.filter((item) => {
    if (selectedType === "delivery") return item.kind === "delivery";
    if (selectedType === "trial") return item.kind === "trial";
    if (selectedType === "overdue") return isOverdue(item, today);
    return true;
  });

  const selectSchedule = (day: Date, type: ScheduleType) => {
    setSelectedDate(day);
    setSelectedType(type);
  };

  const moveWeek = (amount: number) => {
    const nextStart = addDays(weekStart, amount * 7);
    setWeekStart(nextStart);
    selectSchedule(nextStart, "all");
  };

  const goToToday = () => {
    const now = new Date();
    setWeekStart(startOfWeek(now));
    selectSchedule(now, "all");
  };

  const rangeLabel = `${weekStart.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  })} - ${addDays(weekStart, 6).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">Deliveries, trials, and overdue work by time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={goToToday} className="h-10 border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Today
          </button>
          <button type="button" onClick={() => moveWeek(-1)} aria-label="Previous week" title="Previous week" className="grid h-10 w-10 place-items-center border border-gray-300 bg-white hover:bg-gray-50">
            <ChevronLeft size={18} />
          </button>
          <div className="flex h-10 min-w-48 items-center justify-center border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800">
            {rangeLabel}
          </div>
          <button type="button" onClick={() => moveWeek(1)} aria-label="Next week" title="Next week" className="grid h-10 w-10 place-items-center border border-gray-300 bg-white hover:bg-gray-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 border border-gray-200 bg-white lg:grid-cols-4">
        <Summary icon={<PackageCheck size={20} />} value={weekDeliveries.length} label="Deliveries" color="emerald" />
        <Summary icon={<Scissors size={20} />} value={weekTrials.length} label="Trials" color="violet" />
        <Summary icon={<Clock3 size={20} />} value={overdueCount} label="Overdue" color="red" />
        <Summary icon={<CalendarDays size={20} />} value={dailyLimit} label="Daily capacity" color="amber" />
      </section>

      {loading && <p className="text-sm text-gray-500">Loading calendar...</p>}
      {error && (
        <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="overflow-x-auto border border-gray-200 bg-white">
          <div className="grid min-w-[980px] grid-cols-[90px_repeat(7,minmax(120px,1fr))]">
            <div className="border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-500">Time</div>
            {weekDays.map((day) => (
              <button
                type="button"
                key={dateKey(day)}
                onClick={() => selectSchedule(day, "all")}
                className={`border-b border-r border-gray-200 p-3 text-center last:border-r-0 ${
                  sameDay(day, selectedDate) ? "bg-amber-50" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <span className="block text-xs font-semibold uppercase text-gray-500">
                  {day.toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
                <span className={`mt-1 inline-grid h-8 w-8 place-items-center text-sm font-bold ${sameDay(day, new Date()) ? "bg-amber-600 text-white" : "text-gray-900"}`}>
                  {day.getDate()}
                </span>
              </button>
            ))}

            {TIME_SLOTS.map((slot) => (
              <TimeRow
                key={slot.id}
                slot={slot}
                days={weekDays}
                schedule={schedule}
                selectedDate={selectedDate}
                selectedType={selectedType}
                today={today}
                onSelect={selectSchedule}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5 border-t border-gray-200 px-4 py-3 text-xs text-gray-600">
            <Legend icon={<PackageCheck size={16} />} label="Delivery" color="text-emerald-700" />
            <Legend icon={<Scissors size={16} />} label="Trial" color="text-violet-700" />
            <Legend icon={<Clock3 size={16} />} label="Overdue" color="text-red-600" />
          </div>
        </div>

        <aside className="border border-gray-200 bg-white p-4">
          <div className="border-b border-gray-200 pb-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Selected day</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">
              {selectedDate.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
            </h2>

            <div className="mt-3 grid grid-cols-4 gap-2">
              <FilterButton active={selectedType === "all"} count={selectedDayItems.length} label="All" icon={<CalendarDays size={17} />} onClick={() => setSelectedType("all")} />
              <FilterButton active={selectedType === "delivery"} count={selectedDeliveries.length} label="Deliveries" icon={<PackageCheck size={17} />} onClick={() => setSelectedType("delivery")} color="emerald" />
              <FilterButton active={selectedType === "trial"} count={selectedTrials.length} label="Trials" icon={<Scissors size={17} />} onClick={() => setSelectedType("trial")} color="violet" />
              <FilterButton active={selectedType === "overdue"} count={selectedOverdue.length} label="Overdue" icon={<Clock3 size={17} />} onClick={() => setSelectedType("overdue")} color="red" />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {visibleItems.map((item) => (
              <Link
                key={item.id}
                href={`/tailor/dashboard/orders/${item.orderId}`}
                className={`block border p-3 hover:bg-gray-50 ${item.kind === "delivery" ? "border-emerald-200" : "border-violet-200"}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 ${item.kind === "delivery" ? "text-emerald-700" : "text-violet-700"}`}>
                    {item.kind === "delivery" ? <PackageCheck size={18} /> : <Scissors size={18} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-semibold text-gray-900">{item.customerName}</p>
                      <span className="shrink-0 text-xs font-semibold text-gray-500">{formatTime(item.date)}</span>
                    </div>
                    <p className="truncate text-sm text-gray-500">{item.itemName} · {item.orderNumber}</p>
                  </div>
                </div>
              </Link>
            ))}

            {!loading && visibleItems.length === 0 && (
              <div className="py-10 text-center">
                <CalendarDays className="mx-auto text-gray-300" size={28} />
                <p className="mt-2 text-sm text-gray-500">Nothing scheduled here.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function TimeRow({ slot, days, schedule, selectedDate, selectedType, today, onSelect }: {
  slot: TimeSlot;
  days: Date[];
  schedule: ScheduleItem[];
  selectedDate: Date;
  selectedType: ScheduleType;
  today: Date;
  onSelect: (day: Date, type: ScheduleType) => void;
}) {
  return (
    <>
      <div className="flex min-h-20 items-center border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600 last:border-b-0">
        {slot.label}
      </div>
      {days.map((day) => {
        const items = schedule.filter((item) => sameDay(item.date, day) && slot.matches(item.date));
        const deliveries = items.filter((item) => item.kind === "delivery");
        const trials = items.filter((item) => item.kind === "trial");
        const overdue = deliveries.filter((item) => isOverdue(item, today));

        return (
          <div key={`${slot.id}-${dateKey(day)}`} className={`flex min-h-20 items-center justify-center gap-2 border-b border-r border-gray-200 p-2 last:border-r-0 ${sameDay(day, selectedDate) ? "bg-amber-50/40" : ""}`}>
            {deliveries.length > 0 && (
              <IconCount icon={<PackageCheck size={17} />} count={deliveries.length} label="Show deliveries" color="emerald" active={sameDay(day, selectedDate) && selectedType === "delivery"} onClick={() => onSelect(day, "delivery")} />
            )}
            {trials.length > 0 && (
              <IconCount icon={<Scissors size={17} />} count={trials.length} label="Show trials" color="violet" active={sameDay(day, selectedDate) && selectedType === "trial"} onClick={() => onSelect(day, "trial")} />
            )}
            {overdue.length > 0 && (
              <IconCount icon={<Clock3 size={17} />} count={overdue.length} label="Show overdue deliveries" color="red" active={sameDay(day, selectedDate) && selectedType === "overdue"} onClick={() => onSelect(day, "overdue")} />
            )}
            {items.length === 0 && <span className="text-gray-300">-</span>}
          </div>
        );
      })}
    </>
  );
}

function IconCount({ icon, count, label, color, active, onClick }: {
  icon: React.ReactNode;
  count: number;
  label: string;
  color: "emerald" | "violet" | "red";
  active: boolean;
  onClick: () => void;
}) {
  const colors = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-500",
    violet: "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-500",
    red: "border-red-200 bg-red-50 text-red-600 hover:border-red-500",
  };

  return (
    <button type="button" onClick={onClick} title={label} aria-label={`${label}: ${count}`} className={`flex h-9 min-w-10 items-center justify-center gap-1 border px-2 text-xs font-bold ${colors[color]} ${active ? "ring-2 ring-gray-900 ring-offset-1" : ""}`}>
      {icon}<span>{count}</span>
    </button>
  );
}

function FilterButton({ active, count, label, icon, onClick, color = "gray" }: {
  active: boolean;
  count: number;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: "gray" | "emerald" | "violet" | "red";
}) {
  const colors = { gray: "text-gray-600", emerald: "text-emerald-700", violet: "text-violet-700", red: "text-red-600" };
  return (
    <button type="button" onClick={onClick} title={label} aria-label={`${label}: ${count}`} className={`grid h-14 place-items-center border bg-white ${colors[color]} ${active ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-400"}`}>
      <span className="flex items-center gap-1">{icon}<b className="text-xs">{count}</b></span>
    </button>
  );
}

function Summary({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: "emerald" | "violet" | "red" | "amber" }) {
  const colors = { emerald: "bg-emerald-50 text-emerald-700", violet: "bg-violet-50 text-violet-700", red: "bg-red-50 text-red-600", amber: "bg-amber-50 text-amber-700" };
  return (
    <div className="flex items-center gap-3 border-b border-r border-gray-200 p-4 last:border-r-0 lg:border-b-0">
      <span className={`grid h-10 w-10 place-items-center ${colors[color]}`}>{icon}</span>
      <div><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-sm text-gray-500">{label}</p></div>
    </div>
  );
}

function Legend({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return <span className={`flex items-center gap-1.5 ${color}`}>{icon}<span className="text-gray-600">{label}</span></span>;
}

function formatTime(date: Date) {
  if (!hasTime(date)) return "Time not set";
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}
