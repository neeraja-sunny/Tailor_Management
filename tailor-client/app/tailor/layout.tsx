import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Tailor Pro - Tailor Management',
  description:
    'Manage customers, orders, calendar and invoices for tailor boutiques.',
}

export default function TailorLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Header />
        <main className="min-h-screen">
          {children}
        </main>
      <Footer />
    </AuthProvider>
  )
}