"use client";

import { useAuth } from "@/app/context/AuthContext";
import { ChevronRight, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Topbar() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading || !user) return null;

  return (
    <header className="no-print w-full bg-white shadow-md px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between relative">

      <div className="flex items-center gap-2">
        <span className="hidden sm:block text-lg font-semibold text-gray-700">
          Dashboard
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-100 rounded-full text-sm sm:text-base hover:bg-emerald-200 transition"
        >
          <span className="max-w-[120px] sm:max-w-none truncate">
            {user.fullName || user.email}
          </span>

          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
        </button>

        <div
          className={`absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg text-black border z-[999] ${
            open ? "block" : "hidden"
          }`}
        >
          <Link
            href="/tailor/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Profile
          </Link>

          <button
            onClick={async () => {
              await logout();
              window.location.href = "/auth";
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
