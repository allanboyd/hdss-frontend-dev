import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "A-SEARCH Dashboard",
  description: "Population and health data analytics platform",
  icons: {
    icon: '/images/aphrc32x32.png',
    shortcut: '/images/aphrc32x32.png',
    apple: '/images/aphrc180x180.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito.className} ${nunito.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
