"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function CompleteProfilePage() {
const router = useRouter();

const { setUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [boutiques, setBoutiques] = useState([{ name: "" }]);
  const [loading, setLoading] = useState(false);

  const addBoutique = () =>
    setBoutiques([...boutiques, { name: "" }]);

  const handleSubmit = async () => {
    if (!fullName || boutiques.some(b => !b.name)) {
      return alert("Fill all fields");
    }
    setLoading(true);
    try {
      console.log("Submitting profile completion:", {
        fullName,
        phone,
        boutiques,
      });
      const res = await api.post("/api/user/complete-profile", {
        fullName,
        phone,
        boutiques,
      });
      console.log("Profile completion response:", res.data);

      setUser(res.data.user);
      router.replace("/tailor/dashboard");
    } catch {
      alert("Profile setup failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto mt-20 bg-white p-6 rounded-xl shadow border-2 border-t-emerald-500">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Complete Your Profile
      </h1>
      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        className="w-full p-3 border rounded mb-6"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <h2 className="font-semibold mb-2">Your Boutiques</h2>
      {boutiques.map((b, i) => (
        <input
          key={i}
          className="w-full p-3 border rounded mb-3"
          placeholder={`Boutique ${i + 1} Name`}
          value={b.name}
          onChange={(e) => {
            const copy = [...boutiques];
            copy[i].name = e.target.value;
            setBoutiques(copy);
          }}
        />
      ))}
      <button
        onClick={addBoutique}
        className="mb-4 text-emerald-600 font-semibold"
      >
        + Add another boutique
      </button>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full font-semibold text-lg bg-emerald-600 text-white py-3 rounded-xl"
      >
        {loading ? "Creating..." : "Finish Setup"}
      </button>
    </div>
  );
}
