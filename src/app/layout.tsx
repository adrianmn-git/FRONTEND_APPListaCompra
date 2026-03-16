import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ShoppingListProvider } from "@/shopping-list/contexts/ShoppingListContext"
import { ShoppingListItemsProvider } from "@/shopping-list-item/contexts/ShoppingListItemsContext"
import { ProductProvider } from "@/product/contexts/ProductContext"
import FloatingBackground from "@/components/ui/FloatingBackground"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"

import NotificationContainer from "@/notifications/components/NotificationContainer"
import { NotificationProvider } from "@/notifications/contexts/NotificationContext"

config.autoAddCss = false

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Lista de la compra",
  description: "Gestiona tus listas de la compra de forma sencilla",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className={`${poppins.className} relative bg-slate-50 min-h-screen antialiased`}>
        <FloatingBackground />
        <NotificationProvider>
          <NotificationContainer />
          <Header />
          <main className="pt-24 min-h-[calc(100vh-80px)]">
            <ShoppingListProvider>
              <ProductProvider>
                <ShoppingListItemsProvider>
                  {children}
                </ShoppingListItemsProvider>
              </ProductProvider>
            </ShoppingListProvider>
          </main>
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  )
}