"use client";
import { useOrder } from "@/app/context/OrderContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import AudioRecorder from "@/components/AudioRecorder";
import api from "@/lib/axios";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useRef } from "react";

interface CustomMeasurement {
  name: string;
  size: string;
  imageUrl?: String;
}

const DEFAULT_MEASUREMENT_CONFIG = {
  shoulder: {
    label: "Shoulder",
    image: "/measurements/shoulder.jpg",
    position: { top: "15%", left: "55%" },
  },
  chest: {
    label: "Chest",
    image: "/measurements/chest.jpg",
    position: { top: "22%", left: "55%" },
  },
  waist: {
    label: "Waist",
    image: "/measurements/waist.jpg",
    position: { top: "32%", left: "55%" },
  },
  hip: {
    label: "Hip",
    image: "/measurements/hip.jpg",
    position: { top: "40%", left: "55%" },
  },
  neck: {
    label: "Neck",
    image: "/measurements/neck.jpg",
    position: { top: "10%", left: "55%" },
  },
  sleeveLength: {
    label: "Sleeve Length",
    image: "/measurements/sleeve_length.jpg",
    position: { top: "28%", left: "30%" },
  },
  wrist: {
    label: "Wrist",
    image: "/measurements/wrist_circumference.jpg",
    position: { top: "45%", left: "25%" },
  },
  armhole: {
    label: "Armhole",
    image: "/measurements/arm_hole.jpg",
    position: { top: "15%", left: "30%" },
  },
  hipCircumference: {
    label: "Hip Circumference",
    image: "/measurements/hip_circumference.jpg",
    position: { top: "45%", left: "55%" },
  },
  kneeCircumference: {
    label: "Knee Circumference",
    image: "/measurements/knee_circumference.jpg",
    position: { top: "60%", left: "55%" },
  },
  fullLength: {
    label: "Full Length",
    image: "/measurements/full_length.png",
    position: { top: "72%", left: "20%" },
  },
  topLength: {
    label: "Top Length",
    image: "/measurements/top_length_cropped.png",
    position: { top: "48%", left: "20%" },
  },
  bottomlength: {
    label: "Bottom Length",
    image: "/measurements/Bottomlength.jpg",
    position: { top: "75%", left: "55%" },
  },
  ankle: {
    label: "Ankle",
    image: "/measurements/ankle.jpg",
    position: { top: "87%", left: "60%" },
  },
  bust: { label: "Bust", image: "/measurements/chest.jpg", position: { top: "22%", left: "55%" } },
  underBust: { label: "Under Bust", image: "/measurements/chest.jpg", position: { top: "27%", left: "55%" } },
  thigh: { label: "Thigh", image: "/measurements/hip_circumference.jpg", position: { top: "49%", left: "55%" } },
  calf: { label: "Calf", image: "/measurements/knee_circumference.jpg", position: { top: "69%", left: "55%" } },
  crotchDepth: { label: "Crotch Depth", image: "/measurements/measure.jpg", position: { top: "44%", left: "30%" } },
  inseam: { label: "Inseam", image: "/measurements/Bottomlength.jpg", position: { top: "65%", left: "30%" } },
  frontNeckDepth: { label: "Front Neck Depth", image: "/measurements/neck.jpg", position: { top: "13%", left: "55%" } },
  backNeckDepth: { label: "Back Neck Depth", image: "/measurements/neck.jpg", position: { top: "13%", left: "30%" } },
  flare: { label: "Flare", image: "/measurements/Bottomlength.jpg", position: { top: "84%", left: "45%" } },
};

type MeasurementKey = keyof typeof DEFAULT_MEASUREMENT_CONFIG;

