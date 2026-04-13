"use client"

import { useRouter } from "next/navigation"
import { ShoppingList } from "@/shopping-list/entity/ShoppingList"
import { useListProgress } from "@/shopping-list-item/hooks/useListProgress"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faCircleCheck, 
  faTrash, 
  faCalendarAlt, 
  faEuroSign, 
  faArrowRight, 
  faBox, 
  faShop
} from "@fortawesome/free-solid-svg-icons"
import EditShoppingListForm from "./EditShoppingListForm"
import ConfirmAlertDialog from "@/components/ui/ConfirmAlertDialog"
import { useState } from "react"
import { useI18n } from "@/i18n/hooks/useI18n"
import { getShopConfig } from "@/shopping-list/utils/shopConfig"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface ShoppingListCardProps {
  list: ShoppingList
}

export default function ShoppingListCard({ list }: ShoppingListCardProps) {
  const router = useRouter()
  const { deleteList } = useShoppingList()
  const { total, picked, isLoading } = useListProgress(list.id)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { t } = useI18n()

  const shopConfig = getShopConfig(list.shop)

  const createdDate = new Date(list.created_at).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })

  const progress = total > 0 ? (picked / total) * 100 : 0

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteList(list.id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <ConfirmAlertDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t("list.delete_title", { defaultValue: 'Delete list?' })}
        message={t("list.delete_message", { name: list.name, defaultValue: `This action cannot be undone. The list "{{name}}" and all its products will be deleted.` })}
        confirmText={t("list.delete_permanent", { defaultValue: 'Delete permanently' })}
        cancelText={t("common.cancel", { defaultValue: 'Cancel' })}
      />
      
      <Card 
        onClick={() => router.push(`/lists/${list.id}`)}
        className="group relative flex flex-row items-stretch bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer overflow-hidden h-auto w-full p-0 gap-0"
      >
        <div className={`w-2 bg-gradient-to-b ${shopConfig.gradient} shrink-0`} />

        <div className="flex items-center justify-center px-4 bg-slate-50 border-r border-slate-100 shrink-0">
           <Avatar className="w-16 h-16 rounded-xl shadow-sm ring-2 ring-white bg-white">
              {shopConfig.logoUrl ? (
                <AvatarImage src={shopConfig.logoUrl} className="object-contain p-2 mix-blend-multiply" />
              ) : null}
              <AvatarFallback className="bg-slate-100 text-slate-400">
                <FontAwesomeIcon icon={faShop} className="text-xl" />
              </AvatarFallback>
           </Avatar>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <CardHeader className="p-4 pb-1 space-y-1">
             <div className="flex items-center justify-between">
                <Badge variant="outline" className={`border-none bg-gradient-to-r ${shopConfig.gradient} text-white font-black text-[8px] uppercase tracking-wider px-2 py-0.5`}>
                  {shopConfig.label}
                </Badge>
                {list.completed && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[9px] h-5">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-1" />
                    {t("list.completed", { defaultValue: 'Completed' })}
                  </Badge>
                )}
             </div>
             <CardTitle className="text-lg font-bold text-slate-800 tracking-tight leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
               {list.name}
             </CardTitle>
             <CardDescription className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase leading-none mt-0">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500/20" />
                {createdDate}
             </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-2 pb-0 flex-1 flex flex-col justify-center gap-3">
             <div className="group/progress space-y-2">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${progress === 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-indigo-500 animate-pulse'}`} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                         {isLoading ? "..." : `${picked} / ${total} ${t("common.items", { defaultValue: 'items' })}`}
                      </span>
                   </div>
                   <div className={`text-[11px] font-black flex items-center gap-1 ${progress === 100 ? 'text-emerald-500' : 'text-slate-800'}`}>
                      {Math.round(progress)}
                      <span className="text-[8px] opacity-40">%</span>
                   </div>
                </div>

                <div className="relative h-3 w-full bg-slate-100 rounded-lg p-[3px] border border-slate-200/50 shadow-inner overflow-hidden">
                   <div className="absolute inset-[3px] flex justify-between gap-[2px] opacity-10 pointer-events-none">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-full w-full bg-slate-800 rounded-sm" />
                      ))}
                   </div>
                   
                   <div 
                     className={`h-full rounded-[4px] border-r border-white/20 transition-all duration-1000 ease-out-expo relative overflow-hidden ${
                       progress === 100 ? 'bg-emerald-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.6)]' : `bg-gradient-to-r ${shopConfig.gradient} shadow-[0_4px_12px_-4px_rgba(79,70,229,0.4)]`
                     }`}
                     style={{ width: `${progress}%` }}
                   >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-60" />
                      
                      <div className="absolute inset-0 flex justify-between gap-[2px] pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="h-full w-full border-r border-black/5" />
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </CardContent>

          <CardFooter className="p-4 pt-3 border-none bg-transparent flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                   <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <FontAwesomeIcon icon={faEuroSign} className="text-[9px]" />
                   </div>
                   {list.final_price > 0 ? list.final_price.toFixed(2) : "0.00"}€
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-500">
                   <FontAwesomeIcon icon={faBox} className="text-[10px] opacity-40" />
                   {total}
                </div>
             </div>

             <div className="flex items-center gap-2">
                <div className="flex gap-1">
                   <div onClick={e => e.stopPropagation()}>
                    <EditShoppingListForm 
                      list={list} 
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-0 flex items-center justify-center border-none shadow-none transition-colors"
                    />
                   </div>
                   <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleDelete}
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 p-0 transition-colors"
                   >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                   </Button>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </div>
             </div>
          </CardFooter>
        </div>
      </Card>
    </>
  )
}