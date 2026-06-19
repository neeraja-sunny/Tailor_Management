"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const DEFAULT_MEASUREMENT_CONFIG: Record<
  string,
  {
    label: string;
    image: string;
  }
> = {
  shoulder: {
    label: "Shoulder",
    image: "/measurements/shoulder.jpg",
  },
  chest: {
    label: "Chest",
    image: "/measurements/chest.jpg",
  },
  waist: {
    label: "Waist",
    image: "/measurements/waist.jpg",
  },
  hip: {
    label: "Hip",
    image: "/measurements/hip.jpg",
  },
  neck: {
    label: "Neck",
    image: "/measurements/neck.jpg",
  },
  sleeveLength: {
    label: "Sleeve Length",
    image: "/measurements/sleeve_length.jpg",
  },
  wrist: {
    label: "Wrist",
    image: "/measurements/wrist_circumference.jpg",
  },
  armhole: {
    label: "Armhole",
    image: "/measurements/arm_hole.jpg",
  },
  hipCircumference: {
    label: "Hip Circumference",
    image: "/measurements/hip_circumference.jpg",
  },
  kneeCircumference: {
    label: "Knee Circumference",
    image: "/measurements/knee_circumference.jpg",
  },
  bottomlength: {
    label: "Bottom Length",
    image: "/measurements/Bottomlength.jpg",
  },
  ankle: {
    label: "Ankle",
    image: "/measurements/ankle.jpg",
  },
};

export default function OrderDetailsPage() {

const params = useParams();

if (!params) {
  return <div>Loading...</div>;
}

const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/orders/${orderId}`);
      console.log(res.data.order, "Fetched order details");
      setOrder(res.data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
    }
    setLoading(false);
  };

  const updateOutfitStatus = async (itemId: string, status: string) => {
    try {
      await api.patch(`/api/orders/item/${itemId}/status`, { status });
      fetchOrder();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6 text-red-600">Order not found</p>;

  return (
    <div className="p-6 space-y-6">
      <Link
        href="/tailor/dashboard/orders"
        className="text-gray-600 flex items-center gap-1"
      >
        <ChevronLeft size={20} />
        Back to Orders
      </Link>
      <h1 className="text-2xl font-bold text-emerald-700">Outfit Details</h1>
      {/* Header */}
      <h1 className="text-lg font-bold text-gray-700">
        Order Number: {order.orderNumber}
      </h1>

      {/* Order Info */}
      <div className="bg-white p-5 rounded-lg shadow border grid md:grid-cols-1 gap-4 text-lg">
        <p><strong>Customer Name:</strong> {order.customer?.name}</p>
        <p><strong className="">Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Advance Given:</strong> ₹{order.advanceGiven}</p>
      </div>

      {/* All Outfits */}
      <div className="space-y-6">
        {Array.isArray(order.items) && order.items.map((item: any, index: number) => (

          <div
            key={item._id}
            className="bg-white p-5 rounded-lg shadow border space-y-4"
          >
            {/* Outfit Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {index + 1}. {item.name}
              </h2>

              {/* Status */}
              <select
                value={item.status}
                onChange={(e) =>
                  updateOutfitStatus(item._id, e.target.value)
                }
                className="border border-emerald-700 p-2 rounded-full"
              >
                <option value="accepted">Accepted</option>
                <option value="cutting">Cutting</option>
                <option value="stitching">Stitching</option>
                <option value="finishing">Finishing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-3">
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
            </div>

            {/* Inspiration */}
            {item.inspirationLink && (
              <p>
                <strong>Inspiration:</strong>{" "}
                <a
                  href={item.inspirationLink}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View Link
                </a>
              </p>
            )}

            {/* Audio */}
            {item.audioUrl && (
              <div>
                <strong>Audio Note:</strong>
                <audio controls className="mt-2 w-full">
                  <source src={item.audioUrl} />
                </audio>
              </div>
            )}

            {/* Reference Images */}
            {item.referenceImages?.length > 0 && (
              <div>
                <strong>Reference Images:</strong>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {item.referenceImages.map((img: any, idx: number) => (
                    <img
                      key={idx}
                      src={img.url}
                      className="w-full h-32 object-cover rounded shadow"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {item.specialInstructions && (
              <p>
                <strong>Special Instructions:</strong>{" "}
                {item.specialInstructions}
              </p>
            )}

{/* Measurements */}
{item.measurements && (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Measurements</h3>

    {/* Custom Measurements */}
    {item.measurements.custom?.length > 0 && (
      <div>
        <h4 className="font-medium mb-2">Custom Measurements</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {item.measurements.custom.map((m: any, idx: number) => (
            <div
              key={idx}
              className="border rounded-lg p-3 shadow-sm space-y-2"
            >
            <p>
              <strong>{m.name}</strong>: {m.size}
            </p>

              {m.imageUrl && (
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  className="w-full h-32 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )}

{item.measurements?.defaults &&
  Object.keys(item.measurements.defaults).length > 0 && (
    <div>
      <h4 className="font-medium mb-3">Standard Measurements</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(item.measurements.defaults as Record<string, string | number>).map(
          ([key, value]) => {
            const config = DEFAULT_MEASUREMENT_CONFIG[key];

            return (
              <div
                key={key}
                className="border rounded-lg p-3 shadow-sm space-y-2"
              >
              <p>
                <strong>{config?.label ?? key}</strong>:{" "}
                <span>{String(value)}</span>
              </p>

              {config?.image && (
                  <img
                    src={config.image}
                    alt={config.label}
                    className="w-full h-32 object-cover rounded"
                  />
              )}
            </div>
            );
          }
        )}
      </div>
    </div>
  )}
  </div>
)}
<p><strong>Stitching Price:</strong> ₹{item.stitchingPrice}</p>
<p><strong>Additional Price:</strong> ₹{item.additionalPrice}</p>

            {/* Stitch Options */}
            {item.stitchOptions &&
              Object.keys(item.stitchOptions).length > 0 && (
                <div>
                  <h3 className="font-semibold">Stitch Options</h3>
                  <ul className="ml-4 list-disc">
                    {Object.entries(item.stitchOptions as Record<string, string | number>).map(
                      ([key, val]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {String(val)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
