"use client";
import { useState } from "react";
import api from "@/lib/axios";

export default function MeasurementsModal({ close, save }: any) {
  const [form, setForm] = useState({
    chest: "",
    waist: "",
    hip: "",
    shoulder: "",
  });


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 space-y-3">
        <h2 className="font-semibold text-lg">Add Measurements</h2>
        {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
  <input
    key={key}
    className="w-full p-2 border rounded"
    placeholder={key}
    value={form[key]}
    onChange={(e) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }
  />
))}


        <div className="flex justify-end gap-2">
          <button onClick={close}>Cancel</button>
          <button
            onClick={() => {
              save(form);
              close();
            }}
            className="px-4 py-1 bg-emerald-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
