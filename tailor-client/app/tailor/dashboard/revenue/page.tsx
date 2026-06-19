"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { IndianRupee, ArrowRight } from "lucide-react";
import Link from "next/link";

type DailyRevenue = {
  _id: { date: string };
  total: number;
};

export default function RevenuePage() {
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/revenue/daily");
      setDailyRevenue(res.data || []);
    } catch (err) {
      console.error("Revenue fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = dailyRevenue.reduce(
    (sum, d) => sum + d.total,
    0
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-700">
          Revenue Overview
        </h1>
        <p className="text-gray-600 mt-2 font-semibold">
          Track your earnings and daily revenue performance
        </p>
      </div>

      {/* TOTAL REVENUE CARD */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl p-6 text-white shadow">
        <p className="opacity-90 mb-1 font-semibold text-md">Total Revenue</p>
        <div className="flex items-center gap-2">
          <IndianRupee className="w-7 h-7" />
          <span className="text-3xl font-bold">
            {totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* DAILY REVENUE */}
      <div className="bg-white rounded-2xl shadow border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Daily Revenue Breakdown
          </h2>
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
          {dailyRevenue.map((d) => (
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
                  ₹{d.total.toLocaleString()}
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
      </div>
    </div>
  );
}
