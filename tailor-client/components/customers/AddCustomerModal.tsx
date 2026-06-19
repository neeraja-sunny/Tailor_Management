"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function AddCustomerModal({
  close,
  refresh,
}: {
  close: () => void;
  refresh: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    gender: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setLoading(true);
    try {
      await api.post("/api/customers/create", form);
      refresh();
      close();
    } catch (err) {
      console.error("Failed to add customer", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">

        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>

        <div className="space-y-3">

          <input
            name="name"
            onChange={handleChange}
            placeholder="Name"
            className="input-box"
          />
          <input
            name="phone"
            onChange={handleChange}
            placeholder="Phone Number"
            className="input-box"
          />
          <input
            name="email"
            onChange={handleChange}
            placeholder="Email"
            className="input-box"
          />
          <input
            name="address"
            onChange={handleChange}
            placeholder="Address"
            className="input-box"
          />
          <input
            name="city"
            onChange={handleChange}
            placeholder="City"
            className="input-box"
          />
          <input
            name="state"
            onChange={handleChange}
            placeholder="State"
            className="input-box"
          />
          <input
            name="postalCode"
            onChange={handleChange}
            placeholder="Postal Code"
            className="input-box"
          />

          <select
            name="gender"
            onChange={handleChange}
            className="input-box"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

        </div>

        <div className="flex justify-end mt-5 gap-3">
          <button
            onClick={close}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={submit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