const MEASUREMENT_TEMPLATES: Record<string, MeasurementKey[]> = {
  shirt: ["shoulder", "chest", "waist", "neck", "sleeveLength", "armhole", "wrist", "topLength"],
  kurtha: ["shoulder", "chest", "waist", "hip", "neck", "sleeveLength", "armhole", "wrist", "topLength"],
  kurta: ["shoulder", "chest", "waist", "hip", "neck", "sleeveLength", "armhole", "wrist", "topLength"],
  blouse: ["bust", "underBust", "waist", "shoulder", "armhole", "sleeveLength", "topLength", "frontNeckDepth", "backNeckDepth"],
  pant: ["waist", "hip", "thigh", "kneeCircumference", "calf", "ankle", "crotchDepth", "inseam", "bottomlength"],
  trouser: ["waist", "hip", "thigh", "kneeCircumference", "calf", "ankle", "crotchDepth", "inseam", "bottomlength"],
  churidar: ["waist", "hip", "thigh", "kneeCircumference", "ankle", "crotchDepth", "bottomlength"],
  coat: ["shoulder", "chest", "waist", "hip", "neck", "sleeveLength", "armhole", "wrist", "fullLength"],
  blazer: ["shoulder", "chest", "waist", "hip", "neck", "sleeveLength", "armhole", "wrist", "fullLength"],
  dress: ["bust", "waist", "hip", "shoulder", "armhole", "sleeveLength", "fullLength"],
  gown: ["bust", "waist", "hip", "shoulder", "armhole", "sleeveLength", "fullLength"],
  skirt: ["waist", "hip", "bottomlength", "flare"],
  lehenga: ["waist", "hip", "bottomlength", "flare"],
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const { orderData, setOrderData } = useOrder();

  const customImageInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showStitchOptions, setShowStitchOptions] = useState(false);
  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);
  const [prevOutfitIndex, setPrevOutfitIndex] = useState(0);

  const [uploadingaudio, setUploadingAudio] = useState(false);

  const activeOutfit = orderData.outfits?.[activeOutfitIndex];

  const [form, setForm] = useState({
    chest: "",
    waist: "",
    hip: "",
    shoulder: "",
    neck: "",
    sleeveLength: "",
    wrist: "",
    armhole: "",
    hipCircumference: "",
    kneeCircumference: "",
    fullLength: "",
    topLength: "",
    bottomlength: "",
    ankle: "",
    bust: "",
    underBust: "",
    thigh: "",
    calf: "",
    crotchDepth: "",
    inseam: "",
    frontNeckDepth: "",
    backNeckDepth: "",
    flare: "",
  });

  const outfitTemplateName = Object.keys(MEASUREMENT_TEMPLATES).find((name) =>
    String(activeOutfit?.name || "").toLowerCase().includes(name)
  );
  const measurementKeys: MeasurementKey[] = outfitTemplateName
    ? MEASUREMENT_TEMPLATES[outfitTemplateName]
    : (Object.keys(DEFAULT_MEASUREMENT_CONFIG) as MeasurementKey[]);

  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurement[]>([]);
  const [newMeasurement, setNewMeasurement] = useState({
    name: "",
    size: "",
    image: null as File | null,
  });

  const [dailyOrderCount, setDailyOrderCount] = useState<number | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [orderLimit, setOrderLimit] = useState<number | null>(null);

  const ORDER_LIMIT = 15;

  useEffect(() => {
    if (prevOutfitIndex !== activeOutfitIndex) {
      const payload = {
        defaults: {
          chest: form.chest || undefined,
          waist: form.waist || undefined,
          hip: form.hip || undefined,
          shoulder: form.shoulder || undefined,
          neck: form.neck || undefined,
          sleeveLength: form.sleeveLength || undefined,
          wrist: form.wrist || undefined,
          armhole: form.armhole || undefined,
          hipCircumference: form.hipCircumference || undefined,
          kneeCircumference: form.kneeCircumference || undefined,
          fullLength: form.fullLength || undefined,
          topLength: form.topLength || undefined,
          bottomlength: form.bottomlength || undefined,
          ankle: form.ankle || undefined,
          bust: form.bust || undefined,
          underBust: form.underBust || undefined,
          thigh: form.thigh || undefined,
          calf: form.calf || undefined,
          crotchDepth: form.crotchDepth || undefined,
          inseam: form.inseam || undefined,
          frontNeckDepth: form.frontNeckDepth || undefined,
          backNeckDepth: form.backNeckDepth || undefined,
          flare: form.flare || undefined,
        },
        custom: customMeasurements,
      };

      setOrderData((prev: any) => {
        const outfits = [...prev.outfits];
        outfits[prevOutfitIndex] = {
          ...outfits[prevOutfitIndex],
          measurements: payload,
        };
        return { ...prev, outfits };
      });

      setPrevOutfitIndex(activeOutfitIndex);
    }
  }, [activeOutfitIndex]);

  // 🔥 Load measurements when switching outfits
  useEffect(() => {
    const outfit = orderData.outfits[activeOutfitIndex];
    if (outfit?.measurements) {
      const defaults = outfit.measurements.defaults || {};
      setForm({
        chest: defaults.chest || "",
        waist: defaults.waist || "",
        hip: defaults.hip || "",
        shoulder: defaults.shoulder || "",
        neck: defaults.neck || "",
        sleeveLength: defaults.sleeveLength || "",
        wrist: defaults.wrist || "",
        armhole: defaults.armhole || "",
        hipCircumference: defaults.hipCircumference || "",
        kneeCircumference: defaults.kneeCircumference || "",
        fullLength: defaults.fullLength || "",
        topLength: defaults.topLength || "",
        bottomlength: defaults.bottomlength || "",
        ankle: defaults.ankle || "",
        bust: defaults.bust || "",
        underBust: defaults.underBust || "",
        thigh: defaults.thigh || "",
        calf: defaults.calf || "",
        crotchDepth: defaults.crotchDepth || "",
        inseam: defaults.inseam || "",
        frontNeckDepth: defaults.frontNeckDepth || "",
        backNeckDepth: defaults.backNeckDepth || "",
        flare: defaults.flare || "",
      });
      setCustomMeasurements(outfit.measurements.custom || []);
    } else {
      // Reset if no measurements exist
      setForm({
        chest: "",
        waist: "",
        hip: "",
        shoulder: "",
        neck: "",
        sleeveLength: "",
        wrist: "",
        armhole: "",
        hipCircumference: "",
        kneeCircumference: "",
        fullLength: "",
        topLength: "",
        bottomlength: "",
        ankle: "",
        bust: "",
        underBust: "",
        thigh: "",
        calf: "",
        crotchDepth: "",
        inseam: "",
        frontNeckDepth: "",
        backNeckDepth: "",
        flare: "",
      });
      setCustomMeasurements([]);
    }
  }, [activeOutfitIndex, orderData.outfits]);


