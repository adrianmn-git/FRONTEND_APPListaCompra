"use client"

import { useRouter } from "next/navigation"
import { ShoppingList } from "@/shopping-list/entity/ShoppingList"
import { useListProgress } from "@/shopping-list-item/hooks/useListProgress"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTrash, faCalendarAlt, faStore, faArrowRight, faEuroSign, faCartShopping, faBuilding, faTruck, faBasketShopping } from "@fortawesome/free-solid-svg-icons"
import EditShoppingListForm from "./EditShoppingListForm"
import ConfirmModal from "@/components/ui/ConfirmModal"
import { useState } from "react"
import { useI18n } from "@/i18n/hooks/useI18n"

const SHOP_THEMES: Record<string, { label: string; icon: any; gradient: string; text: string; light: string; shadow: string; hoverText: string; hoverBorder: string; accent: string }> = {
// ... existing themes
  mercadona: {
    label: "Mercadona",
    icon: faCartShopping,
    gradient: "from-emerald-500 to-green-600",
    text: "text-emerald-700",
    light: "bg-emerald-50 text-emerald-600",
    shadow: "shadow-emerald-100/50",
    hoverText: "group-hover:text-emerald-600",
    hoverBorder: "group-hover:border-emerald-100",
    accent: "text-emerald-400"
  },
  alcampo: {
    label: "Alcampo",
    icon: faStore,
    gradient: "from-rose-500 to-red-600",
    text: "text-rose-700",
    light: "bg-rose-50 text-rose-600",
    shadow: "shadow-rose-100/50",
    hoverText: "group-hover:text-rose-600",
    hoverBorder: "group-hover:border-rose-100",
    accent: "text-rose-400"
  },
  sorli: {
    label: "Sorli",
    icon: faBuilding,
    gradient: "from-blue-500 to-indigo-600",
    text: "text-blue-700",
    light: "bg-blue-50 text-blue-600",
    shadow: "shadow-blue-100/50",
    hoverText: "group-hover:text-blue-600",
    hoverBorder: "group-hover:border-blue-100",
    accent: "text-blue-400"
  },
  esclat: {
    label: "Esclat",
    icon: faStore,
    gradient: "from-red-500 to-orange-600",
    text: "text-red-700",
    light: "bg-red-50 text-red-600",
    shadow: "shadow-red-100/50",
    hoverText: "group-hover:text-red-600",
    hoverBorder: "group-hover:border-red-100",
    accent: "text-red-400"
  },
  bonpreusa: {
    label: "Bonpreu",
    icon: faStore,
    gradient: "from-amber-400 to-orange-500",
    text: "text-amber-700",
    light: "bg-amber-50 text-amber-600",
    shadow: "shadow-amber-100/50",
    hoverText: "group-hover:text-amber-600",
    hoverBorder: "group-hover:border-amber-100",
    accent: "text-amber-400"
  },
  caprabo: {
    label: "Caprabo",
    icon: faBasketShopping,
    gradient: "from-indigo-500 to-blue-700",
    text: "text-indigo-700",
    light: "bg-indigo-50 text-indigo-600",
    shadow: "shadow-indigo-100/50",
    hoverText: "group-hover:text-indigo-600",
    hoverBorder: "group-hover:border-indigo-100",
    accent: "text-indigo-400"
  },
  carrefour: {
    label: "Carrefour",
    icon: faTruck,
    gradient: "from-sky-500 to-blue-600",
    text: "text-sky-700",
    light: "bg-sky-50 text-sky-600",
    shadow: "shadow-sky-100/50",
    hoverText: "group-hover:text-sky-600",
    hoverBorder: "group-hover:border-sky-100",
    accent: "text-sky-400"
  },
}

const DEFAULT_THEME = {
  label: "Supermercado",
  icon: faStore,
  gradient: "from-slate-500 to-slate-600",
  text: "text-slate-700",
  light: "bg-slate-50 text-slate-600",
  shadow: "shadow-slate-100/50",
  hoverText: "group-hover:text-indigo-600",
  hoverBorder: "group-hover:border-indigo-100",
  accent: "text-indigo-400"
}

