"use client"

import { useRouter } from "next/navigation"
import { ShoppingList } from "@/shopping-list/entity/ShoppingList"
import { useListProgress } from "@/shopping-list-item/hooks/useListProgress"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTrash, faCalendarAlt, faStore, faArrowRight, faEuroSign, faCartShopping, faBuilding, faTruck, faBasketShopping, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import EditShoppingListForm from "./EditShoppingListForm"
import ConfirmModal from "@/components/ui/ConfirmModal"
import { useState } from "react"
import { useI18n } from "@/i18n/hooks/useI18n"
import { SHOP_CONFIG } from "@/shopping-list/utils/shopConfig"

const SHOP_COLORS: Record<string, string> = {
  mercadona: '#10b981',
  alcampo: '#ef4444',
  sorli: '#3b82f6',
  esclat: '#f97316',
  bonpreusa: '#f59e0b',
  caprabo: '#6366f1',
  carrefour: '#0ea5e9',
}

const SHOP_THEMES: Record<string, { label: string; icon: any; gradient: string }> = {
  mercadona: { label: "Mercadona", icon: faCartShopping, gradient: "from-emerald-400 to-green-600" },
  alcampo: { label: "Alcampo", icon: faStore, gradient: "from-rose-500 to-red-600" },
  sorli: { label: "Sorli", icon: faBuilding, gradient: "from-blue-500 to-indigo-600" },
  esclat: { label: "Esclat", icon: faStore, gradient: "from-red-500 to-orange-600" },
  bonpreusa: { label: "Bonpreu", icon: faStore, gradient: "from-amber-400 to-orange-500" },
  caprabo: { label: "Caprabo", icon: faBasketShopping, gradient: "from-indigo-500 to-blue-700" },
  carrefour: { label: "Carrefour", icon: faTruck, gradient: "from-sky-400 to-blue-600" },
}

