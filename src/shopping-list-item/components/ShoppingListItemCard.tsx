"use client"

import React from 'react'
import { ShoppingListItem } from '../entity/ShoppingListItem'
import { useShoppingListItems } from '../hooks/useShoppingListItems'
import { useProduct } from '@/product/hooks/useProduct'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faMinus, faPlus, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useI18n } from '@/i18n/hooks/useI18n'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UNIT_CONFIG, getUnitLabel } from '../utils/unitConfig'
import { getCategoryIcon, getCategoryLabel } from '@/product/utils/categoryConfig'

interface Props {
  item: ShoppingListItem
  disabled?: boolean
}

export default function ShoppingListItemCard({ item, disabled = false }: Props) {
  const { updateItem, removeItem } = useShoppingListItems()
  const { products } = useProduct()
  const { t } = useI18n()

  const unitTheme = UNIT_CONFIG[item.unit]


  // Resolve product info if the API only returns an ID or if info is missing
  const productInfo = typeof item.product === 'object' && item.product !== null
    ? item.product
    : products.find(p => p.id === (item.product as any))

  const togglePickedUp = (e: React.MouseEvent) => {
    if (disabled) return
    const target = e.target as HTMLElement
    if (target.closest('.item-controls')) return
    updateItem(item.id, { picked_up: !item.picked_up })
  }

  const handleQuantityChange = (amount: number) => {
    const newQty = Math.max(1, item.quantity + amount)
    if (newQty !== item.quantity) {
      updateItem(item.id, { quantity: newQty })
    }
  }

  return (
    <div
      onClick={togglePickedUp}
      className={`w-full group relative flex flex-row items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 cursor-pointer select-none overflow-hidden border ${
        item.picked_up 
          ? 'bg-slate-50/50 border-transparent opacity-60' 
          : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 active:scale-[0.99]'
      }`}
    >
      {/* 1. Category Icon */}
      <div className="shrink-0 transition-all flex items-center">
        <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${item.picked_up
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
          : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
          <FontAwesomeIcon 
            icon={item.picked_up ? faCheck : getCategoryIcon(productInfo?.category || '')} 
            className="text-[14px]"
          />
        </div>
      </div>

      {/* 2. Product Info (Name & Category) */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className={`font-black text-sm transition-all duration-200 truncate ${item.picked_up ? 'text-slate-400 line-through' : 'text-slate-800'
          }`}>
          {productInfo?.name ? productInfo.name.charAt(0).toUpperCase() + productInfo.name.slice(1) : t("common.loading", { defaultValue: 'Loading...' })}
        </span>
        {productInfo?.category && (
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
            {getCategoryLabel(productInfo.category, t)}
          </span>
        )}
      </div>

      {/* 3. Quantity Display */}
      <div className="shrink-0">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all ${unitTheme?.color || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
          <span>
            {item.quantity} {getUnitLabel(item.unit, t)}
          </span>
        </div>
      </div>

      {/* Controls Container (Quantity & Delete) */}
      <div className="item-controls flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* 4. Quantity Selector */}
        {!disabled && (
          <div className="flex items-center gap-0.5 bg-slate-50/80 rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={item.picked_up || item.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-20 transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faMinus} className="text-[8px]" />
            </button>

            <button
              onClick={() => handleQuantityChange(1)}
              disabled={item.picked_up}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-20 transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[8px]" />
            </button>
          </div>
        )}

        {/* 5. Delete Button */}
        {!disabled && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all duration-300 cursor-pointer p-0"
              >
                <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="font-bold text-[10px] text-red-500 uppercase tracking-widest">{t("common.delete", { defaultValue: 'Delete' })}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

