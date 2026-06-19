"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { useRef } from "react";
import html2pdf from "html2pdf.js";


export default function OrderDetails() {
  // const { id } = useParams();
  const params = useParams<{ id: string }>();
  const invoiceRef = useRef<HTMLDivElement>(null);


if (!params) {
  // handle null case, e.g., show loading or error
  return <div>Loading...</div>;
}

const id = params.id;
  const [order, setOrder] = useState<any>(null);
  const [amountReceived, setAmountReceived] = useState("");

  const [extraAmount, setExtraAmount] = useState("");
  const [extraReason, setExtraReason] = useState("");

  type AdditionalCharge = {
  reason: string;
  amount: number;
};

  const fetchOrder = async () => {
    const res = await api.get(`/api/orders/${id}`);
    setOrder(res.data.order);
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleReceivePayment = async () => {
    if (!amountReceived) return;

    await api.patch(`/api/orders/${order._id}/receive-payment`, {
      amount: Number(amountReceived),
    });

    setAmountReceived("");
    fetchOrder();
  };

  const handleAddExtraCharge = async () => {
    if (!extraAmount || !extraReason) return alert("Enter amount & reason");

    await api.patch(`/api/orders/${order._id}/add-extra-charge`, {
      amount: Number(extraAmount),
      reason: extraReason,
    });

    setExtraAmount("");
    setExtraReason("");
    fetchOrder();
  };

  const handlePrint = () => {
  window.print();
};

const handleDownloadPDF = () => {
  if (!invoiceRef.current) return;

  html2pdf()
    .set({
      margin: 10,
      filename: `Invoice-${order.orderNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(invoiceRef.current)
    .save();
};


  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <Link href="/tailor/dashboard/orders" className="no-print flex items-center gap-1 text-gray-600">
        <ChevronLeft size={20} />
        Back to Orders
      </Link>

<div className="no-print flex gap-3 justify-end">
  <button
    onClick={handlePrint}
    className="border font-semibold border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-200"
  >
    🖨 Print
  </button>

  <button
    onClick={handleDownloadPDF}
    className="bg-blue-500 text-white px-4 py-2 font-semibold rounded-full hover:bg-blue-900"
  >
    ⬇ Download PDF
  </button>
</div>

      <div
      ref={invoiceRef} 
      className="bg-white p-6 border rounded-lg shadow space-y-4">

        
        <h1 className="text-2xl font-bold">Invoice</h1>

        <p><b>Order No:</b> {order.orderNumber}</p>
        <p><b>Customer:</b> {order.customer?.name}</p>

        {/* OUTFITS */}
        <div className="space-y-3">

          {order.items.map((item: any) => {
            const total =
              (item.stitchingPrice + item.additionalPrice) * item.quantity;

            return (
              <div key={item._id} className="border p-4 rounded">
                <p className="font-semibold">{item.name}</p>
                <p>Qty: {item.quantity}</p>
                <p>Stitching: ₹{item.stitchingPrice}</p>
                <p>Additional: ₹{item.additionalPrice}</p>
                <p>TrialDate: {item.trialDate ? new Date(item.trialDate).toLocaleDateString() : 'N/A'}</p>
                <p>DeliveryDate: {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                <p className="font-semibold">Item Total: ₹{total}</p>
              </div>
            );
          })}
        </div>

        {/* ADD EXTRA CHARGE */}
        <div className="no-print border-t pt-4 space-y-2">
          <h3 className="font-semibold">Additional Charges</h3>

          <input
            type="text"
            placeholder="Reason (eg: urgent delivery)"
            className="border p-2 w-full"
            value={extraReason}
            onChange={(e) => setExtraReason(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className="border p-2 w-full"
            value={extraAmount}
            onChange={(e) => setExtraAmount(e.target.value)}
          />

          <button
            onClick={handleAddExtraCharge}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Add Charge
          </button>
        </div>

        {order.additionalCharges?.map((c: AdditionalCharge, i: number) => (
  <div key={i} className="justify-between text-md">
    <span>{c.reason}</span>
    <span className="p-5 text-red-500 font-semibold">₹{c.amount}</span>
  </div>
))}

        {/* PAYMENT SUMMARY */}
        <div className="border-t pt-4 space-y-1">
          <p className="font-semibold text-lg">Total Amount: ₹{order.totalAmount}</p>
          <p>Advance Given: ₹{order.advanceGiven || 0}</p>
          <p className="text-emerald-700 font-semibold text-lg">
            Balance Due: ₹{order.balanceDue}
          </p>
        </div>

        {/* RECEIVE PAYMENT */}
        <div className="no-print pt-3">
          <p className="font-semibold">Receive Payment</p>

          <div className="flex gap-3">
            <input
              type="number"
              className="border p-2 rounded w-40"
              placeholder="Amount"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
            />

            <button
              onClick={handleReceivePayment}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
