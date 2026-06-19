"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/app/context/AuthContext";

export default function BoutiqueSettingsPage() {
  const { user, setUser } = useAuth();

  const [boutiques, setBoutiques] = useState<any[]>([]);
  const [dailyOrderLimit, setDailyOrderLimit] = useState<number | null>(null);

  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState<any>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    api.get("/api/boutique/my-boutiques").then((res) => {
    setBoutiques(res.data);

    api.get("/api/boutique/daily-limit").then((res) => {
    
    setDailyOrderLimit(res.data?.dailyOrderLimit ?? null);
  });
    });
  }, []);

  const saveLimit = async () => {
    try {
      setIsSaving(true);
      await api.put("/api/boutique/update-daily-limit", {
        dailyOrderLimit,
      });

      setIsEditingLimit(false);
      setStatusMessage("Daily order limit saved successfully");
    } catch {
      setStatusMessage("Failed to update daily order limit");
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

const switchBoutique = async () => {
  if (!selectedBoutique) return;

  try {
    setIsSwitching(true);
    const res = await api.post("/api/boutique/switch", {
      boutiqueId: selectedBoutique._id,
    });

    setUser(res.data.user);
  } finally {
    setIsSwitching(false);
    setShowSwitchModal(false);
  }
};


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-700">
          Boutique Settings
        </h1>
        <p className="text-gray-600 mt-3 font-semibold text-lg">
          Manage your boutiques and configure daily order limits.
        </p>
      </div>

      {/* Daily Order Limit Card */}
      <div className="border border-amber-500 rounded-xl p-6 bg-white text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Daily Order Limit
        </h2>
        <p className="text-md font-semibold text-gray-600 mb-4">
          Set the maximum number of orders allowed per day
          boutique.
        </p>

        <div className="flex items-center gap-4">
          {dailyOrderLimit === null ? (
  <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-lg" />
) : (
  <input
    type="number"
    min={1}
    disabled={!isEditingLimit}
    value={dailyOrderLimit}
    onChange={(e) => setDailyOrderLimit(Number(e.target.value))}
    className={`w-32 border rounded-lg px-3 py-2 text-lg
      ${!isEditingLimit ? "bg-gray-100 cursor-not-allowed" : ""}`}
  />
)}


          {isEditingLimit ? (
            <button
              onClick={saveLimit}
              disabled={isSaving}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditingLimit(true)}
              className="border border-emerald-600 text-emerald-700 px-5 py-2 rounded-lg font-semibold hover:bg-emerald-50"
            >
              Edit
            </button>
          )}
        </div>

        {statusMessage && (
          <p className="text-sm text-emerald-600 mt-3">{statusMessage}</p>
        )}
      </div>

      {/* Boutiques Section */}
      <div>
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">
          My Boutiques
        </h2>

        <div className="space-y-4">
          {boutiques.map((b) => {
            const isActive = user?.activeBoutique === b._id;

            return (
              <div
                key={b._id}
                className={`flex justify-between items-center p-5 rounded-xl border
                ${isActive ? "border-emerald-600 bg-emerald-50" : "border-gray-200 bg-white"}`}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {b.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {isActive
                      ? "Currently active boutique"
                      : "Switch to manage this boutique"}
                  </p>
                </div>

                {isActive ? (
                  <span className="text-sm font-semibold bg-emerald-600 text-white px-4 py-2 rounded-full">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedBoutique(b);
                      setShowSwitchModal(true);
                    }}

                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Switch
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showSwitchModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
      <h2 className="text-xl text-center font-bold text-blue-600 mb-2">
        Switch Boutique?
      </h2>

      <p className="text-gray-600 mb-6 font-semibold text-center">
        You are about to switch to{" "}
        <span className="font-bold text-gray-900 text-lg">
          {selectedBoutique?.name}.
        </span>
        <br />
        All dashboard data will now reflect this boutique.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowSwitchModal(false)}
          disabled={isSwitching}
          className="px-4 py-2 rounded-lg border font-semibold text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={switchBoutique}
          disabled={isSwitching}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isSwitching ? "Switching..." : "Yes, Switch"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
