"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faBasketShopping, 
  faHouse, 
  faListUl, 
  faChartPie, 
  faCameraRetro,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/i18n/hooks/useI18n"
import LanguageSelector from "@/i18n/components/LanguageSelector"
import { UserMenu } from "@/auth/components/UserMenu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/auth/hooks/useAuth"

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: t("nav.home", { defaultValue: 'Home' }), href: "/", icon: faHouse },
    { name: t("nav.catalog", { defaultValue: 'Catalog' }), href: "/products", icon: faListUl },
    { name: t("nav.scan", { defaultValue: 'Scan' }), href: "/scan", icon: faCameraRetro },
    { name: t("nav.stats", { defaultValue: 'Stats' }), href: "/stats", icon: faChartPie },
  ]

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside 
        className={`hidden lg:flex flex-col sticky top-0 h-screen bg-white/70 backdrop-blur-xl border-r border-slate-200 shadow-2xl z-50 transition-all duration-300 ease-in-out shrink-0 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 h-20 border-b border-slate-100/50 relative">
          <Link href="/" className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform duration-300">
              <FontAwesomeIcon icon={faBasketShopping} className="text-white text-lg" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-black text-slate-800 tracking-tight whitespace-nowrap">
                Lista<span className="text-indigo-600">Compra</span>
              </span>
            )}
          </Link>
          
          {/* Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-colors"
          >
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} className="text-xs" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-2 sidebar-scroll">
          {user && navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`flex items-center justify-center ${isCollapsed ? '' : 'w-6'}`}>
                  <FontAwesomeIcon icon={item.icon} className={`text-lg ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                </div>
                {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* Footer Settings Area */}
        <div className="p-3 border-t border-slate-100/50 flex flex-col gap-3">
          {/* Language Selector */}
          <div className={`flex justify-center ${isCollapsed ? '' : 'px-1'}`}>
            <LanguageSelector variant="header" compact={isCollapsed} align="left" />
          </div>

          {/* User Section */}
          {user ? (
            <div className={`flex items-center gap-3 rounded-2xl p-2.5 bg-indigo-50/50 border border-indigo-100/50 transition-all hover:bg-indigo-50 ${isCollapsed ? 'justify-center' : ''}`}>
              <UserMenu />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 pr-1">
                  <span className="text-[13px] font-black text-slate-900 truncate leading-tight">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-500/70 truncate uppercase tracking-tighter">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className={`flex ${isCollapsed ? 'justify-center px-1' : ''}`}>
              <UserMenu />
            </div>
          )}

          {!isCollapsed && (
            <div className="text-center mt-1">
              <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">
                {t("common.version", { defaultValue: 'Version' })} 0.5
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE UI */}
      <div className="lg:hidden flex flex-col z-50">
        {/* Mobile Top Bar */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200 z-50 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-xl">
              <FontAwesomeIcon icon={faBasketShopping} className="text-white text-sm" />
            </div>
            <span className="text-lg font-black text-slate-800 tracking-tight">
              Lista<span className="text-indigo-600">Compra</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
             <LanguageSelector variant="header" />
             <UserMenu />
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        {user && (
          <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 pb-safe">
            <div className="flex items-center justify-around h-full px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                      isActive ? "text-indigo-600" : "text-slate-400"
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className={`text-lg ${isActive ? "mb-0.5 scale-110 transition-transform" : ""}`} />
                    <span className="text-[10px] font-bold">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </>
  )
}
