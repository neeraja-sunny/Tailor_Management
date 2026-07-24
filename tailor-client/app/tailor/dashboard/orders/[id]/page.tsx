"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Download, Mail, PackageCheck, Printer, Share2, UsersRound } from "lucide-react";
import api from "@/lib/axios";

type AdditionalCharge = {
  reason: string;
  amount: number;
};

type OrderItem = {
  _id: string;
  name?: string;
  category?: string;
  type?: string;
  quantity?: number;
  stitchingPrice?: number;
  additionalPrice?: number;
  trialDate?: string;
  deliveryDate?: string;
  workAssignments?: WorkAssignment[];
};

type StaffOption = {
  _id: string;
  email: string;
  fullName?: string;
  staffSkills: string[];
  weeklyAssigned: number;
  weeklyOrderLimit: number;
  monthlyAssigned: number;
  monthlyOrderLimit: number;
};

type WorkAssignment = {
  workType: string;
  staff: StaffOption;
  assignedAt?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  createdAt?: string;
  status?: string;
  deliveredAt?: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  items?: OrderItem[];
  additionalCharges?: AdditionalCharge[];
  totalAmount?: number;
  advanceGiven?: number;
  balanceDue?: number;
  discountType?: "fixed" | "percentage";
  discountValue?: number;
  discountAmount?: number;
};

