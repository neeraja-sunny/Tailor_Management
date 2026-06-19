"use client";

import { useOrder } from "@/app/context/OrderContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";


export default function OrderSummaryPage() {
  const { orderData } = useOrder();
  const router = useRouter();

  const buildOutfitsPayload = () =>
    (orderData.outfits || []).map((item: any) => ({
      name: item.name,
      category: item.category || "",
      quantity: item.quantity || 1,
      type: item.type || "stitching",
      inspirationLink: item.inspirationLink || "",
      audioUrl: item.audioUrl || "",
      specialInstructions: item.specialInstructions || "",
      referenceImages: (item.referenceImages || []).map((img: any) =>
        typeof img === "string"
          ? { url: img, publicId: null }
          : img
      ),
      measurements: item.measurements || null,
      stitchOptions: item.stitchOptions || {},
      stitchingPrice: Number(item.stitchingPrice || 0),
      additionalPrice: Number(item.additionalPrice || 0),
      trialDate: item.trialDate || null,   
      deliveryDate: item.deliveryDate || null,
    }));

    console.log("Order Data in Summary Page:", orderData);

  const validate = () => {
    if (!orderData.customerId) return "Customer missing";
    if (!orderData.outfits?.length) return "No outfits selected";

    for (const o of orderData.outfits) {
      if (!o.type) return `Type missing for ${o.name}`;
      if (!o.stitchingPrice) return `Price missing for ${o.name}`;
    }
    return null;
  };

  const submit = async (status: "active" | "draft") => {
    const error = status === "active" ? validate() : null;
    if (error) return alert(error);

    try {
      const payload = {
        customerId: orderData.customerId,
        advanceGiven: orderData.advanceGiven || 0,
        notes: orderData.notes || "",
        outfits: buildOutfitsPayload(),
        status,
        forceDeliveryDate: orderData.forceDeliveryDate || false,
      };

      console.log("Submitting order payload:", payload)

      await api.post("/api/orders/create", payload);
      router.push("/tailor/dashboard/orders");
    } catch (err: any) {
      console.error(err);
      alert("Order submission failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Link
        href="/tailor/dashboard/orders/create/order-details"
        className="text-gray-600 flex items-center gap-1"
      >
      <ChevronLeft size={20} />
      Back to Order Details
      </Link>
      <h1 className="text-2xl font-semibold">Order Summary</h1>

      {orderData.outfits.map((o: any, i: number) => (
        <div key={i} className="border p-4 rounded bg-white">
          <h3 className="font-semibold">{o.name}</h3>
          <p>Type: {o.type}</p>
          <p>Quantity: {o.quantity}</p>
          <p>Stitching Price: ₹{o.stitchingPrice}</p>
          <p>Additional Price: ₹{o.additionalPrice}</p>
          <p>Delivery Date: {o.deliveryDate || "-"}</p>
        </div>
      ))}
    
      <div className="flex gap-4">
        <button
          onClick={() => submit("active")}
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          Confirm Order
        </button>

        <button
          onClick={() => submit("draft")}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Save as Draft
        </button>
      </div>
    </div>
  );
}
