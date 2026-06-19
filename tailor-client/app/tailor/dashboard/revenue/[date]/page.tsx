"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type BreakdownOrder = {
  orderNumber: string;
  totalAmount: number;
  outfits: number;
  date: string;
};

export default function RevenueBreakdownPage() {
  const params = useParams();
  const date = params?.date as string;

  const [orders, setOrders] = useState<BreakdownOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBreakdown();
  }, [date]);

  const fetchBreakdown = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/revenue/breakdown/${date}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Breakdown fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const total = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* Back */}
      <Link
        href="/tailor/dashboard/revenue"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={18} />
        Back to Revenue
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Revenue Breakdown on {date ? new Date(date).toDateString() : "Loading..."}
        </h1>
      </div>

      {/* Summary Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-700 font-semibold mb-1">
            Total Revenue
          </p>
          <p className="text-3xl font-bold text-emerald-800">
            ₹{total.toLocaleString()}
          </p>
        </div>
        <p className="text-sm text-gray-600">
          {orders.length} order{orders.length !== 1 && "s"}
        </p>
      </div>

      {/* Table Card */}
                
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading revenue details...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No delivered orders found for this date
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-md">
                <tr>
                  <th className="px-5 py-3 text-left">
                    Order No.
                  </th>
                  <th className="px-5 py-3 text-center">
                    Outfits
                  </th>
                  <th className="px-5 py-3 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="text-lg font-semibold">
                {orders.map((o) => (
                  <tr
                    key={o.orderNumber}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {o.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {o.outfits}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">
                      ₹{o.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
