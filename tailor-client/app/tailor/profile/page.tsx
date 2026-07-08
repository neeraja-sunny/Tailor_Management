"use client";

import { useEffect, useState } from "react";
import api, { setAccessToken } from "@/lib/axios";
import { useAuth } from "@/app/context/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Link from "next/link";
import { ChevronLeft, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    userPhoto: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [boutiques, setBoutiques] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);


  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        userPhoto: user.userPhoto || "",
      });
    }
  }, [user]);
  useEffect(() => {
      if (user?.role !== "owner") return;
      api.get("/api/boutique/my-boutiques").then(res => {
        setBoutiques(res.data);
      }).catch(() => setBoutiques([]));
    }, [user?.role]);

    const profileImage = preview || user?.userPhoto || "/default.png";


  const handleSubmit = async () => {
    setLoading(true);
    try {
      let photoUrl = form.userPhoto;

      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile);
      }

      const res = await api.put("/api/user/profile", {
        fullName: form.fullName,
        phone: form.phone,
        userPhoto: photoUrl,
      });

      setUser(res.data.user);
      setForm({
        fullName: res.data.user.fullName,
        phone: res.data.user.phone,
        userPhoto: res.data.user.userPhoto || "",
    });
      setIsEditing(false);
      setPreview(null);
      setPhotoFile(null);
    } catch {
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setDeleteError("");
    try {
      await api.delete("/api/user/account", {
        data: {
          password: deletePassword,
          confirmation: deleteConfirmation,
        },
      });
      setAccessToken(null);
      setUser(null);
      router.replace("/auth");
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || "Unable to delete account");
    } finally {
      setDeletingAccount(false);
    }
  };

return (
<div className="max-w-3xl mx-auto mt-12 space-y-8">
  <Link
    href="/tailor/dashboard"
    className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
  >
  <ChevronLeft size={18} />
  Back to Dashboard
  </Link>

  <div className="bg-white rounded-2xl shadow-sm p-8">

    <div className="flex items-center gap-6 mb-8">
      <div className="relative">
        <img
        key={profileImage}
          src={profileImage}
          alt="Profile"
          className="h-28 w-28 rounded-full object-cover border"
        />
        
{isEditing && (
  <label className="absolute bottom-1 right-1 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer">
    Change
    <input
      type="file"
      accept="image/*"
      className="hidden"
       onChange={(e) => {
              const file = e.target.files?.[0];
              setPhotoFile(file || null);
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
    />
  </label>
)}
</div>

      <div className="font-semibold">
        <h1 className="text-2xl font-bold text-gray-800">
          {form.fullName || "Your Name"}
        </h1>
        <p className="text-gray-500 capitalize">
          {user?.role}
        </p>
      </div>
    </div>

    {/* Form */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="font-semibold">
        <label className="text-sm font-semibold text-gray-600 mb-1 block">
          Full Name
        </label>
        <input
          className="w-full p-3 border rounded-lg"
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />
      </div>

      <div className="font-semibold">
        <label className="text-sm font-semibold text-gray-600 mb-1 block">
          Phone Number
        </label>
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />
      </div>
    </div>

    {!isEditing ? (
  <button
    onClick={() => setIsEditing(true)}
    className="mt-8 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold"
  >
    Edit Profile
  </button>
) : (
  <button
    onClick={handleSubmit}
    disabled={loading}
    className="mt-8 bg-emerald-600 hover:bg-emerald-700 transition text-white px-6 py-3 rounded-xl font-semibold"
  >
    {loading ? "Saving changes..." : "Save Changes"}
  </button>
)}
  </div>

  {/* ACCOUNT DETAILS */}
  <div className="bg-white rounded-2xl shadow-sm p-8">
    <h2 className="text-xl font-bold text-gray-800 mb-3">
      Account Information
    </h2>

    <div className="space-y-2 text-gray-700 font-semibold">
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Role:</strong> {user?.role}
      </p>

{user?.role === "owner" && (
  <>
    <p>
      <strong>Boutiques Owned:</strong>{" "}
      {user?.boutiques?.length || 0}
    </p>

    {/* BOUTIQUES */}
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Boutiques
      </h2>

      {boutiques.length > 0 ? (
        <ul className="space-y-2">
          {boutiques.map((b) => (
            <li
              key={b._id}
              className="px-4 py-3 rounded-lg border bg-gray-50 text-gray-800 font-medium"
            >
              <Link
                className="text-gray-800 font-medium hover:underline"
                href={`/tailor/dashboard/boutiques`}
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No boutiques found.</p>
      )}
    </div>
  </>
)}

    </div>
  </div>

  <section className="border border-red-200 bg-white p-6">
    <h2 className="text-lg font-bold text-gray-900">Delete Account</h2>
    <p className="mt-2 text-sm text-gray-600">
      Disables your login and staff access. Boutique, order, customer, and payment records are retained.
    </p>
    <button
      type="button"
      onClick={() => setDeleteOpen(true)}
      className="mt-5 flex items-center gap-2 border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
    >
      <Trash2 size={17} />
      Delete Account
    </button>
  </section>

  {deleteOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Confirm Account Deletion</h2>
          <button type="button" onClick={() => setDeleteOpen(false)} aria-label="Close account deletion" title="Close"><X /></button>
        </div>
        <p className="mt-3 text-sm text-gray-600">Enter your password and type <strong>{user?.email}</strong> to confirm.</p>
        <label className="mt-5 block text-sm font-medium text-gray-700">
          Password
          <input type="password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} className="mt-1.5 h-11 w-full border border-gray-300 px-3 outline-none focus:border-red-500" />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Confirm email
          <input type="email" value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} className="mt-1.5 h-11 w-full border border-gray-300 px-3 outline-none focus:border-red-500" />
        </label>
        {deleteError && <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{deleteError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setDeleteOpen(false)} className="border border-gray-300 px-4 py-2 text-sm font-semibold">Keep Account</button>
          <button type="button" onClick={handleDeleteAccount} disabled={deletingAccount || !deletePassword || deleteConfirmation.toLowerCase() !== user?.email?.toLowerCase()} className="bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
            {deletingAccount ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  )}

</div>

  );
}
