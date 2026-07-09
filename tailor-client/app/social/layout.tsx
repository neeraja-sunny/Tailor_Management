import { ReactNode } from "react";

export const metadata = {
  title: "Loomiz - Social Preview",
  description: "Preview fashion discovery, reels, saved looks, and boutique inspiration.",
}

export default function SocialLayout({ children }: { children: ReactNode }) {
  return (
        <main>
          {children}
        </main>
  )
}
