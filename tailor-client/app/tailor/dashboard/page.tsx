"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Hourglass,
  MessageSquareText,
  PackageCheck,
  Plus,
  ArrowRight,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/lib/axios";

type ActivityTab = "enquiries" | "appointments";
type OrderTab = "due" | "all";
type DashboardPeriod = "day" | "week" | "month" | "year";

type Enquiry = {
  _id: string;
  name: string;
  phone?: string;
  note?: string;
  status: "new" | "contacted" | "converted";
  createdAt: string;
};

type OrderItem = {
  _id: string;
  name?: string;
  trialDate?: string;
  deliveryDate?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount?: number;
  advanceGiven?: number;
  balanceDue?: number;
  createdAt: string;
  customer?: { _id?: string; name?: string };
  items?: OrderItem[];
};

type Appointment = {
  id: string;
  orderId: string;
  itemId: string;
  customerName: string;
  outfitName: string;
  date: Date;
};

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activityTab, setActivityTab] = useState<ActivityTab>("enquiries");
  const [orderTab, setOrderTab] = useState<OrderTab>("due");
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", phone: "", note: "" });
  const [savingEnquiry, setSavingEnquiry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [anchorDate, setAnchorDate] = useState(() => startOfToday());

  useEffect(() => {
    if (!user) return;
    let active = true;

    Promise.all([
      api.get("/api/orders/all"),
      api.get("/api/customers"),
      api.get("/api/enquiries"),
    ])
      .then(([ordersResponse, customersResponse, enquiriesResponse]) => {
        if (!active) return;
        setOrders(ordersResponse.data.orders || []);
        setCustomers(customersResponse.data || []);
        setEnquiries(enquiriesResponse.data.enquiries || []);
      })
      .catch(() => {
        if (active) setError("Unable to load dashboard data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.activeBoutique, user?.boutique]);

  const today = startOfToday();
  const { start: periodStart, end: periodEnd, previousStart, previousEnd } = getPeriodRange(period, anchorDate);
  const inRange = (value: string | Date | undefined, start: Date, end: Date) => {
    if (!value) return false;
    const timestamp = new Date(value).getTime();
    return timestamp >= start.getTime() && timestamp < end.getTime();
  };
  const periodOrders = orders.filter((order) => inRange(order.createdAt, periodStart, periodEnd));
  const previousOrders = orders.filter((order) => inRange(order.createdAt, previousStart, previousEnd));
  const periodCustomers = customers.filter((customer) => inRange(customer.createdAt, periodStart, periodEnd));
  const previousCustomers = customers.filter((customer) => inRange(customer.createdAt, previousStart, previousEnd));
  const periodEnquiries = enquiries.filter((enquiry) => inRange(enquiry.createdAt, periodStart, periodEnd));
  const previousEnquiries = enquiries.filter((enquiry) => inRange(enquiry.createdAt, previousStart, previousEnd));

  const appointments = useMemo<Appointment[]>(
    () =>
      periodOrders
        .flatMap((order) =>
          (order.items || [])
            .filter((item) => item.trialDate && new Date(item.trialDate) >= today)
            .map((item) => ({
              id: `${order._id}-${item._id}`,
              orderId: order._id,
              itemId: item._id,
              customerName: order.customer?.name || "Customer",
              outfitName: item.name || "Outfit trial",
              date: new Date(item.trialDate as string),
            }))
        )
        .sort((left, right) => left.date.getTime() - right.date.getTime()),
    [orders, period, anchorDate]
  );

  const dueOrders = periodOrders.filter((order) =>
    order.status !== "delivered" &&
    order.status !== "cancelled" &&
    (order.items || []).some(
      (item) => item.deliveryDate && new Date(item.deliveryDate) < today
    )
  );
  const activeOrders = periodOrders.filter((order) => order.status !== "cancelled");
  const previousActiveOrders = previousOrders.filter((order) => order.status !== "cancelled");
  const outstanding = activeOrders.reduce((sum, order) => sum + (order.balanceDue || 0), 0);
  const deliveredOrders = activeOrders.filter((order) => order.status === "delivered").length;
  const pendingOrders = activeOrders.filter((order) => order.status !== "delivered").length;
  const totalRevenue = activeOrders.reduce(
    (sum, order) => sum + (order.advanceGiven || 0),
    0
  );
  const previousRevenue = previousActiveOrders.reduce((sum, order) => sum + (order.advanceGiven || 0), 0);

  const movePeriod = (amount: number) => {
    setAnchorDate((current) => {
      if (period === "day") return new Date(current.getFullYear(), current.getMonth(), current.getDate() + amount);
      if (period === "week") return new Date(current.getFullYear(), current.getMonth(), current.getDate() + amount * 7);
      if (period === "month") return new Date(current.getFullYear(), current.getMonth() + amount, 1);
      return new Date(current.getFullYear() + amount, 0, 1);
    });
  };

  const createEnquiry = async (event: FormEvent) => {
    event.preventDefault();
    setSavingEnquiry(true);
    try {
      const response = await api.post("/api/enquiries", enquiryForm);
      setEnquiries((current) => [response.data.enquiry, ...current]);
      setEnquiryForm({ name: "", phone: "", note: "" });
      setEnquiryOpen(false);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to save enquiry.");
    } finally {
      setSavingEnquiry(false);
    }
  };

  const markContacted = async (id: string) => {
    try {
      const response = await api.patch(`/api/enquiries/${id}/status`, { status: "contacted" });
      setEnquiries((current) =>
        current.map((enquiry) => (enquiry._id === id ? response.data.enquiry : enquiry))
      );
    } catch {
      setError("Unable to update enquiry.");
    }
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading dashboard...</div>;

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{periodLabel(period)} boutique overview and growth.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex border border-gray-300 bg-white p-1" aria-label="Dashboard period">
            {(["day", "week", "month", "year"] as DashboardPeriod[]).map((option) => (
              <button key={option} type="button" onClick={() => setPeriod(option)} className={`px-3 py-1.5 text-sm font-semibold ${period === option ? "bg-emerald-700 text-white" : "text-gray-600 hover:bg-emerald-50"}`}>{periodButtonLabel(option)}</button>
            ))}
          </div>
          <div className="flex h-10 items-center border border-gray-300 bg-white">
            <button type="button" onClick={() => movePeriod(-1)} className="grid h-full w-9 place-items-center text-gray-600 hover:bg-gray-50" aria-label={`Previous ${period}`}><ChevronLeft size={17} /></button>
            {period === "month" ? (
              <input type="month" value={`${anchorDate.getFullYear()}-${String(anchorDate.getMonth() + 1).padStart(2, "0")}`} onChange={(event) => { const [year, month] = event.target.value.split("-").map(Number); if (year && month) setAnchorDate(new Date(year, month - 1, 1)); }} className="h-full border-x border-gray-200 px-2 text-sm outline-none" aria-label="Select month" />
            ) : period === "year" ? (
              <input type="number" min="2000" max="2100" value={anchorDate.getFullYear()} onChange={(event) => { const year = Number(event.target.value); if (year >= 2000 && year <= 2100) setAnchorDate(new Date(year, 0, 1)); }} className="h-full w-24 border-x border-gray-200 px-2 text-center text-sm outline-none" aria-label="Select year" />
            ) : (
              <input type="date" value={toDateInputValue(anchorDate)} onChange={(event) => { if (event.target.value) setAnchorDate(fromDateInputValue(event.target.value)); }} className="h-full border-x border-gray-200 px-2 text-sm outline-none" aria-label={period === "week" ? "Select any date in week" : "Select date"} />
            )}
            <button type="button" onClick={() => movePeriod(1)} className="grid h-full w-9 place-items-center text-gray-600 hover:bg-gray-50" aria-label={`Next ${period}`}><ChevronRight size={17} /></button>
          </div>
          <button type="button" onClick={() => setAnchorDate(startOfToday())} className="h-10 border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">Today</button>
          <Link href="/tailor/dashboard/customers" className="flex h-10 items-center justify-center gap-2 bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">
            <Plus size={17} /> New Order
          </Link>
        </div>
      </header>

      {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="grid grid-cols-2 border border-gray-200 bg-white md:grid-cols-4 xl:grid-cols-7">
        <Summary href="/tailor/dashboard/orders?filter=all" icon={<ClipboardList size={20} />} value={activeOrders.length} label="Total Orders" tone="blue" />
        <Summary href="/tailor/dashboard/orders?filter=delivered" icon={<PackageCheck size={20} />} value={deliveredOrders} label="Delivered" tone="emerald" />
        <Summary href="/tailor/dashboard/orders?filter=pending" icon={<Hourglass size={20} />} value={pendingOrders} label="Pending" tone="amber" />
        <Summary href="/tailor/dashboard/orders?filter=past_due" icon={<CalendarClock size={20} />} value={dueOrders.length} label="Due Orders" tone="red" />
        <Summary href="/tailor/dashboard/revenue" icon={<CircleDollarSign size={20} />} value={`₹${totalRevenue.toLocaleString("en-IN")}`} label="Total Revenue" tone="emerald" />
        <Summary href="/tailor/dashboard/orders?filter=payment_due" icon={<CircleDollarSign size={20} />} value={`₹${outstanding.toLocaleString("en-IN")}`} label="Payment Due" tone="red" />
        <Summary href="/tailor/dashboard/customers" icon={<Users size={20} />} value={periodCustomers.length} label="New Customers" tone="violet" />
      </section>

      <section className="border border-gray-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900">Growth overview</h2>
            <p className="mt-1 text-xs text-gray-500">Compared with the previous {period}.</p>
          </div>
          <span className="text-xs font-medium text-gray-500">{formatRange(periodStart, periodEnd)}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <GrowthCard label="Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} change={percentageChange(totalRevenue, previousRevenue)} />
          <GrowthCard label="Orders" value={activeOrders.length} change={percentageChange(activeOrders.length, previousActiveOrders.length)} />
          <GrowthCard label="New customers" value={periodCustomers.length} change={percentageChange(periodCustomers.length, previousCustomers.length)} />
          <GrowthCard label="Enquiries" value={periodEnquiries.length} change={percentageChange(periodEnquiries.length, previousEnquiries.length)} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_290px]">
        <section className="border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 pt-4">
            <div className="flex gap-5">
              <Tab active={activityTab === "enquiries"} onClick={() => setActivityTab("enquiries")} icon={<MessageSquareText size={17} />} label="Enquiries" count={periodEnquiries.length} />
              <Tab active={activityTab === "appointments"} onClick={() => setActivityTab("appointments")} icon={<CalendarClock size={17} />} label="Appointments" count={appointments.length} />
            </div>
            {activityTab === "enquiries" && (
              <button type="button" onClick={() => setEnquiryOpen(true)} aria-label="Add enquiry" title="Add enquiry" className="mb-3 grid h-9 w-9 place-items-center border border-gray-300 text-gray-700 hover:bg-gray-50"><Plus size={17} /></button>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {activityTab === "enquiries" && periodEnquiries.slice(0, 6).map((enquiry) => (
              <div key={enquiry._id} className="flex min-h-20 items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Link href={`/tailor/dashboard/enquiries/${enquiry._id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center bg-emerald-50 text-sm font-bold text-emerald-700">{enquiry.name.slice(0, 1).toUpperCase()}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-900">{enquiry.name}</span>
                    <span className="block truncate text-xs text-gray-500">{enquiry.note || enquiry.phone || "No note"}</span>
                  </span>
                </Link>
                {enquiry.status === "new" ? (
                  <button type="button" onClick={() => markContacted(enquiry._id)} title="Mark contacted" aria-label={`Mark ${enquiry.name} contacted`} className="grid h-9 w-9 place-items-center border border-gray-200 text-gray-500 hover:border-emerald-400 hover:text-emerald-700"><Check size={16} /></button>
                ) : (
                  <span className="text-xs font-semibold capitalize text-gray-500">{enquiry.status}</span>
                )}
              </div>
            ))}

            {activityTab === "appointments" && appointments.slice(0, 6).map((appointment) => (
              <Link key={appointment.id} href={`/tailor/dashboard/appointments/${appointment.orderId}?item=${appointment.itemId}`} className="flex min-h-20 w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50">
                <span className="grid h-9 w-9 shrink-0 place-items-center bg-violet-50 text-violet-700"><CalendarClock size={17} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{appointment.outfitName}</p>
                  <p className="truncate text-xs text-gray-500">{appointment.customerName}</p>
                </div>
                <span className="shrink-0 text-right text-xs font-semibold text-violet-700">{formatScheduleDate(appointment.date)}</span>
              </Link>
            ))}

            {((activityTab === "enquiries" && periodEnquiries.length === 0) || (activityTab === "appointments" && appointments.length === 0)) && (
              <EmptyState text={activityTab === "enquiries" ? "No enquiries yet." : "No upcoming appointments."} />
            )}
          </div>
        </section>

        <section className="border border-gray-200 bg-white">
          <div className="flex gap-5 border-b border-gray-200 px-4 pt-4">
            <Tab active={orderTab === "due"} onClick={() => setOrderTab("due")} icon={<CalendarClock size={17} />} label="Due Orders" count={dueOrders.length} />
            <Tab active={orderTab === "all"} onClick={() => setOrderTab("all")} icon={<ClipboardList size={17} />} label="Total Orders" count={activeOrders.length} />
          </div>

          <div className="divide-y divide-gray-100">
            {(orderTab === "due" ? dueOrders : activeOrders).slice(0, 6).map((order) => {
              const deliveryDate = getNearestDelivery(order);
              return (
                <Link key={order._id} href={`/tailor/dashboard/orders/${order._id}`} className="grid min-h-20 grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{order.customer?.name || "Customer"}</p>
                    <p className="truncate text-xs text-gray-500">{order.orderNumber} · {(order.items || []).map((item) => item.name).filter(Boolean).join(", ") || "Order"}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${orderTab === "due" ? "text-red-600" : "text-gray-600"}`}>{deliveryDate ? deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "No date"}</p>
                    <p className="mt-1 text-xs text-gray-500">₹{(order.balanceDue || 0).toLocaleString("en-IN")} due</p>
                  </div>
                </Link>
              );
            })}

            {(orderTab === "due" ? dueOrders : activeOrders).length === 0 && (
              <EmptyState text={orderTab === "due" ? "No overdue orders." : "No orders yet."} />
            )}
          </div>

          <Link href="/tailor/dashboard/orders" className="block border-t border-gray-200 px-4 py-3 text-center text-sm font-semibold text-emerald-700 hover:bg-gray-50">View all orders</Link>
        </section>

        <MiniCalendar orders={periodOrders} />
      </div>

      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={createEnquiry} className="w-full max-w-md bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add Enquiry</h2>
              <button type="button" onClick={() => setEnquiryOpen(false)} aria-label="Close enquiry form" title="Close"><X size={20} /></button>
            </div>
            <label className="mt-5 block text-sm font-medium text-gray-700">Customer name<input required value={enquiryForm.name} onChange={(event) => setEnquiryForm({ ...enquiryForm, name: event.target.value })} className="mt-1.5 h-11 w-full border border-gray-300 px-3 outline-none focus:border-emerald-600" /></label>
            <label className="mt-4 block text-sm font-medium text-gray-700">Phone<input type="tel" value={enquiryForm.phone} onChange={(event) => setEnquiryForm({ ...enquiryForm, phone: event.target.value })} className="mt-1.5 h-11 w-full border border-gray-300 px-3 outline-none focus:border-emerald-600" /></label>
            <label className="mt-4 block text-sm font-medium text-gray-700">Note<textarea rows={3} value={enquiryForm.note} onChange={(event) => setEnquiryForm({ ...enquiryForm, note: event.target.value })} className="mt-1.5 w-full resize-none border border-gray-300 p-3 outline-none focus:border-emerald-600" /></label>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEnquiryOpen(false)} className="border border-gray-300 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button disabled={savingEnquiry} className="bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">{savingEnquiry ? "Saving..." : "Add Enquiry"}</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

function Tab({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number }) {
  return <button type="button" onClick={onClick} className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold ${active ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>{icon}{label}<span className="text-xs">{count}</span></button>;
}

function Summary({ href, icon, value, label, tone }: { href: string; icon: React.ReactNode; value: string | number; label: string; tone: "emerald" | "red" | "blue" | "violet" | "amber" }) {
  const colors = { emerald: "bg-emerald-50 text-emerald-700", red: "bg-red-50 text-red-700", blue: "bg-blue-50 text-blue-700", violet: "bg-violet-50 text-violet-700", amber: "bg-amber-50 text-amber-700" };
  return <Link href={href} className="flex min-h-24 items-center gap-3 border-b border-r border-gray-200 p-4 hover:bg-gray-50 xl:border-b-0"><span className={`grid h-10 w-10 shrink-0 place-items-center ${colors[tone]}`}>{icon}</span><div className="min-w-0"><p className="truncate text-lg font-bold text-gray-900">{value}</p><p className="text-xs font-medium text-gray-500">{label}</p></div></Link>;
}

function GrowthCard({ label, value, change }: { label: string; value: string | number; change: number }) {
  const positive = change >= 0;
  return (
    <div className="border border-gray-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <strong className="text-xl text-gray-900">{value}</strong>
        <span className={`text-xs font-bold ${positive ? "text-emerald-700" : "text-red-600"}`}>
          {positive ? "+" : ""}{change}%
        </span>
      </div>
    </div>
  );
}

function getPeriodRange(period: DashboardPeriod, anchor: Date) {
  const now = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
  let start: Date;
  let end: Date;
  let previousStart: Date;

  if (period === "day") {
    start = now;
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    previousStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  } else if (period === "week") {
    const mondayOffset = (now.getDay() + 6) % 7;
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
    end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
    previousStart = new Date(start.getFullYear(), start.getMonth(), start.getDate() - 7);
  } else if (period === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  } else {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear() + 1, 0, 1);
    previousStart = new Date(now.getFullYear() - 1, 0, 1);
  }

  return {
    start,
    end,
    previousStart,
    previousEnd: start,
  };
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

function periodLabel(period: DashboardPeriod) {
  return period === "day" ? "Selected day's" : period === "week" ? "Selected week's" : period === "month" ? "Selected month's" : "Selected year's";
}

function periodButtonLabel(period: DashboardPeriod) {
  return period === "day" ? "Daily" : period === "week" ? "Weekly" : period === "month" ? "Monthly" : "Yearly";
}

function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function fromDateInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatRange(start: Date, end: Date) {
  const inclusiveEnd = new Date(end);
  inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
  if (isSameDay(start, inclusiveEnd)) {
    return start.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  return `${start.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} – ${inclusiveEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
}

function MiniCalendar({ orders }: { orders: Order[] }) {
  const initialDate = startOfToday();
  const [month, setMonth] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const entries = useMemo(
    () =>
      orders.flatMap((order) =>
        (order.items || []).flatMap((item) => {
          const base = {
            orderId: order._id,
            customerName: order.customer?.name || "Customer",
            outfitName: item.name || "Outfit",
          };
          const result: Array<typeof base & { id: string; kind: "delivery" | "trial"; date: Date }> = [];
          if (item.deliveryDate) result.push({ ...base, id: `${item._id}-delivery`, kind: "delivery", date: new Date(item.deliveryDate) });
          if (item.trialDate) result.push({ ...base, id: `${item._id}-trial`, kind: "trial", date: new Date(item.trialDate) });
          return result;
        })
      ),
    [orders]
  );

  const firstWeekday = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)
    ),
  ];
  while (cells.length < 42) cells.push(null);

  const selectedEntries = entries
    .filter((entry) => isSameDay(entry.date, selectedDate))
    .sort((left, right) => left.date.getTime() - right.date.getTime());

  const moveMonth = (amount: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + amount, 1);
    setMonth(next);
    setSelectedDate(next);
  };

  return (
    <section className="border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={17} className="text-emerald-700" />
          <h2 className="text-sm font-bold text-gray-900">
            {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </h2>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" title="Previous month" className="grid h-8 w-8 place-items-center border border-gray-200 hover:bg-gray-50"><ChevronLeft size={16} /></button>
          <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" title="Next month" className="grid h-8 w-8 place-items-center border border-gray-200 hover:bg-gray-50"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-gray-400">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day} className="py-2">{day.slice(0, 1)}</span>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, index) => {
            if (!day) return <span key={`empty-${index}`} className="h-9" />;
            const dayEntries = entries.filter((entry) => isSameDay(entry.date, day));
            const hasDelivery = dayEntries.some((entry) => entry.kind === "delivery");
            const hasTrial = dayEntries.some((entry) => entry.kind === "trial");
            return (
              <button
                type="button"
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`relative grid h-9 place-items-center text-xs font-medium ${
                  isSameDay(day, selectedDate) ? "bg-emerald-700 text-white" : isSameDay(day, initialDate) ? "bg-emerald-50 text-emerald-800" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {day.getDate()}
                {(hasDelivery || hasTrial) && (
                  <span className="absolute bottom-1 flex gap-0.5">
                    {hasDelivery && <i className={`h-1 w-1 ${isSameDay(day, selectedDate) ? "bg-white" : "bg-emerald-500"}`} />}
                    {hasTrial && <i className={`h-1 w-1 ${isSameDay(day, selectedDate) ? "bg-white" : "bg-violet-500"}`} />}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <p className="mb-3 text-xs font-semibold text-gray-500">
          {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </p>
        <div className="space-y-2">
          {selectedEntries.slice(0, 3).map((entry) => (
            <Link key={entry.id} href={`/tailor/dashboard/orders/${entry.orderId}`} className="flex items-center gap-2 py-1.5 hover:bg-gray-50">
              <span className={entry.kind === "delivery" ? "text-emerald-700" : "text-violet-700"}>
                {entry.kind === "delivery" ? <PackageCheck size={15} /> : <CalendarClock size={15} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-gray-800">{entry.outfitName}</span>
                <span className="block truncate text-[11px] text-gray-500">{entry.customerName}</span>
              </span>
            </Link>
          ))}
          {selectedEntries.length === 0 && <p className="py-4 text-center text-xs text-gray-400">No schedule</p>}
          {selectedEntries.length > 3 && <p className="text-center text-xs font-semibold text-gray-500">+{selectedEntries.length - 3} more</p>}
        </div>
      </div>

      <Link href="/tailor/dashboard/calendar" className="flex items-center justify-center gap-2 border-t border-gray-200 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-gray-50">
        View full calendar <ArrowRight size={16} />
      </Link>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="grid min-h-48 place-items-center p-6 text-sm text-gray-400">{text}</div>;
}

function getNearestDelivery(order: Order) {
  const dates = (order.items || []).map((item) => item.deliveryDate ? new Date(item.deliveryDate) : null).filter((date): date is Date => Boolean(date)).sort((left, right) => left.getTime() - right.getTime());
  return dates[0] || null;
}

function formatScheduleDate(date: Date) {
  const day = isSameDay(date, new Date()) ? "Today" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  return hasTime ? `${day}, ${date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}` : day;
}
