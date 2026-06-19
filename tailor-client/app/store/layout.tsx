import { ReactNode } from "react";

export const metadata = {
  title: 'Tailor Pro - Tailor Management',
  description:
    'Manage customers, orders, calendar and invoices for tailor boutiques.',
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
        <main>
          {children}
        </main>
  )
}