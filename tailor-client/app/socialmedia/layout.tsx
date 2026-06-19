import { ReactNode } from "react";

export const metadata = {
  title: 'Tailor Pro - Tailor Management',
  description:
    'Manage Social Media for customers tailor boutiques.',
}

export default function SocialLayout({ children }: { children: ReactNode }) {
  return (
        <main>
          {children}
        </main>
  )
}