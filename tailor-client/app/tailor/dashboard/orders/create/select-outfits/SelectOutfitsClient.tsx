"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useOrder } from "@/app/context/OrderContext";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import api from "@/lib/axios";

interface Outfit {
  name: string;
  quantity: number;
  image?: string;
}

const defaultOutfits: Outfit[] = [
  { name: "Shirt", quantity: 1, image: "/outfits/shirtimage.jpg" },
  { name: "Pant", quantity: 1, image: "/outfits/pantimage.jpg" },
  { name: "Kurtha", quantity: 1, image: "/outfits/kurthaimage.jpg" },
  { name: "Blouse", quantity: 1, image: "/outfits/blouseimage.jpg" },
  { name: "Churidar", quantity: 1, image: "/outfits/churidharimage.png" },
  { name: "Coat", quantity: 1, image: "/outfits/coatimage.jpg" },
];

export default function SelectOutfitsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const customerId = params?.get("customerId") || "";

  const { setOrderData } = useOrder();
  const [selected, setSelected] = useState<Outfit[]>([]);
  const [customName, setCustomName] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [outfits, setOutfits] = useState<Outfit[]>([]);
const [preview, setPreview] = useState<string | null>(null);


useEffect(() => {
  const fetchOutfits = async () => {
    try {
      const { data } = await api.get("/api/outfits/get", {
        params: { userId: "CURRENT_USER_ID" },
      });
      setOutfits(data);
    } catch (err) {
      console.error("Fetch outfits failed", err);
    }
  };

  fetchOutfits();
}, []);



  const toggleOutfit = (outfit: Outfit) => {
    const idx = selected.findIndex((s) => s.name === outfit.name);
    if (idx >= 0) {
      setSelected(selected.filter((_, i) => i !== idx));
    } else {
      setSelected([...selected, { ...outfit, quantity: 1 }]);
    }
  };

  const updateQty = (index: number, qty: number) => {
    const updated = [...selected];
    updated[index].quantity = Math.max(1, qty || 1);
    setSelected(updated);
  };

  const remove = (index: number) => {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

const addCustomOutfit = async () => {
  if (!customName.trim()) return;

  try {
    setUploading(true);

    let imageUrl: string | undefined;

    if (customImage) {
      imageUrl = await uploadToCloudinary(customImage);
    }

    const { data: savedOutfit } = await api.post("/api/outfits/create", {
      name: customName.trim(),
      image: imageUrl,
      userId: "CURRENT_USER_ID",
    });

    setOutfits((prev) => [...prev, savedOutfit]);

    setSelected((prev) => [
      ...prev,
      {
        name: savedOutfit.name,
        quantity: 1,
        image: savedOutfit.image,
      },
    ]);

    setCustomName("");
    setCustomImage(null);
  } catch (error) {
    console.error("Create outfit failed:", error);
  } finally {
    setUploading(false);
  }
};



  const next = () => {
    setOrderData((prev: any) => ({
      ...prev,
      customerId,
      outfits: selected,
    }));

    router.push("/tailor/dashboard/orders/create/order-details");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-black">Select Outfits</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-10">
        {defaultOutfits.map((o) => {
          const isSelected = selected.some((s) => s.name === o.name);
          return (
            <div
              key={o.name}
              className={`relative h-48 w-48 border rounded-lg overflow-hidden cursor-pointer flex items-center justify-center transition-transform ${
                isSelected
                  ? "ring-4 ring-emerald-500 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => toggleOutfit(o)}
            >
              <img
                src={o.image}
                alt={o.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold">
                {o.name}
              </div>
              {isSelected && (
                <Check
                  size={24}
                  className="absolute top-1 right-1 text-emerald-500 bg-white rounded-full p-0.5"
                />
              )}
            </div>
          );
        })}

        {outfits.map((o) => {
          const isSelected = selected.some((s) => s.name === o.name);
          return (
            <div
              key={o.name}
              className={`relative h-48 w-48 border rounded-lg overflow-hidden cursor-pointer flex items-center justify-center transition-transform ${
                isSelected
                  ? "ring-4 ring-emerald-500 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => toggleOutfit(o)}
            >
              <img
                src={o.image}
                alt={o.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold">
                {o.name}
              </div>
              {isSelected && (
                <Check
                  size={24}
                  className="absolute top-1 right-1 text-emerald-500 bg-white rounded-full p-0.5"
                />
              )}
            </div>
          );
        })}
      </div>

{/* Hidden file input */}
<input
  id="custom-image"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0] || null;
    setCustomImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }}
/>

<div className="mt-10 max-w-xl rounded-2xl bg-white p-5 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">
    Add Custom Outfit
  </h3>

  <div className="flex gap-4 items-start">
    {/* Clickable upload box */}
    <label
      htmlFor="custom-image"
      className="h-24 w-24 rounded-xl border-2 border-dashed border-emerald-400 flex items-center justify-center cursor-pointer hover:border-emerald-700 transition"
    >
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="h-full w-full object-cover rounded-xl"
        />
      ) : (
        <span className="text-sm text-gray-500 text-center px-2">
          Upload Image
        </span>
      )}
    </label>

    {/* Name + Button */}
    <div className="flex-1 space-y-3">
      <input
        type="text"
        placeholder="Outfit name (e.g. Sherwani)"
        value={customName}
        onChange={(e) => setCustomName(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <button
        onClick={addCustomOutfit}
        disabled={uploading}
        className="w-full rounded-full bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Add Outfit"}
      </button>
    </div>
  </div>
</div>


      <div className="mt-6 space-y-3">
        {selected.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-4 border rounded"
          >
            <span className="font-medium">{item.name}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                className="border p-1 w-16"
                value={item.quantity}
                onChange={(e) => updateQty(i, Number(e.target.value))}
              />
              <button
                onClick={() => remove(i)}
                className="text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={next}
        className="mt-6 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition"
      >
        Continue
      </button>
    </div>
  );
}