const handleAudioRecorded = async (file: File) => {
  setUploadingAudio(true);
  try {
    const url = await uploadToCloudinary(file);
    setOrderData((prev: any) => {
      const outfits = [...prev.outfits];
      outfits[activeOutfitIndex] = {
        ...outfits[activeOutfitIndex],
        audioUrl: url, // ✅ SAVE INTO OUTFIT
      };
      return { ...prev, outfits };
    });
  } catch (err) {
    console.error("Audio upload failed", err);
  } finally {
    setUploadingAudio(false);
  }
};



  const handleDeliveryDateChange = async (date: string) => {
    console.log("Selected delivery date:", date);
    updateOutfit("deliveryDate", date);
    setOrderData((prev: any) => ({
      ...prev,
      forceDeliveryDate: false,
    }));

    try {
      const res = await api.get("/api/orders/count-by-date", {
        params: { date: date.split("T")[0] },
      });
      console.log("Order count response:", res.data);
      setDailyOrderCount(res.data.totalOrders);
      setOrderLimit(res.data.limit);
      if (res.data.exceeded) {
        setShowLimitModal(true);
      }
    } catch (err) {
      console.error("Failed to fetch order count", err);
    }
  };

  const acceptOverLimit = () => {
    setOrderData((prev: any) => ({
      ...prev,
      forceDeliveryDate: true,
    }));
    setShowLimitModal(false);
  };

  const addCustomMeasurement = async () => {
    if (!newMeasurement.name || !newMeasurement.size) return;

    let imageUrl: string | undefined;

    if (newMeasurement.image) {
      imageUrl = await uploadToCloudinary(newMeasurement.image);
    }

    setCustomMeasurements((prev) => [...prev, {
      name: newMeasurement.name,
      size: newMeasurement.size,
      imageUrl,
    },]);

    setNewMeasurement({ name: "", size: "", image: null });
    if (customImageInputRef.current) {
    customImageInputRef.current.value = "";
  }
  };

  if (!activeOutfit) return null;

  const updateOutfit = (key: string, value: any) => {
    setOrderData((prev: any) => {
      const outfits = [...prev.outfits];
      outfits[activeOutfitIndex] = {
        ...outfits[activeOutfitIndex],
        [key]: value,
      };
      return { ...prev, outfits };
    });
  };

  const buildMeasurementPayload = () => {
    const defaultMeasurements = Object.entries(form)
      .filter(([_, value]) => value)
      .map(([key, value]) => ({
        name: key,
        size: value,
        type: "default",
      }));

    const custom = customMeasurements.map((m) => ({
      name: m.name,
      size: m.size,
      type: "custom",
    }));

    return [...defaultMeasurements, ...custom];
  };

  const next = () => {
    // Save current measurements before navigating
    const payload = {
      defaults: {
        chest: form.chest || undefined,
        waist: form.waist || undefined,
        hip: form.hip || undefined,
        shoulder: form.shoulder || undefined,
        neck: form.neck || undefined,
        sleeveLength: form.sleeveLength || undefined,
        wrist: form.wrist || undefined,
        armhole: form.armhole || undefined,
        hipCircumference: form.hipCircumference || undefined,
        kneeCircumference: form.kneeCircumference || undefined,
        fullLength: form.fullLength || undefined,
        topLength: form.topLength || undefined,
        bottomlength: form.bottomlength || undefined,
        ankle: form.ankle || undefined,
        bust: form.bust || undefined,
        underBust: form.underBust || undefined,
        thigh: form.thigh || undefined,
        calf: form.calf || undefined,
        crotchDepth: form.crotchDepth || undefined,
        inseam: form.inseam || undefined,
        frontNeckDepth: form.frontNeckDepth || undefined,
        backNeckDepth: form.backNeckDepth || undefined,
        flare: form.flare || undefined,
      },
      custom: customMeasurements,
    };

    setOrderData((prev: any) => {
      const outfits = [...prev.outfits];
      outfits[activeOutfitIndex] = {
        ...outfits[activeOutfitIndex],
        measurements: payload,
      };
      return { ...prev, outfits };
    });

    router.push("/tailor/dashboard/orders/create/summary");
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "referenceImages" | "audioUrl"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }

      setOrderData((prev: any) => {
        const outfits = [...prev.outfits];
        if (field === "audioUrl") {
          outfits[activeOutfitIndex].audioUrl = uploadedUrls[0];
        } else {
          outfits[activeOutfitIndex].referenceImages = Array.from(
            new Set([
              ...(outfits[activeOutfitIndex].referenceImages || []),
              ...uploadedUrls,
            ])
          );
        }
        return { ...prev, outfits };
      });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeReferenceImage = (imageUrl: string) => {
    if (!window.confirm("Remove this reference image?")) return;
    setOrderData((prev: any) => {
      const outfits = [...prev.outfits];
      outfits[activeOutfitIndex] = {
        ...outfits[activeOutfitIndex],
        referenceImages: outfits[activeOutfitIndex].referenceImages.filter(
          (img: string) => img !== imageUrl
        ),
      };
      return { ...prev, outfits };
    });
  };

  const createMeasurements = async (data: any) => {
    const res = await api.post("/api/measurements/create", data);
    return res.data;
  };

  const saveMeasurementsToOutfit = () => {
    const payload = {
      defaults: {
        chest: form.chest || undefined,
        waist: form.waist || undefined,
        hip: form.hip || undefined,
        shoulder: form.shoulder || undefined,
        neck: form.neck || undefined,
        sleeveLength: form.sleeveLength || undefined,
        wrist: form.wrist || undefined,
        armhole: form.armhole || undefined,
        hipCircumference: form.hipCircumference || undefined,
        kneeCircumference: form.kneeCircumference || undefined,
        fullLength: form.fullLength || undefined,
        topLength: form.topLength || undefined,
        bottomlength: form.bottomlength || undefined,
        ankle: form.ankle || undefined,
        bust: form.bust || undefined,
        underBust: form.underBust || undefined,
        thigh: form.thigh || undefined,
        calf: form.calf || undefined,
        crotchDepth: form.crotchDepth || undefined,
        inseam: form.inseam || undefined,
        frontNeckDepth: form.frontNeckDepth || undefined,
        backNeckDepth: form.backNeckDepth || undefined,
        flare: form.flare || undefined,
      },
      custom: customMeasurements,
    };

    setOrderData((prev: any) => {
      const outfits = [...prev.outfits];
      outfits[activeOutfitIndex] = {
        ...outfits[activeOutfitIndex],
        measurements: payload,
      };
      return { ...prev, outfits };
    });
  };

  const removeCustomMeasurement = (index: number) => {
    if (!window.confirm("Remove this custom measurement?")) return;
    setCustomMeasurements((prev) => prev.filter((_, i) => i !== index));
  };

  console.log(orderData, "ordreData in details");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Link
        href="/tailor/dashboard/orders/create"
        className="flex items-center gap-2 text-emerald-600 mb-4 font-semibold"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Outfits
      </Link>

      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      {/* Outfit Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {orderData.outfits.map((o: any, i: number) => (
          <button
            key={i}
            onClick={() => setActiveOutfitIndex(i)}
            className={`px-6 py-2 rounded-full border font-semibold mb-4 ${
              i === activeOutfitIndex
                ? "bg-emerald-600 text-white"
                : "bg-white"
            }`}
          >
            {o.name} {o.measurements?.defaults && Object.keys(o.measurements.defaults).some(k => o.measurements.defaults[k]) && " ✔"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-md font-semibold text-gray-600">
            Order Type
          </label>
          <select
            value={activeOutfit.type || ""}
            onChange={(e) => updateOutfit("type", e.target.value)}
            className="border p-2 mt-3 rounded-xl w-full hover:border-emerald-500 transition"
          >
            <option value="">Select Type</option>
            <option value="stitching">Stitching</option>
            <option value="alteration">Alteration</option>
          </select>
        </div>

        <div>
          <label className="text-md font-semibold text-gray-600">
            Inspiration URL
          </label>
          <input
            type="url"
            className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
            value={activeOutfit.inspirationLink || ""}
            onChange={(e) => updateOutfit("inspirationLink", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-md font-semibold text-gray-600">
            Special Instructions
          </label>
          <textarea
            className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
            rows={4}
            value={activeOutfit.specialInstructions || ""}
            onChange={(e) =>
              updateOutfit("specialInstructions", e.target.value)
            }
          />
        </div>

        <AudioRecorder onRecorded={handleAudioRecorded} />

{uploadingaudio && ( <p className="text-sm text-gray-500">Uploading audio...</p> )}

{activeOutfit.audioUrl && (
  <audio controls className="mt-2 w-full">
    <source src={activeOutfit.audioUrl} />
  </audio>
  
)}
{activeOutfit.audioUrl && (
  <button
    onClick={() =>
      window.confirm("Remove this audio note?") && updateOutfit("audioUrl", undefined)
    }
    className="text-red-600 text-sm mt-1"
  >
    Remove audio
  </button>
)}

      </div>

      <h3 className="font-semibold text-md text-gray-600 mt-4">
        Reference Images
      </h3>
      <label className="inline-block cursor-pointer">
        <div className="px-4 py-2 border border-emerald-600 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium">
          + Add Reference Image
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e, "referenceImages")}
        />
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {activeOutfit.referenceImages?.map((img: string, index: number) => (
          <div
            key={img}
            className="relative w-32 h-[200px] overflow-hidden rounded-lg"
          >
            <img
              src={img}
              alt="reference"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeReferenceImage(img)}
              className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm group-hover:opacity-100 transition-transform hover:scale-105"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-md font-semibold text-gray-600">
            Stitching Price
          </label>
          <input
            type="number"
            className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
            value={activeOutfit.stitchingPrice || ""}
            onChange={(e) =>
              updateOutfit("stitchingPrice", Number(e.target.value))
            }
          />
        </div>

        <div>
          <label className="text-md font-semibold text-gray-600">
            Additional Price
          </label>
          <input
            type="number"
            className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
            value={activeOutfit.additionalPrice || ""}
            onChange={(e) =>
              updateOutfit("additionalPrice", Number(e.target.value))
            }
          />
        </div>

        <div>
          <label className="text-md font-semibold text-gray-600">
            Trial Date and Time
          </label>
          <input
            type="datetime-local"
            step="900"
            className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
            value={activeOutfit.trialDate ?? ""}
            onChange={(e) => updateOutfit("trialDate", e.target.value)}
          />
        </div>

        <div>
          <label className="text-md font-semibold text-gray-600">
            Delivery Date and Time
          </label>
          <input
            type="datetime-local"
            step="900"
            className="border p-2 rounded-xl hover:border-emerald-500 w-full mt-3"
            value={activeOutfit.deliveryDate ?? ""}
            onChange={(e) => handleDeliveryDateChange(e.target.value)}
          />
          {dailyOrderCount !== null && orderLimit !== null && (
            <p
              className={`mt-2 ${
                dailyOrderCount >= orderLimit
                  ? "text-red-600/30 text-red-400 px-2 py-2 rounded-lg text-md font-semibold"
                  : "bg-yellow-500/30 text-yellow-700 px-2 py-2 rounded-lg text-md font-semibold"
              }`}
            >
              Total {dailyOrderCount} orders placed on this day. Maximum{" "}
              {orderLimit} orders allowed.
            </p>
          )}
        </div>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
            <h3 className="text-xl font-bold text-red-600 items-center justify-center flex">
              Delivery Limit Reached
            </h3>
            <p className="text-md font-semibold text-gray-700">
              Maximum <span className="text-red-600 text-lg font-bold">{orderLimit}</span> orders allowed per day. There are already {dailyOrderCount} orders scheduled for this
              date. 
              <br /> You can either continue or choose another date.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowLimitModal(false);
                  updateOutfit("deliveryDate", "");
                }}
                className="px-3 py-2 border border-emerald-600 text-md font-semibold rounded-xl"
              >
                Choose Another Date
              </button>
              <button
                onClick={acceptOverLimit}
                className="px-3 py-2 bg-emerald-600 text-white text-md font-semibold rounded-xl"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 rounded-lg space-y-6">
        <h2 className="font-semibold text-xl">Measurements</h2>
        <p className="text-sm text-gray-500">
          {outfitTemplateName
            ? `Recommended measurements for ${activeOutfit?.name}. Add a custom measurement below if needed.`
            : "Complete measurement set for this custom outfit. Fill only the measurements you need."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {measurementKeys.map((key) => {
            const config = DEFAULT_MEASUREMENT_CONFIG[key];
            return (
              <div
                key={key}
                className="flex items-center gap-4 border border-gray-300 p-3 rounded-xl"
              >
                <img
                  src={config.image}
                  alt={config.label}
                  className={`h-24 w-24 shrink-0 bg-white object-contain ${
                    key === "fullLength" || key === "topLength"
                      ? "border-4 border-white shadow-sm"
                      : ""
                  }`}
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    {config.label}
                  </label>
                  <input
                    type="number"
                    placeholder="cm"
                    value={form[key]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full border p-2 rounded-xl"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="font-semibold text-xl">Add Custom Measurement</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            placeholder="Measurement name"
            value={newMeasurement.name}
            onChange={(e) =>
              setNewMeasurement({ ...newMeasurement, name: e.target.value })
            }
            className="border p-2 rounded-xl"
          />
          <input
            placeholder="Size (cm)"
            value={newMeasurement.size}
            onChange={(e) =>
              setNewMeasurement({ ...newMeasurement, size: e.target.value })
            }
            className="border p-2 rounded-xl"
          />
          <label className="border border-emerald-500 rounded-xl font-medium text-md p-2 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
            <input
            ref={customImageInputRef}
              type="file"
              className="hidden"
                onChange={(e) =>
                setNewMeasurement((prev) => ({
                ...prev,
                image: e.target.files?.[0] || null,
              }))
            }
            />
            + Upload Image
          </label>
        </div>

        {newMeasurement.image && (
          <div className="flex items-center gap-3 border p-3 rounded bg-gray-50 mt-3">
            <img
              src={URL.createObjectURL(newMeasurement.image)}
              className="w-24 h-24 rounded object-cover"
              alt="preview"
            />
            <div>
              <p className="font-medium">
                {newMeasurement.name || "Custom measurement"}
              </p>
              <p className="text-sm text-gray-600">{newMeasurement.size} cm</p>
            </div>
          </div>
        )}

        <button
          onClick={addCustomMeasurement}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold mt-3"
        >
          Add Measurement
        </button>

        {customMeasurements.length > 0 && (
          <div className="space-y-2">
            {customMeasurements.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                
                  <img
                    src={m.imageUrl as string}
                    className="w-24 h-24 rounded-xl object-cover"
                    alt={m.name}
                  />
              
                <p className="font-medium">
                  {m.name}: {m.size} cm
                </p>
                <button
                  type="button"
                  onClick={() => removeCustomMeasurement(i)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 className="font-semibold text-xl text-center">
          Preview on Demo Image
        </h2>

        <div className="relative w-[380px] h-[580px] border rounded mx-auto">
          <img
            src="/measurements/measure.jpg"
            alt="Demo Body"
            className="w-full h-full object-cover"
          />

          {measurementKeys.map((key) => {
            const config = DEFAULT_MEASUREMENT_CONFIG[key];
            if (!form[key]) return null;

            return (
              <div
                key={key}
                className="absolute flex items-center gap-2 bg-white/90 px-2 py-1 rounded shadow text-xs"
                style={{
                  top: config.position.top,
                  left: config.position.left,
                }}
              >
                <span className="font-medium text-md">
                  {config.label}: {form[key]} cm
                </span>
              </div>
            );
          })}

          {customMeasurements.map((m, i) => (
            <div
              key={i}
              className="absolute flex items-center gap-2 bg-white/90 px-2 py-1 rounded shadow text-xs"
              style={{ top: `${65 + i * 6}%`, left: "55%" }}
            >
              <span className="text-md font-semibold">
                {m.name}: {m.size} cm
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="px-4 py-2 bg-emerald-600 text-md font-medium text-white rounded-full"
      >
        Continue to Summary
      </button>
    </div>
  );
}
