"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api, { setAccessToken } from "@/lib/axios";
import { useAuth } from "@/app/context/AuthContext";

export default function OtpClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();
 
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
  
  const e = searchParams?.get("email");
    if (e) setEmail(e);
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      return alert("Enter full OTP");
    }

    try {
      const res = await api.post(
        "/api/auth/verify-otp",
        { email, otp: finalOtp },
      );

      if (res.data.accountCreated) {
        setAccountCreated(true);
        return;
      }

      setAccessToken(res.data.accessToken);
      setUser(res.data.user);

      if (!res.data.user.isProfileCompleted && res.data.user.role === "owner") {

        router.push("/complete-profile");
        
      } else if (res.data.user.role === "staff") {
        router.push("/tailor/dashboard/orders");
      } else{
        router.push("/tailor/dashboard")
      }
     
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
    await api.post("/api/auth/resend-otp", { email });
    alert("A new OTP has been sent to your email.");
    setTimer(60);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to resend");
    }
    setLoading(false);
  };

return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">

    {/* Heading */}
    <h2 className="text-3xl font-semibold text-gray-900 mb-3">
      Verify your email
    </h2>
    <p className="text-md text-gray-600 mb-6">
      Enter the 6-digit code sent to <br />
      <span className="font-medium text-gray-900">{email}</span>
    </p>

    {/* OTP Inputs */}
    <div className="flex justify-center gap-2 sm:gap-3 mb-6">
      {otp.map((digit, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          maxLength={1}
          value={digit}
          className="
            w-11 h-11 sm:w-12 sm:h-12
            text-center text-lg font-semibold
            border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            transition
          "
          onChange={(e) => handleChange(e.target.value, i)}
        />
      ))}
    </div>
         

    {/* Verify Button */}
    <button
      onClick={verifyOtp}
      className="
        w-full bg-emerald-600 text-white
        py-2.5 rounded-lg font-medium
        hover:bg-emerald-700 transition
      "
    >
      Verify OTP
    </button>

    {/* Timer / Resend */}
    <div className="mt-5 text-sm text-gray-600">
      {timer > 0 ? (
        <p>
          Didn’t receive the code?
          <br />
          <span className="font-medium">Resend in {timer}s</span>
        </p>
      ) : (
        <button
          disabled={loading}
          onClick={resendOtp}
          className="text-emerald-600 font-medium hover:underline disabled:opacity-50"
        >
          {loading ? "Sending..." : "Resend OTP"}
        </button>
      )}
    </div>

  </div>

  {accountCreated && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="account-created-title">
      <div className="w-full max-w-sm bg-white p-7 text-center shadow-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">✓</div>
        <h2 id="account-created-title" className="mt-5 text-2xl font-bold text-gray-900">Account created successfully</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">Your email has been verified. Please sign in to continue to your TailorPro dashboard.</p>
        <button type="button" onClick={() => router.replace("/auth")} className="mt-6 w-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
          Go to login
        </button>
      </div>
    </div>
  )}
</div>

  );
}