interface ShoppingListCardProps {
  list: ShoppingList
}

export default function ShoppingListCard({ list }: ShoppingListCardProps) {
  const router = useRouter()
  const { deleteList } = useShoppingList()
  const { total, picked, isLoading } = useListProgress(list.id)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { t } = useI18n()

  const theme = SHOP_THEMES[list.shop] || DEFAULT_THEME

  const createdDate = new Date(list.created_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  })

  const progress = total > 0 ? (picked / total) * 100 : 0

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteList(list.id)
    } catch (error) {
      // El error ya lo gestiona el context con un toast
    }
  }

  return (
    <>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t("list.delete_title", { defaultValue: 'Delete list?' })}
        message={t("list.delete_message", { name: list.name, defaultValue: `This action cannot be undone. The list "{{name}}" and all its products will be deleted.` })}
        confirmText={t("list.delete_permanent", { defaultValue: 'Delete permanently' })}
        cancelText={t("common.cancel", { defaultValue: 'Cancel' })}
      />
      <div 
        onClick={() => router.push(`/lists/${list.id}`)} 
      className={`group relative bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl border border-white transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-1 ${theme.hoverBorder}`}
    >
      {/* SHOP STRIP (Full Width) */}
      <div className={`w-full bg-gradient-to-r ${theme.gradient} px-6 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white/90">
          <FontAwesomeIcon icon={theme.icon} className="text-[10px]" />
          <span className="text-[10px] font-black uppercase tracking-widest">{theme.label}</span>
        </div>
        {list.completed && (
          <div className="flex items-center gap-1.5 text-white bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/30 text-[9px] font-black uppercase">
            <FontAwesomeIcon icon={faCheck} />
            {t("list.completed", { defaultValue: 'Completed' })}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className={`text-xl font-black text-slate-800 tracking-tight transition-colors truncate ${theme.hoverText}`}>
                  {list.name}
                </h2>
                {list.final_price > 0 && (
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1 rounded-xl text-xs font-black shadow-lg border border-emerald-400 transform group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faEuroSign} className="text-[10px]" />
                    {list.final_price.toFixed(2)}
                  </div>
                )}
              </div>
              
              {list.description && (
                <p className="text-[10px] font-medium text-slate-500 line-clamp-2 mt-0.5 leading-relaxed opacity-80">
                  {list.description}
                </p>
              )}
  
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="opacity-50" />
                <span>{createdDate}</span>
              </div>
            </div>

          <div className="flex gap-2">
            <EditShoppingListForm 
              list={list} 
              className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-white text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 active:scale-90 border border-slate-50 hover:border-indigo-100"
            />
            <button 
              onClick={handleDelete}
              aria-label={t("list.delete_title", { defaultValue: 'Delete list?' })}
              className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300 active:scale-90 border border-slate-50 hover:border-red-100"
            >
              <FontAwesomeIcon icon={faTrash} className="text-sm" />
            </button>
          </div>
        </div>

        {/* PROGRESS SECTION (Compact) */}
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group-hover:bg-white transition-colors duration-500">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-black ${isLoading ? 'animate-pulse text-slate-400' : 'text-slate-500'}`}>
              {isLoading ? t("common.loading", { defaultValue: 'Loading...' }) : `${picked}/${total} ${t("list.items_count", { defaultValue: 'Products' })}`}
            </span>
            <div className="flex items-end gap-1">
              <span className={`text-lg font-black ${progress === 100 ? 'text-emerald-500' : theme.text.replace('text-', 'text-')}`}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/30">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full relative ${
                progress === 100 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                  : `bg-gradient-to-r ${theme.gradient} shadow-sm`
              }`}
              style={{ width: `${isLoading ? 0 : progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-40"></div>
            </div>
          </div>
        </div>

        {/* COMPACT FOOTER */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-[9px] font-black uppercase text-slate-300 tracking-wider">{t("list.view_details", { defaultValue: 'View list details' })}</span>
          <FontAwesomeIcon icon={faArrowRight} className={`${theme.accent} text-xs`} />
        </div>
      </div>
    </div>
  </>
  )
}