const DEFAULT_THEME = {
  label: "Supermercado",
  icon: faStore,
  gradient: "from-slate-400 to-slate-600",
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

  // Calculate circle stroke length for progress
  const progress = total > 0 ? (picked / total) * 100 : 0
  const circumference = 2 * Math.PI * 36; // r=36
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteList(list.id)
    } catch (error) {
      // toast handles the error
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
        className="group relative shadow-2xl shadow-slate-200/50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-[2.5rem] bg-white ring-1 ring-slate-900/5 hover:ring-slate-900/10 cursor-pointer overflow-hidden transform hover:-translate-y-2 hover:scale-[1.01] transition-all duration-700 ease-out h-full flex flex-col"
      >
        {/* Dynamic Abstract Glow Background */}
        <div className={`absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br ${theme.gradient} opacity-[0.08] blur-[80px] rounded-full group-hover:scale-150 group-hover:opacity-[0.15] transition-all duration-[1.5s] ease-out pointer-events-none z-0`}></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>

        {/* Completed Glow Header Line */}
        {list.completed && (
           <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-300 via-emerald-400 to-green-500 shadow-[0_4px_15px_rgba(16,185,129,0.4)] z-20" />
        )}

        {/* Hover Info Icon Hint (Moved to bottom left to avoid overlap) */}
        <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-30 pointer-events-none">
           <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-2xl ring-1 ring-slate-900/5 flex items-center gap-2 border border-white/20">
             <FontAwesomeIcon icon={faCircleInfo} className="text-indigo-500 text-sm animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{t("list.view_details", { defaultValue: 'View details' })}</span>
           </div>
        </div>

        <div className="p-7 md:p-8 flex flex-col h-full relative z-10 gap-6">
          
          {/* Header Row: Badge & Actions */}
          <div className="flex justify-between items-start">
             
             {/* Authentic Premium SVG Badge */}
             <div className="relative group/badge">
               <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} rounded-[1.2rem] blur-md opacity-30 group-hover/badge:opacity-60 transition-opacity duration-500`}></div>
               <div className={`relative w-16 h-16 bg-gradient-to-br ${theme.gradient} p-[1px] rounded-[1.2rem] shadow-sm transform group-hover:rotate-[8deg] group-hover:scale-110 transition-transform duration-500 ease-out-back`}>
                 <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-[1.1rem] flex items-center justify-center overflow-hidden">
                   {SHOP_CONFIG[list.shop as keyof typeof SHOP_CONFIG]?.logoUrl ? (
                     <img src={SHOP_CONFIG[list.shop as keyof typeof SHOP_CONFIG].logoUrl} alt={theme.label} className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-700 group-hover/badge:scale-110" />
                   ) : (
                     <FontAwesomeIcon icon={theme.icon} className="text-2xl text-slate-400" />
                   )}
                 </div>
               </div>
             </div>

             {/* Hover Floating Actions & Status */}
             <div className="flex items-center justify-end flex-grow relative h-10">
               {list.completed && (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-black shadow-sm ring-1 ring-inset ring-emerald-500/20 absolute right-0 transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-2">
                    <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                    <span>{t("list.completed", { defaultValue: 'Completed' })}</span>
                  </div>
               )}
               <div className="flex gap-1.5 bg-white/90 backdrop-blur-md px-2 py-2 rounded-full shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out-back absolute right-0">
                 <div onClick={e => e.stopPropagation()}>
                   <EditShoppingListForm 
                     list={list} 
                     className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm active:scale-95" 
                   />
                 </div>
                 <button 
                   onClick={handleDelete}
                   aria-label={t("list.delete_title", { defaultValue: 'Delete list?' })}
                   className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm active:scale-95"
                 >
                   <FontAwesomeIcon icon={faTrash} className="text-sm" />
                 </button>
               </div>
             </div>
          </div>

          {/* Body: Title & Description */}
          <div className="flex-grow flex flex-col justify-center gap-2 z-20">
            <h2 className="text-[1.8rem] font-black text-slate-800 tracking-[-0.03em] leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-indigo-600 transition-all duration-500 line-clamp-2">
              {list.name}
            </h2>
            {list.description && (
               <p className="text-sm font-semibold text-slate-500 leading-relaxed line-clamp-2 opacity-90 mt-1">
                 {list.description}
               </p>
            )}
          </div>

          {/* Footer Metadata & Beautiful Graph */}
          <div className="flex items-end justify-between mt-auto pt-5">
             <div className="flex flex-col gap-2 relative z-20">
               <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-slate-300" />
                  {createdDate}
               </div>
               {list.final_price > 0 && (
                  <div className="flex items-center gap-2 text-sm font-black text-slate-700 mt-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-100/50 flex items-center justify-center ring-1 ring-emerald-500/20">
                      <FontAwesomeIcon icon={faEuroSign} className="text-emerald-500 text-[10px]" />
                    </div>
                    {list.final_price.toFixed(2)}
                  </div>
               )}
             </div>

             {/* Minimalist SVG Gauge */}
             <div className="relative w-16 h-16 flex items-center justify-center right-0 transition-transform duration-[800ms] ease-out-expo group-hover:scale-110">
               <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                 {/* Background Track */}
                 <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="6" fill="none" />
                 {/* Progress Stroke */}
                 <circle cx="50" cy="50" r="40" className="stroke-current transition-all duration-[1.5s] ease-out fill-none drop-shadow-sm" 
                   strokeWidth="6" strokeDasharray={251.2} strokeDashoffset={isLoading ? 251.2 : 251.2 - (progress/100)*251.2} strokeLinecap="round" 
                   style={{ color: progress === 100 ? '#10b981' : SHOP_COLORS[list.shop] || '#6366f1' }}
                 />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center flex-col z-10 transition-transform duration-500 group-hover:scale-110">
                  <span className={`text-[11px] font-black tracking-tighter ${progress === 100 ? 'text-emerald-500 drop-shadow-sm' : 'text-slate-700'}`}>
                    {isLoading ? "" : `${Math.round(progress)}%`}
                  </span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </>
  )
}