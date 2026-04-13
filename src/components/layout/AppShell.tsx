"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import Footer from "@/components/layout/Footer"

const AUTH_ROUTES = ["/login", "/register"]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <main className="flex-1 w-full">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 flex-grow relative pt-16 pb-20 lg:pt-0 lg:pb-0">
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
