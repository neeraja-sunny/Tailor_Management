"use client";
import { OrderProvider } from "@/app/context/OrderContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>;
}
