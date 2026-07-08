"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";

const MAX_ORDERS = 15;

export default function LegacyCalendar() {
  const [orders, setOrders] = useState<any[]>([]);
  const [dailyLimit, setDailyLimit] = useState<number>(MAX_ORDERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/orders/all"),
      api.get("/api/boutique/daily-limit"),
    ])
      .then(([ordersResponse, limitResponse]) => {
        setOrders(ordersResponse.data.orders || []);
        setDailyLimit(limitResponse.data?.dailyOrderLimit ?? MAX_ORDERS);
      })
      .catch(() => setError("Unable to load calendar data."))
      .finally(() => setLoading(false));
  }, []);

  function getDayColor(count: number) {
    if (count <= 5) return "#22c55e";
    if (count <= 9) return "#facc15";
    if (count <= 12) return "#fb923c";
    return "#ef4444";
  }

  function buildEvents(sourceOrders: any[]) {
    const map: Record<string, number> = {};

    sourceOrders.forEach((order) => {
      if (order.status === "delivered") return;

      order.items?.forEach((item: any) => {
        if (!item.deliveryDate) return;
        const date = item.deliveryDate.split("T")[0];
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
      <h1 className="text-3xl font-bold mb-4">Smart Calendar</h1>
      {loading && <p className="mb-4 text-gray-500">Loading calendar...</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <div className="bg-white rounded-xl shadow p-6">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
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
