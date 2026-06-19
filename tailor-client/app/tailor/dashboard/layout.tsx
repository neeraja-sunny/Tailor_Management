"use client";

import Sidebar from "@/components/Sidebar";
import { OrderProvider } from "@/app/context/OrderContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Reserve space for Topbar even if hidden */}
        <div className="h-20 shrink-0" />

        <main className="p-6">
            <OrderProvider>  {children}</OrderProvider>
        
        </main>
      </div>
    </div>
  );
}
