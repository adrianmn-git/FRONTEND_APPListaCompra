"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBasketShopping, faHouse, faListUl, faChartPie, faCameraRetro } from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/i18n/hooks/useI18n"
import LanguageSelector from "@/i18n/components/LanguageSelector"
import { UserMenu } from "@/auth/components/UserMenu"

import { useAuth } from "@/auth/hooks/useAuth"

export default function Header() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { user } = useAuth()

  const navItems = [
    { name: t("nav.home", { defaultValue: 'Home' }), href: "/", icon: faHouse },
    { name: t("nav.catalog", { defaultValue: 'Catalog' }), href: "/products", icon: faListUl },
    { name: t("nav.scan", { defaultValue: 'Scan' }), href: "/scan", icon: faCameraRetro },
    { name: t("nav.stats", { defaultValue: 'Stats' }), href: "/stats", icon: faChartPie },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <nav className="flex items-center justify-between w-full max-w-7xl px-8 py-3.5 bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-2xl shadow-slate-200/50">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
            <FontAwesomeIcon icon={faBasketShopping} className="text-white text-lg" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
            Lista<span className="text-indigo-600 group-hover:text-slate-800">Compra</span>
          </span>
        </Link>

        {/* Navigation Links */}
        {user && (
          <div className="flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className={`text-base ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <LanguageSelector variant="header" />
          <UserMenu />
          <div className="hidden lg:block text-right">
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">
              {t("common.version", { defaultValue: 'Version' })} 0.5
            </span>
          </div>
        </div>
      </nav>
    </header>
  )
}
