"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/lib/axios";

import {
  TrendingUp,
  ShoppingBag,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ----------------------------- Helpers ----------------------------- */

const STAT_COLORS: Record<
  string,
  {
    text: string;
    bg: string;
    border: string;
  }
> = {
  green: {
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
  },
  blue: {
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-300",
  },
  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
  },
  orange: {
    text: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-300",
  },
  purple: {
    text: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-300",
  },
  red: {
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-400",
  },
};


const getItemDates = (order: any) =>
  (order.items || [])
    .map((i: any) => i.deliveryDate)
    .filter(Boolean)
    .map((d: string) => new Date(d));

const hasPastDueItem = (order: any, today: Date) =>
  getItemDates(order).some((d: Date) => d < today);

const hasUpcomingItem = (order: any, today: Date) =>
  getItemDates(order).some((d: Date) => d > today);

/* ----------------------------- Component ----------------------------- */

export default function Dashboard() {
  const { user } = useAuth();
  const activeBoutique = user?.activeBoutique;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------- Fetch Orders ----------------------------- */

  useEffect(() => {
    if (!activeBoutique) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/orders/all", {
          params: { boutiqueId: activeBoutique },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeBoutique]);

  /* ----------------------------- Analytics ----------------------------- */

  const today = new Date();

  const totalOrders = orders.length;

const deliveredOrders = orders.filter(
  (o) =>
    o.status === "delivered" &&
    (o.balanceDue === 0 || o.balanceDue === undefined)
);

const totalRevenue = deliveredOrders.reduce(
  (sum, o) => sum + (o.totalAmount || 0),
  0
);

const totalDeliveries = deliveredOrders.length


  const totalCustomers = new Set(
    orders.map((o) => o.customer?._id).filter(Boolean)
  ).size;

  const upcomingOrders = orders.filter(
    (o) => o.status === "active" && hasUpcomingItem(o, today)
  ).length;

  const overdueOrders = orders.filter(
    (o) => o.status !== "delivered" && hasPastDueItem(o, today)
  ).length;

  /* ----------------------------- Stats Cards ----------------------------- */

  const stats = [
    { title: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "green" },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "yellow",
    },
    { title: "Total Customers", value: totalCustomers, icon: Users, color: "blue" },
    { title: "Upcoming Orders", value: upcomingOrders, icon: Clock, color: "purple" },
    {
      title: "Delivered Orders",
      value: totalDeliveries,
      icon: CheckCircle2,
      color: "orange"
    },
    {
      title: "Overdue Orders",
      value: overdueOrders,
      icon: AlertTriangle,
      color: "red"
    },
  ];

  /* ----------------------------- Weekly Chart ----------------------------- */

  const weeklyOrders = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days.map((day, index) => ({
      day,
      orders: orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getDay() === index;
      }).length,
    }));
  })();

  /* ----------------------------- Upcoming List ----------------------------- */

  const upcomingList = orders
    .filter((o) => hasUpcomingItem(o, today) && o.status === "active")
    .slice(0, 3);

  /* ----------------------------- UI ----------------------------- */

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

return (
  <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8 py-6 space-y-8">
    {/* Title */}
    <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700">
      Dashboard Analytics
    </h1>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => {
        const color = STAT_COLORS[stat.color || "green"];

        return (
          <div
            key={stat.title}
            className={`rounded-2xl p-4 shadow border-2 flex items-center gap-4
            ${color.bg} ${color.border}`}
          >
            <stat.icon
              className={`h-9 w-9 sm:h-10 sm:w-10 ${color.text}`}
            />

            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600">
                {stat.title}
              </p>
              <p className="text-lg sm:text-xl font-bold mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>

    {/* Chart + Upcoming */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow border">
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Orders This Week
        </h2>

        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={weeklyOrders}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line dataKey="orders" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow border">
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Upcoming Deliveries
        </h2>

        {upcomingList.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No upcoming deliveries
          </p>
        ) : (
          <ul className="space-y-3">
            {upcomingList.map((o) => (
              <li
                key={o._id}
                className="flex justify-between items-center text-sm"
              >
                <span className="truncate max-w-[65%]">
                  Order #{o.orderNumber}
                </span>
                <span className="text-gray-500 whitespace-nowrap">
                  {new Date(getItemDates(o)[0]).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {/* Overdue Alert */}
    {overdueOrders > 0 && (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-red-700 mb-1">
          Overdue Orders
        </h2>
        <p className="text-sm sm:text-base text-red-600">
          {overdueOrders} orders have crossed the delivery date.
        </p>
      </div>
    )}
  </div>
);
}
