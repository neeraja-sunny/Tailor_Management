"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import api, { setAccessToken } from "@/lib/axios";
import { useAuth } from "@/app/context/AuthContext";

type Mode = "login" | "signup" | "forgot" | "reset";

const initialSignup = {
  firstName: "",
  lastName: "",
  email: "",
  businessName: "",
  country: "India",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signup, setSignup] = useState(initialSignup);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
  };

  const finishLogin = (data: any) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    router.replace(data.user.role === "staff" ? "/tailor/dashboard/orders" : "/tailor/dashboard");
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/api/auth/login", {
        identifier,
        password: loginPassword,
      });
      finishLogin(response.data);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    if (!identifier.includes("@")) {
      setError("Enter your email address to use email OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/send-otp", { email: identifier });
      router.push(`/login/otp?email=${encodeURIComponent(identifier)}`);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/signup", signup);
      router.push(`/login/otp?email=${encodeURIComponent(signup.email)}&purpose=signup`);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/forgot-password", { email: resetEmail });
      setMessage(`A reset code was sent to ${resetEmail}.`);
      setMode("reset");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/reset-password", {
        email: resetEmail,
        otp: resetOtp,
        password: newPassword,
        confirmPassword: confirmNewPassword,
      });
      setIdentifier(resetEmail);
      setLoginPassword("");
      setMessage("Password reset successfully. Sign in with your new password.");
      setMode("login");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden border border-gray-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <section
          className="relative hidden min-h-[680px] bg-cover bg-center p-10 text-white lg:flex lg:flex-col lg:justify-between"
          style={{ backgroundImage: "url('/landing/auth.jpg')" }}
        >
          <div className="absolute inset-0 bg-emerald-950/75" />
          <div className="relative text-2xl font-bold">TailorPro</div>
          <div className="relative max-w-sm">
            <h1 className="text-4xl font-semibold leading-tight">Run your tailoring business with clarity.</h1>
            <p className="mt-4 text-sm leading-6 text-emerald-50">
              Orders, customers, fittings, deliveries, and payments in one workspace.
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to home
          </Link>

          {(mode === "login" || mode === "signup") && (
            <div className="mb-8 grid grid-cols-2 border-b border-gray-200">
              <button type="button" onClick={() => changeMode("login")} className={`pb-3 text-sm font-semibold ${mode === "login" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-gray-500"}`}>
                Login
              </button>
              <button type="button" onClick={() => changeMode("signup")} className={`pb-3 text-sm font-semibold ${mode === "signup" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-gray-500"}`}>
                Sign Up
              </button>
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <FormHeading title="Welcome back" description="Sign in to your TailorPro account." />
              <Field icon={<Mail size={18} />} label="Email or phone" value={identifier} onChange={setIdentifier} autoComplete="username" />
              <PasswordField label="Password" value={loginPassword} onChange={setLoginPassword} show={showPassword} onToggle={() => setShowPassword((current) => !current)} autoComplete="current-password" />
              <div className="flex justify-end">
                <button type="button" onClick={() => { setResetEmail(identifier.includes("@") ? identifier : ""); changeMode("forgot"); }} className="text-sm font-semibold text-emerald-700 hover:underline">
                  Forgot password?
                </button>
              </div>
              <Status error={error} message={message} />
              <PrimaryButton loading={loading}>Login</PrimaryButton>
              <button type="button" disabled={loading} onClick={handleOtpLogin} className="w-full border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                Sign in with email OTP
              </button>
              <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account? <button type="button" onClick={() => changeMode("signup")} className="font-semibold text-emerald-700 hover:underline">Register</button>
              </p>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <FormHeading title="Create your account" description="Set up your business workspace." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={<UserRound size={18} />} label="First name" value={signup.firstName} onChange={(value) => setSignup({ ...signup, firstName: value })} autoComplete="given-name" />
                <Field icon={<UserRound size={18} />} label="Last name" value={signup.lastName} onChange={(value) => setSignup({ ...signup, lastName: value })} autoComplete="family-name" />
              </div>
              <Field icon={<Mail size={18} />} label="Email" type="email" value={signup.email} onChange={(value) => setSignup({ ...signup, email: value })} autoComplete="email" />
              <Field icon={<Building2 size={18} />} label="Business name" value={signup.businessName} onChange={(value) => setSignup({ ...signup, businessName: value })} autoComplete="organization" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Country</span>
                  <span className="flex h-11 items-center border border-gray-300 px-3 focus-within:border-emerald-600">
                    <Globe2 size={18} className="mr-2 text-gray-400" />
                    <select value={signup.country} onChange={(event) => setSignup({ ...signup, country: event.target.value })} className="h-full w-full bg-transparent text-sm outline-none">
                      <option>India</option><option>United Arab Emirates</option><option>United Kingdom</option><option>United States</option><option>Other</option>
                    </select>
                  </span>
                </label>
                <Field icon={<Phone size={18} />} label="Phone number" type="tel" value={signup.phone} onChange={(value) => setSignup({ ...signup, phone: value })} autoComplete="tel" />
              </div>
              <PasswordField label="Password" value={signup.password} onChange={(value) => setSignup({ ...signup, password: value })} show={showPassword} onToggle={() => setShowPassword((current) => !current)} autoComplete="new-password" />
              <PasswordField label="Confirm password" value={signup.confirmPassword} onChange={(value) => setSignup({ ...signup, confirmPassword: value })} show={showPassword} onToggle={() => setShowPassword((current) => !current)} autoComplete="new-password" />
              <label className="flex items-start gap-3 text-sm text-gray-600">
                <input type="checkbox" checked={signup.acceptTerms} onChange={(event) => setSignup({ ...signup, acceptTerms: event.target.checked })} className="mt-0.5 h-4 w-4 accent-emerald-600" />
                <span>I agree to the Terms and Privacy Policy.</span>
              </label>
              <Status error={error} message={message} />
              <PrimaryButton loading={loading}>Create account</PrimaryButton>
              <p className="text-center text-sm text-gray-500">
                Already have an account? <button type="button" onClick={() => changeMode("login")} className="font-semibold text-emerald-700 hover:underline">Login</button>
              </p>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-5">
              <FormHeading title="Forgot password" description="We will email you a six-digit reset code." />
              <Field icon={<Mail size={18} />} label="Email" type="email" value={resetEmail} onChange={setResetEmail} autoComplete="email" />
              <Status error={error} message={message} />
              <PrimaryButton loading={loading}>Send reset code</PrimaryButton>
              <BackToLogin onClick={() => changeMode("login")} />
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={handleReset} className="space-y-5">
              <FormHeading title="Reset password" description={`Enter the code sent to ${resetEmail}.`} />
              <Field icon={<LockKeyhole size={18} />} label="Six-digit code" value={resetOtp} onChange={(value) => setResetOtp(value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" />
              <PasswordField label="New password" value={newPassword} onChange={setNewPassword} show={showPassword} onToggle={() => setShowPassword((current) => !current)} autoComplete="new-password" />
              <PasswordField label="Confirm new password" value={confirmNewPassword} onChange={setConfirmNewPassword} show={showPassword} onToggle={() => setShowPassword((current) => !current)} autoComplete="new-password" />
              <Status error={error} message={message} />
              <PrimaryButton loading={loading}>Reset password</PrimaryButton>
              <BackToLogin onClick={() => changeMode("login")} />
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

function FormHeading({ title, description }: { title: string; description: string }) {
  return <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">{title}</h2><p className="mt-1 text-sm text-gray-500">{description}</p></div>;
}

function Field({ icon, label, value, onChange, type = "text", ...inputProps }: { icon: React.ReactNode; label: string; value: string; onChange: (value: string) => void; type?: string; [key: string]: any }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span><span className="flex h-11 items-center border border-gray-300 px-3 focus-within:border-emerald-600">{<span className="mr-2 text-gray-400">{icon}</span>}<input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-full w-full bg-transparent text-sm outline-none" {...inputProps} /></span></label>;
}

function PasswordField({ label, value, onChange, show, onToggle, autoComplete }: { label: string; value: string; onChange: (value: string) => void; show: boolean; onToggle: () => void; autoComplete: string }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span><span className="flex h-11 items-center border border-gray-300 px-3 focus-within:border-emerald-600"><LockKeyhole size={18} className="mr-2 text-gray-400" /><input required type={show ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} className="h-full w-full bg-transparent text-sm outline-none" /><button type="button" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"} title={show ? "Hide password" : "Show password"} className="ml-2 text-gray-400 hover:text-gray-700">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>;
}

function PrimaryButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return <button disabled={loading} className="w-full bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">{loading ? "Please wait..." : children}</button>;
}

function Status({ error, message }: { error: string; message: string }) {
  if (error) return <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (message) return <p className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>;
  return null;
}

function BackToLogin({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="w-full text-sm font-semibold text-emerald-700 hover:underline">Back to login</button>;
}
