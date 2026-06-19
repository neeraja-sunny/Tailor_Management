"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, User, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export default function CustomerDetailsPage() {
    
  const params = useParams();
  const customerId = params?.id as string | undefined;

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/api/customers/${customerId}`);
      setCustomer(res.data);
    } catch (err) {
      console.error("Failed to fetch customer details", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async () => {
  try {
    const res = await api.get(`/api/customers/${customerId}/orders`);
    setOrders(res.data.orders || []);
  } catch (err) {
    console.error("Failed to fetch customer orders", err);
  }
};

  useEffect(() => {
    fetchCustomer();
    fetchCustomerOrders();
  }, [customerId]);


  if (loading) return <p className="p-6">Loading customer details…</p>;

  if (!customer)
    return <p className="p-6 text-red-500">Customer not found.</p>;

const isUpcomingOrder = (order: any) =>
  order.status === "active" 

const isDeliveredOrder = (order: any) =>
  order.status === "delivered";


  return (
    <div className="p-6">

      <Link href="/tailor/dashboard/customers" className="text-gray-600 flex items-center gap-1 mb-4">
        <ChevronLeft size={20} />
        Back to Customers
      </Link>

      <h1 className="text-2xl font-bold mb-2">Customer Profile</h1>
      <p className="text-gray-800 text-lg mb-8">View customer information and order history</p>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <User size={32} className="text-emerald-600" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{customer.name}</h2>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Contact Information</h3>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <p className="text-gray-900 font-medium">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <p className="text-gray-900 font-medium break-all">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gender</p>
                  <p className="text-gray-900 font-medium">{customer.gender}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Address</h3>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-gray-900 font-medium">{customer.address}</p>
                  <p className="text-gray-700">{customer.city}, {customer.state}</p>
                  <p className="text-gray-600">{customer.postalCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      

      <h2 className="text-xl font-semibold mt-8 mb-3">Upcoming Orders</h2>

        {orders.filter(isUpcomingOrder).length === 0 && (
         <p className="text-gray-500">No upcoming orders.</p>
        )}

<div className="space-y-3">
  {orders.filter(isUpcomingOrder).map((order) => (
    <div key={order._id} className="border p-4 rounded-lg bg-white">
      <p className="font-medium">Order Number {order.orderNumber}</p>
      <p className="text-sm text-gray-600">
         • Active 
      </p>
      <p className="text-sm text-gray-600">
        Total: ₹{order.totalAmount}
      </p>

      <Link
        href={`/tailor/dashboard/orders/${order._id}`}
        className="text-emerald-600 text-sm font-medium"
      >
        View Order →
      </Link>
    </div>
  ))}
</div>

<h2 className="text-xl font-semibold mt-10 mb-3">Previous Orders</h2>

{orders.filter(isDeliveredOrder).length === 0 && (
  <p className="text-gray-500">No completed orders.</p>
)}

<div className="space-y-3">
  {orders.filter(isDeliveredOrder).map((order) => (
    <div key={order._id} className="border p-4 rounded-lg bg-gray-50">
      <p className="font-medium">Order Number {order.orderNumber}</p>
      <p className="text-sm text-gray-600">
        Delivered • ₹{order.totalAmount}
      </p>

      <Link
        href={`/tailor/dashboard/orders/${order._id}`}
        className="text-emerald-600 text-sm font-medium"
      >
        View Order →
      </Link>
    </div>
  ))}
</div>

    </div>
  );
}
