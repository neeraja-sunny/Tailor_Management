'use client'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import api from "@/lib/axios";


export default function AuthPage() {
  const [mode, setMode] = useState<'google'|'otp'|'password'>('otp')
  const [email, setEmail] = useState("");
  const router = useRouter();


  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
  <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

    <div
      className="hidden md:flex flex-col justify-center gap-6 p-10 rounded-2xl relative overflow-hidden"
      style={{
        backgroundImage: "url('/landing/auth.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" />

    </div>

    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl">
      <div className="flex gap-2 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
          Welcome to <span className="text-emerald-600">TailorPro</span>
        </h2>
      </div>

      <div>
        {mode === 'google' && (
          <div className="space-y-4">
            <button className="w-full border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <img src="/icons/google.svg" alt="g" className="w-5 h-5" />
              Continue with Google
            </button>
            <div className="text-xs text-gray-500 text-center mt-2">
              You’ll be redirected to Google — for now this is a UI button.
            </div>
          </div>
        )}

        {mode === 'otp' && (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-sm font-medium text-gray-700">
              Enter your email
            </label>

            <input
              type="email"
              name="email"
              placeholder="you@gmail.com"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="button"
              onClick={async () => {
  if (!email) return alert("Enter email");

  try { 
    await api.post("/api/auth/send-otp", { email });
    router.push(`/login/otp?email=${encodeURIComponent(email)}`);

  } catch (err: any) {
    console.log(err.response?.data?.message, 'error from the auth page')
    alert(err.response?.data?.message || "Failed to send OTP");
  }
}}


              className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-600 transition"
            >
              Send OTP
            </button>
          <p className="text-gray-800 leading-relaxed text-lg">
          The smarter way to run your tailoring business. Join the professionals
          who are growing their brand with us.
        </p>
      </form>
        )}

        {mode === 'password' && (
          <form className="space-y-3">
            <label className="block text-sm">Email</label>
            <input type="email" className="w-full border p-2 rounded" />

            <label className="block text-sm">Password</label>
            <input type="password" className="w-full border p-2 rounded" />

            <div className="flex items-center justify-between mt-2">
              <button className="bg-emerald-500 text-white py-2 px-4 rounded">
                Sign in
              </button>
              <a href="#" className="text-sm text-emerald-500">
                Forgot?
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  </div>
</div>
)
}
