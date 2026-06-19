"use client";
import { useState } from "react";

export default function StitchOptionsModal({ close, save }: any) {
  const [options, setOptions] = useState({
    collar: "Casual",
    sleeves: "Half",
    pocket: "Yes",
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 space-y-4">
        <h2 className="text-lg font-semibold">Stitch Options</h2>

        <select
          className="w-full border p-2"
          value={options.collar}
          onChange={(e) =>
            setOptions((prev) => ({ ...prev, collar: e.target.value }))
          }
        >
          <option>Casual</option>
          <option>Mandarin</option>
        </select>

        <select
          className="w-full border p-2"
          value={options.sleeves}
          onChange={(e) =>
            setOptions((prev) => ({ ...prev, sleeves: e.target.value }))
          }
        >
          <option>Half</option>
          <option>Full</option>
        </select>

        <select
          className="w-full border p-2"
          value={options.pocket}
          onChange={(e) =>
            setOptions((prev) => ({ ...prev, pocket: e.target.value }))
          }
        >
          <option>Yes</option>
          <option>No</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={close}>Cancel</button>
          <button
            onClick={() => {
              save(options);
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
