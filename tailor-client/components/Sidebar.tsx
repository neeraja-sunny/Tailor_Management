"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const [activeBoutique, setActiveBoutique] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchActiveBoutique = async () => {
      try {
        const res = await api.get("/api/boutique/active");
        setActiveBoutique(res.data);
      } catch {}
    };

    fetchActiveBoutique();
  }, [user?.activeBoutique]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  const menuItems = [
    ...(user.role === "owner"
      ? [
          { name: "Dashboard", href: "/tailor/dashboard" },
          { name: "Staffs", href: "/tailor/dashboard/staff" },
          { name: "Revenue", href: "/tailor/dashboard/revenue" },
          { name: "Settings", href: "/tailor/dashboard/boutiques" },
        ]
      : []),
    { name: "Orders", href: "/tailor/dashboard/orders" },
    { name: "Customers", href: "/tailor/dashboard/customers" },
    { name: "Smart Calendar", href: "/tailor/dashboard/calendar" },
    { name: "FAQs", href: "/tailor/dashboard/faq" },
    { name: "Privacy Policy", href: "/tailor/dashboard/policy" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-32 left-4 z-50 p-2 rounded-lg bg-white shadow"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50 top-0 left-0
          h-screen w-64 bg-white shadow-lg p-6
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close button (mobile) */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Active Boutique */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>

            <div>
              <p className="text-xs text-gray-500 font-semibold">
                Active Boutique
              </p>
              <p className="text-base font-bold text-gray-800 truncate max-w-[180px]">
                {activeBoutique?.name ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
