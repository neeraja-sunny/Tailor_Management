import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'ALGON',
  description: 'Tailor Pro, Store, and Fashion Social Platform',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
