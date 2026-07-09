import { ReactNode } from "react";

export const metadata = {
  title: "Stitchr - Store Preview",
  description: "Preview boutique collections, custom stitching, and local fashion discovery.",
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
        <main>
          {children}
        </main>
  )
}
