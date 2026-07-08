"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarClock, Mail, MapPin, Phone, Ruler, Scissors, UserRound } from "lucide-react";
import api from "@/lib/axios";

type Customer = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  notes?: string;
};

type MeasurementSet = {
  defaults?: Record<string, string>;
  custom?: Array<{ name: string; size: string }>;
};

type OrderItem = {
  _id: string;
  name?: string;
  category?: string;
  type?: string;
  quantity?: number;
  status?: string;
  trialDate?: string;
  deliveryDate?: string;
  specialInstructions?: string;
  measurements?: MeasurementSet;
  stitchOptions?: Record<string, string>;
};

type Order = {
  _id: string;
  orderNumber?: string;
  status?: string;
  createdAt?: string;
  notes?: string;
  customer?: Customer;
  items?: OrderItem[];
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Not scheduled";

const labelize = (value: string) =>
  value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());

export default function AppointmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    api.get(`/api/orders/${params.id}`)
      .then((response) => setOrder(response.data.order))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load appointment details."))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading appointment...</div>;
  if (error || !order) return <div className="p-8"><p className="text-sm text-red-700">{error || "Appointment not found."}</p><Link href="/tailor/dashboard" className="mt-4 inline-flex text-sm font-semibold text-emerald-700">Back to dashboard</Link></div>;

  const requestedItemId = searchParams?.get("item");
  const item = order.items?.find((entry) => entry._id === requestedItemId) || order.items?.[0];
  const customer = order.customer || {};
  const address = [customer.address, customer.city, customer.state, customer.postalCode].filter(Boolean).join(", ");
  const defaultMeasurements = Object.entries(item?.measurements?.defaults || {}).filter(([, value]) => value);
  const customMeasurements = item?.measurements?.custom || [];
  const stitchOptions = Object.entries(item?.stitchOptions || {}).filter(([, value]) => value);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link href="/tailor/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700">
        <ArrowLeft size={18} /> Back to appointments
      </Link>

      <header className="border-b border-gray-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Appointment details</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name || "Customer appointment"}</h1>
            <p className="mt-1 text-sm text-gray-500">Order {order.orderNumber || order._id}</p>
          </div>
          <span className="w-fit bg-violet-50 px-3 py-1.5 text-xs font-semibold capitalize text-violet-700">{item?.status || order.status || "Scheduled"}</span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900"><UserRound size={18} className="text-emerald-700" /> Customer details</h2>
          <div className="mt-4 space-y-4 text-sm">
            <Detail icon={<Phone size={16} />} label="Phone" value={customer.phone || "Not provided"} href={customer.phone ? `tel:${customer.phone}` : undefined} />
            <Detail icon={<Mail size={16} />} label="Email" value={customer.email || "Not provided"} href={customer.email ? `mailto:${customer.email}` : undefined} />
            <Detail icon={<MapPin size={16} />} label="Address" value={address || "Not provided"} />
          </div>
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">{customer.notes || "No customer notes added."}</p>
          </div>
        </section>

        <section className="border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900"><CalendarClock size={18} className="text-violet-700" /> Schedule and outfit</h2>
          <dl className="mt-4 divide-y divide-gray-100">
            <Row label="Outfit" value={item?.name || "Not specified"} />
            <Row label="Category" value={item?.category || "Not specified"} />
            <Row label="Service" value={item?.type || "Not specified"} capitalize />
            <Row label="Quantity" value={String(item?.quantity || 1)} />
            <Row label="Trial appointment" value={formatDate(item?.trialDate)} />
            <Row label="Delivery" value={formatDate(item?.deliveryDate)} />
          </dl>
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Special instructions</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">{item?.specialInstructions || order.notes || "No special instructions added."}</p>
          </div>
        </section>
      </div>

      <section className="border border-gray-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900"><Ruler size={18} className="text-emerald-700" /> Measurements</h2>
        {defaultMeasurements.length === 0 && customMeasurements.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No measurements recorded for this outfit.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {defaultMeasurements.map(([name, value]) => <Measurement key={name} name={labelize(name)} value={value} />)}
            {customMeasurements.map((measurement) => <Measurement key={`${measurement.name}-${measurement.size}`} name={measurement.name} value={measurement.size} />)}
          </div>
        )}
      </section>

      {stitchOptions.length > 0 && (
        <section className="border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900"><Scissors size={18} className="text-emerald-700" /> Stitching preferences</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stitchOptions.map(([name, value]) => <Measurement key={name} name={labelize(name)} value={String(value)} />)}
          </div>
        </section>
      )}
    </main>
  );
}

function Detail({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = <span className="font-semibold text-gray-900">{value}</span>;
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-gray-400">{icon}</span><div><p className="text-xs text-gray-500">{label}</p>{href ? <a href={href} className="hover:text-emerald-700 hover:underline">{content}</a> : content}</div></div>;
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-sm font-medium text-gray-500">{label}</dt><dd className={`text-sm font-semibold text-gray-900 ${capitalize ? "capitalize" : ""}`}>{value}</dd></div>;
}

function Measurement({ name, value }: { name: string; value: string }) {
  return <div className="border border-gray-100 bg-gray-50 p-3"><p className="text-xs text-gray-500">{name}</p><p className="mt-1 text-sm font-bold text-gray-900">{value}</p></div>;
}
