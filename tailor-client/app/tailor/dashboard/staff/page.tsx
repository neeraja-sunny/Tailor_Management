"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Trash2 } from "lucide-react";

export default function StaffPage() {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<any>(null);


  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/api/staff/get");
      console.log(res.data.staff, "staff data from fetch get")
      setStaffList(res.data.staff || []);
    } catch (err) {
      console.error("Failed to fetch staff");
    }
  };

  const handleAddStaff = async () => {
    if (!email) return alert("Email required");

    try {
      setLoading(true);
      await api.post("/api/staff/add", { email, name, phone });
      setEmail("");
      setName("");
      setPhone("");
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

const handleDeleteStaff = async () => {
  if (!staffToDelete) return;

  try {
    await api.delete(`/api/staff/${staffToDelete._id}`);
    setStaffList((prev) =>
      prev.filter((s) => s._id !== staffToDelete._id)
    );
    setShowDeleteModal(false);
    setStaffToDelete(null);
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to delete staff");
  }
};


  return (
    <div className="max-w-3xl mx-auto space-y-6">
        <div>
        <h1 className="text-3xl font-bold text-emerald-700">
          Staff Management
        </h1>
        <p className="text-gray-600 mt-2 font-semibold">
          Invite staff to assist you in handling orders and customers efficiently.
        </p>
      </div>
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="text-lg font-bold">Add New Staff</h2>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleAddStaff}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Staff"}
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Staff Members</h3>

        {staffList.length === 0 ? (
          <p className="text-gray-500">No staff added yet</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">{s.email}</td>
                  <td className="p-2">{s.phone || "-"}</td>
                  <td className="p-2 text-right">
        <button
          onClick={() => {
            setStaffToDelete(s);
            setShowDeleteModal(true);
          }}

          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={22} />
        </button>
      </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        Remove Staff Member
      </h2>

      <p className="text-gray-600">
        Are you sure you want to remove staff{" "}
        <span className="font-semibold text-gray-800">
          {staffToDelete?.email}
        </span>
        ? This action can be undone later.
      </p>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setStaffToDelete(null);
          }}
          className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteStaff}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