const money = (amount = 0) => `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (value?: string) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function OrderDetails() {
  const params = useParams<{ id: string }>();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [extraReason, setExtraReason] = useState("");
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
  const [discountValue, setDiscountValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState<"email" | "share" | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [staffList, setStaffList] = useState<StaffOption[]>([]);
  const [assigningKey, setAssigningKey] = useState("");
  const [customWork, setCustomWork] = useState<Record<string, string>>({});

  const fetchOrder = async () => {
    if (!params?.id) return;
    try {
      const response = await api.get(`/api/orders/${params.id}`);
      setOrder(response.data.order);
      setDiscountType(response.data.order.discountType || "fixed");
      setDiscountValue(response.data.order.discountValue ? String(response.data.order.discountValue) : "");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to load invoice.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    api.get("/api/staff/get").then((response) => setStaffList(response.data.staff || [])).catch(() => setStaffList([]));
  }, [params?.id]);

  const assignWork = async (itemId: string, workType: string, staffId: string) => {
    const key = `${itemId}-${workType}`;
    try {
      setAssigningKey(key);
      setActionError("");
      await api.patch(`/api/orders/item/${itemId}/assign-work`, { workType, staffId });
      setActionMessage(staffId ? `${workType} work assigned.` : `${workType} assignment removed.`);
      await Promise.all([fetchOrder(), api.get("/api/staff/get").then((response) => setStaffList(response.data.staff || []))]);
    } catch (requestError: any) {
      setActionError(requestError.response?.data?.message || "Unable to assign work.");
    } finally { setAssigningKey(""); }
  };

  const autoAssignItem = async (item: OrderItem) => {
    const workTypes = ["cutting", "stitching", "embroidery", "finishing"];
    const alreadyAssigned = new Set((item.workAssignments || []).map((entry) => entry.workType));
    const localLoad = new Map(staffList.map((staff) => [staff._id, { week: staff.weeklyAssigned, month: staff.monthlyAssigned }]));
    try {
      setAssigningKey(`${item._id}-auto`);
      setActionError("");
      for (const workType of workTypes.filter((type) => !alreadyAssigned.has(type))) {
        const eligible = staffList
          .filter((staff) => staff.staffSkills.length === 0 || staff.staffSkills.includes(workType))
          .sort((a, b) => {
            const aLoad = localLoad.get(a._id)!;
            const bLoad = localLoad.get(b._id)!;
            const aOver = aLoad.week >= a.weeklyOrderLimit || aLoad.month >= a.monthlyOrderLimit;
            const bOver = bLoad.week >= b.weeklyOrderLimit || bLoad.month >= b.monthlyOrderLimit;
            if (aOver !== bOver) return aOver ? 1 : -1;
            return (aLoad.week / a.weeklyOrderLimit) - (bLoad.week / b.weeklyOrderLimit);
          });
        const selected = eligible[0];
        if (!selected) continue;
        await api.patch(`/api/orders/item/${item._id}/assign-work`, { workType, staffId: selected._id });
        const load = localLoad.get(selected._id)!;
        localLoad.set(selected._id, { week: load.week + 1, month: load.month + 1 });
      }
      setActionMessage("Unassigned work distributed by staff workload.");
      await Promise.all([fetchOrder(), api.get("/api/staff/get").then((response) => setStaffList(response.data.staff || []))]);
    } catch (requestError: any) {
      setActionError(requestError.response?.data?.message || "Unable to auto-assign work.");
    } finally { setAssigningKey(""); }
  };

  const handleReceivePayment = async () => {
    if (!order || !amountReceived || Number(amountReceived) <= 0) return;
    setSaving(true);
    try {
      await api.patch(`/api/orders/${order._id}/receive-payment`, { amount: Number(amountReceived) });
      setAmountReceived("");
      await fetchOrder();
    } finally {
      setSaving(false);
    }
  };

  const handleAddExtraCharge = async () => {
    if (!order || !extraReason.trim() || !extraAmount || Number(extraAmount) <= 0) return;
    setSaving(true);
    try {
      await api.patch(`/api/orders/${order._id}/add-extra-charge`, {
        amount: Number(extraAmount),
        reason: extraReason.trim(),
      });
      setExtraAmount("");
      setExtraReason("");
      await fetchOrder();
    } finally {
      setSaving(false);
    }
  };

  const handleApplyOffer = async (remove = false) => {
    if (!order) return;
    const value = remove ? 0 : Number(discountValue);
    if (!Number.isFinite(value) || value < 0 || (discountType === "percentage" && value > 100)) {
      setActionError(discountType === "percentage" ? "Enter a percentage from 0 to 100." : "Enter a valid offer amount.");
      return;
    }
    setSaving(true);
    setActionError("");
    try {
      await api.patch(`/api/orders/${order._id}/discount`, { type: discountType, value });
      if (remove) setDiscountValue("");
      await fetchOrder();
    } catch (requestError: any) {
      setActionError(requestError.response?.data?.message || "Unable to apply offer.");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!order) return;
    setSaving(true);
    setActionError("");
    try {
      await api.patch(`/api/orders/${order._id}/status`, { status: "delivered" });
      await fetchOrder();
    } catch (requestError: any) {
      setActionError(requestError.response?.data?.message || "Unable to mark this order delivered.");
    } finally {
      setSaving(false);
    }
  };

  const createInvoiceBlob = async () => {
    if (!order) return null;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    let pdfFont = "helvetica";
    try {
      const fontResponse = await fetch("/fonts/Poppins-Medium.ttf");
      const fontBytes = new Uint8Array(await fontResponse.arrayBuffer());
      let fontBinary = "";
      const chunkSize = 0x8000;
      for (let offset = 0; offset < fontBytes.length; offset += chunkSize) {
        fontBinary += String.fromCharCode(...fontBytes.subarray(offset, offset + chunkSize));
      }
      doc.addFileToVFS("Poppins-Medium.ttf", btoa(fontBinary));
      doc.addFont("Poppins-Medium.ttf", "Poppins", "normal");
      doc.addFont("Poppins-Medium.ttf", "Poppins", "bold");
      pdfFont = "Poppins";
    } catch {
      // Helvetica keeps PDF generation working if the web font cannot load.
    }
    const left = 16;
    const right = 194;
    const pdfMoney = (amount = 0) => `${pdfFont === "Poppins" ? "₹" : "Rs. "}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const textRight = (value: string, y: number) => doc.text(value, right, y, { align: "right" });

    doc.setTextColor(6, 95, 70);
    doc.setFont(pdfFont, "bold");
    doc.setFontSize(18);
    doc.text("TailorPro", left, 25);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(22);
    textRight("INVOICE", 24);
    doc.setFontSize(10);
    textRight(`#${order.orderNumber}`, 31);
    doc.setFont(pdfFont, "normal");
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text("Tailoring and boutique services", left, 31);
    textRight(`Issued ${date(new Date().toISOString())}`, 38);
    doc.setDrawColor(4, 120, 87);
    doc.setLineWidth(0.6);
    doc.line(left, 47, right, 47);

    doc.setFont(pdfFont, "bold");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("BILL TO", left, 58);
    doc.text("PAYMENT STATUS", 155, 58);
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(12);
    doc.text(order.customer?.name || "Customer", left, 66);
    const paymentLabel = Number(order.balanceDue || 0) === 0 ? "PAID" : "PAYMENT DUE";
    doc.setFillColor(Number(order.balanceDue || 0) === 0 ? 236 : 255, Number(order.balanceDue || 0) === 0 ? 253 : 251, Number(order.balanceDue || 0) === 0 ? 245 : 235);
    doc.rect(163, 61, 31, 8, "F");
    doc.setTextColor(Number(order.balanceDue || 0) === 0 ? 4 : 180, Number(order.balanceDue || 0) === 0 ? 120 : 83, Number(order.balanceDue || 0) === 0 ? 87 : 9);
    doc.setFontSize(8);
    doc.text(paymentLabel, 192, 66.5, { align: "right" });
    doc.setFont(pdfFont, "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    const customerLines = [order.customer?.phone, order.customer?.email, customerAddress].filter(Boolean) as string[];
    customerLines.forEach((line, index) => doc.text(doc.splitTextToSize(line, 105), left, 72 + index * 6));

    let y = 105;
    const drawTableHeader = () => {
      doc.setFont(pdfFont, "bold");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text("ITEM", left + 2, y);
      doc.text("QTY", 130, y, { align: "center" });
      doc.text("RATE", 162, y, { align: "right" });
      doc.text("AMOUNT", right - 2, y, { align: "right" });
      doc.setDrawColor(209, 213, 219);
      doc.line(left, y + 3, right, y + 3);
      y += 10;
    };
    drawTableHeader();

    (order.items || []).forEach((item) => {
      if (y > 263) {
        doc.addPage();
        y = 20;
        drawTableHeader();
      }
      const rate = (item.stitchingPrice || 0) + (item.additionalPrice || 0);
      const quantity = item.quantity || 1;
      const deliveryText = order.status === "delivered"
        ? `Delivered: ${date(order.deliveredAt || item.deliveryDate)}`
        : `Expected delivery: ${date(item.deliveryDate)}`;
      doc.setFont(pdfFont, "bold");
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(item.name || "Tailoring service", left + 2, y);
      doc.setFont(pdfFont, "normal");
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.text([item.type, item.category].filter(Boolean).join(" - ") || "Custom tailoring", left + 2, y + 5);
      doc.setFontSize(8);
      doc.text(`Trial date: ${date(item.trialDate)}  ·  ${deliveryText}`, left + 2, y + 10);
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      doc.text(String(quantity), 130, y, { align: "center" });
      doc.text(pdfMoney(rate), 162, y, { align: "right" });
      doc.setFont(pdfFont, "bold");
      doc.text(pdfMoney(rate * quantity), right - 2, y, { align: "right" });
      doc.setDrawColor(243, 244, 246);
      doc.line(left, y + 14, right, y + 14);
      y += 20;
    });

    y = Math.max(y + 7, 157);
    if (y > 225) {
      doc.addPage();
      y = 25;
    }
    const summary = [
      ["Items subtotal", pdfMoney(totalBeforeCharges)],
      ...(order.additionalCharges || []).map((charge) => [charge.reason, pdfMoney(charge.amount)]),
      ...(extraChargesTotal > 0 ? [["Total extra charges", pdfMoney(extraChargesTotal)]] : []),
      ...((order.discountAmount || 0) > 0 ? [[offerLabel, `- ${pdfMoney(order.discountAmount)}`]] : []),
      ["Final total", pdfMoney(order.totalAmount)],
      ["Advance received", `- ${pdfMoney(order.advanceGiven)}`],
      ["Balance due", pdfMoney(order.balanceDue)],
    ];
    summary.forEach(([label, value], index) => {
      const isTotal = label === "Final total" || label === "Balance due";
      const rowY = y + index * 8;
      if (label === "Final total") {
        doc.setDrawColor(209, 213, 219);
        doc.setLineWidth(0.5);
        doc.line(90, rowY - 5.5, right, rowY - 5.5);
      }
      if (label === "Balance due") {
        doc.setFillColor(236, 253, 245);
        doc.rect(90, rowY - 5.8, right - 90, 10, "F");
      }
      doc.setFont(pdfFont, isTotal ? "bold" : "normal");
      doc.setFontSize(isTotal ? 12 : 10);
      doc.setTextColor(label === "Balance due" ? 6 : 75, label === "Balance due" ? 95 : 85, label === "Balance due" ? 70 : 99);
      doc.text(label, 93, rowY);
      doc.text(value, right - 3, rowY, { align: "right" });
    });

    const summaryBottom = y + summary.length * 8;
    const footerY = Math.max(225, Math.min(286, summaryBottom + 18));
    doc.setDrawColor(229, 231, 235);
    doc.line(left, footerY - 7, right, footerY - 7);
    doc.setFont(pdfFont, "bold");
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text("CRAFTED WITH CARE. MADE FOR YOU.", 110, footerY - 1, { align: "center" });
    doc.setFont(pdfFont, "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text("Thank you for choosing TailorPro. Please keep this invoice for your records.", 105, footerY + 5, { align: "center" });
    return doc.output("blob");
  };

  const createInvoiceFile = async () => {
    if (!order) return null;
    const blob = await createInvoiceBlob();
    if (!blob) return null;
    return new File([blob], `Invoice-${order.orderNumber}.pdf`, { type: "application/pdf" });
  };

  const handleDownloadPDF = async () => {
    if (!order) return;
    const blob = await createInvoiceBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${order.orderNumber}.pdf`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleEmailInvoice = async () => {
    if (!order?.customer?.email) {
      setActionError("Add an email address to this customer before sending the invoice.");
      return;
    }
    setSendingInvoice("email");
    setActionError("");
    setActionMessage("");
    try {
      const file = await createInvoiceFile();
      if (!file) throw new Error("Unable to generate invoice");
      const formData = new FormData();
      formData.append("invoice", file);
      const response = await api.post(`/api/orders/${order._id}/send-invoice`, formData);
      setActionMessage(response.data.message || `Invoice sent to ${order.customer.email}.`);
    } catch (requestError: any) {
      setActionError(requestError.response?.data?.message || "Unable to email invoice.");
    } finally {
      setSendingInvoice(null);
    }
  };

  const handleShareInvoice = async () => {
    if (!order) return;
    setSendingInvoice("share");
    setActionError("");
    setActionMessage("");
    try {
      const file = await createInvoiceFile();
      if (!file) throw new Error("Unable to generate invoice");
      const shareData = {
        title: `Invoice ${order.orderNumber}`,
        text: `Invoice ${order.orderNumber}. Balance due: ${money(order.balanceDue)}.`,
        files: [file],
      };

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share(shareData);
        } catch (nativeShareError: any) {
          const shareWasDismissed =
            nativeShareError?.name === "AbortError" ||
            nativeShareError?.name === "NotAllowedError" ||
            /permission dismissed/i.test(nativeShareError?.message || "");
          if (shareWasDismissed) return;
          throw nativeShareError;
        }
        setActionMessage("Invoice shared successfully.");
        return;
      }

      const rawPhone = order.customer?.phone?.replace(/\D/g, "") || "";
      if (!rawPhone) throw new Error("This customer does not have a phone number");
      const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
      const message = encodeURIComponent(
        `Hello ${order.customer?.name || ""}, your invoice ${order.orderNumber} is ready. Total: ${money(order.totalAmount)}, paid: ${money(order.advanceGiven)}, balance: ${money(order.balanceDue)}.`
      );
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
      setActionMessage("WhatsApp opened. Use Download PDF and attach the invoice if file sharing is unavailable.");
    } catch (shareError: any) {
      const shareWasDismissed =
        shareError?.name === "AbortError" ||
        shareError?.name === "NotAllowedError" ||
        /permission dismissed/i.test(shareError?.message || "");
      if (!shareWasDismissed) {
        setActionError(shareError?.message || "Unable to share invoice.");
      }
    } finally {
      setSendingInvoice(null);
    }
  };

  if (loading) return <p className="p-8 text-sm text-gray-500">Loading invoice...</p>;
  if (error || !order) return <p className="p-8 text-sm text-red-700">{error || "Invoice not found."}</p>;

  const customerAddress = [order.customer?.address, order.customer?.city, order.customer?.state, order.customer?.postalCode].filter(Boolean).join(", ");
  const totalBeforeCharges = (order.items || []).reduce((sum, item) => sum + ((item.stitchingPrice || 0) + (item.additionalPrice || 0)) * (item.quantity || 1), 0);
  const extraChargesTotal = (order.additionalCharges || []).reduce((sum, charge) => sum + charge.amount, 0);
  const grossAmount = totalBeforeCharges + extraChargesTotal;
  const customerCredit = Math.max((order.advanceGiven || 0) - (order.totalAmount || 0), 0);
  const offerLabel = order.discountType === "percentage" ? `Offer (${order.discountValue || 0}%)` : "Offer discount";

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link href="/tailor/dashboard/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-emerald-700">
          <ChevronLeft size={20} /> Back to orders
        </Link>
        <div className="flex flex-wrap gap-3">
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <button type="button" disabled={saving} onClick={handleMarkDelivered} className="inline-flex items-center gap-2 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
              <PackageCheck size={17} /> Mark Delivered
            </button>
          )}
          <button type="button" disabled={Boolean(sendingInvoice) || !order.customer?.email} onClick={handleEmailInvoice} title={order.customer?.email ? `Email to ${order.customer.email}` : "Customer email is missing"} className="inline-flex items-center gap-2 border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50">
            <Mail size={17} /> {sendingInvoice === "email" ? "Sending..." : "Email Invoice"}
          </button>
          <button type="button" disabled={Boolean(sendingInvoice)} onClick={handleShareInvoice} className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            <Share2 size={17} /> {sendingInvoice === "share" ? "Preparing..." : "Share Invoice"}
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><Printer size={17} /> Print</button>
          <button type="button" onClick={handleDownloadPDF} className="inline-flex items-center gap-2 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"><Download size={17} /> Download PDF</button>
        </div>
      </div>

      <section id="assign-work" className="no-print scroll-mt-24 border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Invoice details</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-gray-500">Ordered {date(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <span className={`w-fit px-3 py-1.5 text-xs font-bold uppercase ${order.status === "delivered" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
              {order.status === "delivered" ? `Delivered${order.deliveredAt ? ` · ${date(order.deliveredAt)}` : ""}` : "Not delivered"}
            </span>
            <span className={`w-fit px-3 py-1.5 text-xs font-bold uppercase ${Number(order.balanceDue || 0) === 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {Number(order.balanceDue || 0) === 0 ? "Paid" : `${money(order.balanceDue)} due`}
            </span>
          </div>
        </div>

        <div className="grid gap-6 py-5 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Customer</h2>
            <p className="mt-2 text-sm font-semibold text-gray-800">{order.customer?.name || "Customer"}</p>
            {order.customer?.phone && <p className="mt-1 text-sm text-gray-600">{order.customer.phone}</p>}
            {order.customer?.email && <p className="text-sm text-gray-600">{order.customer.email}</p>}
            {customerAddress && <p className="mt-1 text-sm leading-5 text-gray-600">{customerAddress}</p>}
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">Order items</h2>
            <div className="mt-2 divide-y divide-gray-100 border border-gray-100">
              {(order.items || []).map((item) => {
                const rate = (item.stitchingPrice || 0) + (item.additionalPrice || 0);
                const quantity = item.quantity || 1;
                return <div key={item._id} className="flex items-start justify-between gap-4 p-3"><div><p className="text-sm font-semibold text-gray-900">{item.name || "Tailoring service"}</p><p className="mt-1 text-xs capitalize text-gray-500">{[item.type, item.category].filter(Boolean).join(" · ") || "Custom tailoring"} · Qty {quantity}</p></div><p className="shrink-0 text-sm font-bold text-gray-900">{money(rate * quantity)}</p></div>;
              })}
            </div>
          </div>
        </div>

        <div className="ml-auto max-w-sm space-y-2 border-t border-gray-200 pt-4 text-sm">
          <SummaryLine label="Gross amount" value={money(grossAmount)} />
          {(order.discountAmount || 0) > 0 && <SummaryLine label={offerLabel} value={`− ${money(order.discountAmount)}`} offer />}
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900"><span>Final total</span><span>{money(order.totalAmount)}</span></div>
          <SummaryLine label="Paid" value={money(order.advanceGiven)} />
          <div className="flex justify-between font-bold text-emerald-700"><span>Balance due</span><span>{money(order.balanceDue)}</span></div>
        </div>
      </section>

      <section className="no-print border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <UsersRound className="mt-0.5 text-emerald-700" size={22} />
          <div><h2 className="text-xl font-bold text-gray-900">Assign work</h2><p className="mt-1 text-sm text-gray-500">Each list is ordered by the lightest weekly workload to help distribute work equally.</p></div>
        </div>
        {staffList.length === 0 ? <p className="mt-5 border border-dashed border-gray-300 p-5 text-sm text-gray-500">Add staff and their roles on the Staff page before assigning work.</p> : <div className="mt-5 space-y-5">{(order.items || []).map((item) => {
          const existingTypes = (item.workAssignments || []).map((assignment) => assignment.workType);
          const workTypes = Array.from(new Set(["cutting", "stitching", "embroidery", "finishing", ...existingTypes]));
          return <article key={item._id} className="border border-gray-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-gray-900">{item.name || "Tailoring service"}</h3><p className="mt-1 text-xs capitalize text-gray-500">{item.category || item.type || "Custom outfit"}</p></div><div className="flex items-center gap-2"><span className="bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{(item.workAssignments || []).length} assigned</span><button type="button" disabled={assigningKey === `${item._id}-auto`} onClick={() => autoAssignItem(item)} className="border border-emerald-700 px-3 py-1.5 text-xs font-bold text-emerald-700 disabled:opacity-50">{assigningKey === `${item._id}-auto` ? "Assigning..." : "Auto distribute"}</button></div></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">{workTypes.map((workType) => {
              const assignment = (item.workAssignments || []).find((entry) => entry.workType === workType);
              const eligible = [...staffList].filter((staff) => staff.staffSkills.length === 0 || staff.staffSkills.includes(workType)).sort((a, b) => (a.weeklyAssigned / a.weeklyOrderLimit) - (b.weeklyAssigned / b.weeklyOrderLimit));
              return <label key={workType} className="text-sm font-semibold capitalize text-gray-700">{workType}<select disabled={assigningKey === `${item._id}-${workType}`} value={assignment?.staff?._id || ""} onChange={(event) => assignWork(item._id, workType, event.target.value)} className="mt-1.5 h-11 w-full border border-gray-300 bg-white px-3 font-normal text-gray-800 disabled:opacity-60"><option value="">Unassigned</option>{eligible.map((staff, index) => <option key={staff._id} value={staff._id}>{index === 0 ? "Recommended · " : ""}{staff.fullName || staff.email} · {staff.weeklyAssigned}/{staff.weeklyOrderLimit} week</option>)}</select></label>;
            })}</div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={customWork[item._id] || ""} onChange={(event) => setCustomWork((current) => ({ ...current, [item._id]: event.target.value }))} className="h-10 flex-1 border border-gray-300 px-3 text-sm" placeholder="Type another work, e.g. beadwork" /><select defaultValue="" onChange={(event) => { const workType = (customWork[item._id] || "").trim().toLowerCase(); if (workType && event.target.value) { assignWork(item._id, workType, event.target.value); setCustomWork((current) => ({ ...current, [item._id]: "" })); event.target.value = ""; } }} className="h-10 border border-gray-300 bg-white px-3 text-sm"><option value="">Assign custom work to…</option>{[...staffList].sort((a, b) => a.weeklyAssigned - b.weeklyAssigned).map((staff) => <option key={staff._id} value={staff._id}>{staff.fullName || staff.email}</option>)}</select></div>
          </article>;
        })}</div>}
      </section>

      <div ref={invoiceRef} aria-hidden="true" className="print-area pointer-events-none fixed left-[-10000px] top-0 z-0 w-[794px] bg-white p-10 text-gray-900">
        <header className="flex items-start justify-between gap-6 border-b-2 border-emerald-700 pb-6">
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-emerald-800">TailorPro</p>
            <p className="mt-1 text-xs text-gray-500">Tailoring and boutique services</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-light uppercase tracking-[0.18em] text-gray-800">Invoice</h1>
            <p className="mt-2 text-sm font-bold text-gray-900">#{order.orderNumber}</p>
            <p className="mt-1 text-xs text-gray-500">Issued {date(new Date().toISOString())}</p>
          </div>
        </header>

        <section className="grid gap-6 border-b border-gray-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Bill to</p>
            <p className="mt-2 text-base font-bold text-gray-900">{order.customer?.name || "Customer"}</p>
            {order.customer?.phone && <p className="mt-1 text-sm text-gray-600">{order.customer.phone}</p>}
            {order.customer?.email && <p className="text-sm text-gray-600">{order.customer.email}</p>}
            {customerAddress && <p className="mt-1 max-w-xs text-sm leading-5 text-gray-600">{customerAddress}</p>}
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Payment status</p>
            <p className={`mt-2 inline-block px-3 py-1 text-xs font-bold uppercase ${Number(order.balanceDue || 0) === 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {Number(order.balanceDue || 0) === 0 ? "Paid" : "Payment due"}
            </p>
          </div>
        </section>

        <section className="py-6">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-300 text-[11px] uppercase tracking-wider text-gray-500">
                <th className="py-3 pr-3 font-bold">Item</th>
                <th className="px-2 py-3 text-center font-bold">Qty</th>
                <th className="px-2 py-3 text-right font-bold">Rate</th>
                <th className="py-3 pl-3 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item) => {
                const rate = (item.stitchingPrice || 0) + (item.additionalPrice || 0);
                const quantity = item.quantity || 1;
                return (
                  <tr key={item._id} className="invoice-row border-b border-gray-100 align-top">
                    <td className="py-4 pr-3">
                      <p className="text-sm font-bold text-gray-900">{item.name || "Tailoring service"}</p>
                      <p className="mt-1 text-xs capitalize text-gray-500">{[item.type, item.category].filter(Boolean).join(" · ") || "Custom tailoring"}</p>
                      <p className="mt-2 text-[11px] text-gray-500">
                        Trial date: {date(item.trialDate)} · {order.status === "delivered" ? `Delivered: ${date(order.deliveredAt || item.deliveryDate)}` : `Expected delivery: ${date(item.deliveryDate)}`}
                      </p>
                    </td>
                    <td className="px-2 py-4 text-center text-sm text-gray-700">{quantity}</td>
                    <td className="px-2 py-4 text-right text-sm text-gray-700">{money(rate)}</td>
                    <td className="py-4 pl-3 text-right text-sm font-bold text-gray-900">{money(rate * quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="ml-auto w-full max-w-sm space-y-2 border-t border-gray-200 pt-5 text-sm">
          <SummaryLine label="Items subtotal" value={money(totalBeforeCharges)} />
          {(order.additionalCharges || []).map((charge, index) => <SummaryLine key={`${charge.reason}-${index}`} label={charge.reason} value={money(charge.amount)} />)}
          {(order.discountAmount || 0) > 0 && <SummaryLine label={offerLabel} value={`− ${money(order.discountAmount)}`} offer />}
          <div className="mt-3 flex justify-between border-t border-gray-300 pt-3 text-base font-extrabold"><span>Final total</span><span>{money(order.totalAmount)}</span></div>
          <SummaryLine label="Advance received" value={`− ${money(order.advanceGiven)}`} />
          <div className="flex justify-between bg-emerald-50 px-3 py-3 text-base font-extrabold text-emerald-800"><span>Balance due</span><span>{money(order.balanceDue)}</span></div>
          {customerCredit > 0 && <div className="flex justify-between bg-blue-50 px-3 py-3 font-bold text-blue-700"><span>Customer credit</span><span>{money(customerCredit)}</span></div>}
        </section>

        <footer className="mt-12 border-t border-gray-200 pt-5 text-center text-xs leading-5 text-gray-500">
          <p className="font-semibold text-gray-700">Thank you for choosing us.</p>
          <p>Please keep this invoice for your records.</p>
        </footer>
      </div>

      {actionError && <p role="alert" className="no-print border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
      {actionMessage && <p className="no-print border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{actionMessage}</p>}

      <section className="no-print grid gap-6 lg:grid-cols-3">
        <div className="border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-gray-900">Add extra charge</h2>
          <p className="mt-1 text-sm text-gray-500">Add alterations, urgent-delivery fees, or other charges.</p>
          <input type="text" placeholder="Reason" className="mt-4 h-11 w-full border border-gray-300 px-3 outline-none focus:border-emerald-600" value={extraReason} onChange={(event) => setExtraReason(event.target.value)} />
          <input type="number" min="0" placeholder="Amount" className="mt-3 h-11 w-full border border-gray-300 px-3 outline-none focus:border-emerald-600" value={extraAmount} onChange={(event) => setExtraAmount(event.target.value)} />
          <button type="button" disabled={saving} onClick={handleAddExtraCharge} className="mt-4 bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60">Add charge</button>
        </div>

        <div className="border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-gray-900">Receive payment</h2>
          <p className="mt-1 text-sm text-gray-500">Current balance: <strong>{money(order.balanceDue)}</strong></p>
          <input type="number" min="0" max={order.balanceDue} placeholder="Amount received" className="mt-4 h-11 w-full border border-gray-300 px-3 outline-none focus:border-emerald-600" value={amountReceived} onChange={(event) => setAmountReceived(event.target.value)} />
          <button type="button" disabled={saving} onClick={handleReceivePayment} className="mt-4 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">Confirm payment</button>
        </div>

        <div className="border border-amber-200 bg-amber-50/40 p-5">
          <h2 className="font-bold text-gray-900">Offer / discount</h2>
          <p className="mt-1 text-sm text-gray-500">Can be applied or changed at any time. Current gross amount: <strong>{money(grossAmount)}</strong></p>
          <div className="mt-4 grid grid-cols-[130px_1fr] gap-3">
            <select value={discountType} onChange={(event) => setDiscountType(event.target.value as "fixed" | "percentage")} className="h-11 border border-gray-300 bg-white px-3 text-sm outline-none focus:border-amber-600">
              <option value="fixed">Fixed ₹</option>
              <option value="percentage">Percent %</option>
            </select>
            <input type="number" min="0" max={discountType === "percentage" ? 100 : undefined} placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 200"} className="h-11 w-full border border-gray-300 bg-white px-3 outline-none focus:border-amber-600" value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" disabled={saving} onClick={() => handleApplyOffer()} className="bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60">Apply offer</button>
            {(order.discountAmount || 0) > 0 && <button type="button" disabled={saving} onClick={() => handleApplyOffer(true)} className="border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">Remove</button>}
          </div>
        </div>
      </section>
    </main>
  );
}

function SummaryLine({ label, value, offer = false }: { label: string; value: string; offer?: boolean }) {
  return <div className={`flex justify-between gap-4 ${offer ? "text-emerald-700" : "text-gray-600"}`}><span>{label}</span><span className={`font-semibold ${offer ? "text-emerald-700" : "text-gray-900"}`}>{value}</span></div>;
}
