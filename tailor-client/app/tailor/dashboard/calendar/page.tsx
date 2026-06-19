"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";

const MAX_ORDERS = 15;

export default function CalendarPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [dailyLimit, setDailyLimit] = useState<number>(MAX_ORDERS);

  useEffect(() => {
    api.get("/api/orders/all").then((res) => {
      setOrders(res.data.orders || []);
    });

    api.get("/api/boutique/daily-limit").then((res) => {
      setDailyLimit(res.data?.dailyOrderLimit ?? MAX_ORDERS);
    });
  }, []);

  function getDayColor(count: number) {
  if (count <= 5) return "#22c55e";   // green
  if (count <= 9) return "#facc15";   // yellow
  if (count <= 12) return "#fb923c";  // orange
  return "#ef4444";                   // red
}


function buildEvents(orders: any[]) {
  const map: Record<string, number> = {};

  orders.forEach((order) => {
    if (order.status === "delivered") return;

    order.items?.forEach((item: any) => {
      if (!item.deliveryDate) return;

      const date = item.deliveryDate.split("T")[0]; // YYYY-MM-DD
      map[date] = (map[date] || 0) + 1;
    });
  });

  return Object.entries(map).map(([date, count]) => ({
    title: `${count} orders`,
    start: date,
    allDay: true,
    backgroundColor: getDayColor(count),
    borderColor: getDayColor(count),
    textColor: "#ffffff",
  }));
}

const events = useMemo(() => buildEvents(orders), [orders]);


  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Smart Calendar – 2026</h1>

      <div className="bg-white rounded-xl shadow p-6">
<FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  initialDate="2026-01-01"
  headerToolbar={{
    left: "prev,next today",
    center: "title",
    right: "",
  }}
  events={events}
  height="auto"
/>
      </div>
    </div>
  );
}
