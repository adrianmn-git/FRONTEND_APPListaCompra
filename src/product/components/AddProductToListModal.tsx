"use client"

import { useState, useEffect } from "react"
import { useShoppingListItems } from "@/shopping-list-item/hooks/useShoppingListItems"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { UnitType } from "@/shopping-list-item/entity/ShoppingListItem"
import { Product } from "@/product/entity/Product"
import CustomSelect from "@/components/ui/CustomSelect"
import { useI18n } from "@/i18n/hooks/useI18n"
import { useNotification } from "@/notifications/hooks/useNotification"
import { addProductToListSchema } from "../entity/schemas"
import { ZodError } from "zod"
import { UNIT_OPTIONS } from "@/shopping-list-item/utils/unitConfig"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Props {
  product: Product | null
  onClose: () => void
}

export default function AddProductToListModal({ product, onClose }: Props) {
  const { addItem } = useShoppingListItems()
  const { lists, getLists } = useShoppingList()
  const { t } = useI18n()
  const { success, error: showError } = useNotification()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedListIds, setSelectedListIds] = useState<number[]>([])
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState<UnitType>("unit")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setMounted(true)
      setIsLoading(false)
      getLists()
      setTimeout(() => setIsOpen(true), 10)
    } else {
      setIsOpen(false)
    }
  }, [product, getLists])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setFieldErrors({})

    if (!product) return

    try {
      addProductToListSchema.parse({ selectedListIds, quantity, unit })
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {}
        err.issues.forEach((issue) => {
          const field = issue.path[0] as string
          if (!errors[field]) errors[field] = issue.message
        })
        setFieldErrors(errors)
        const firstKey = err.issues[0].message
        setFormError(t(`validation.${firstKey}`, { defaultValue: firstKey }))
        return
      }
    }

    setIsLoading(true)
    try {
      await Promise.all(
        selectedListIds.map(listId => 
          addItem({ shopping_list: listId, product: product.id, quantity, unit })
        )
      )
      success(t("products.added_to_lists", { defaultValue: 'Product added successfully!' }))
      handleClose()
    } catch (error) {
       showError(t("products.add_error", { defaultValue: 'Error adding product to lists.' }))
       setIsLoading(false)
    }
  }

  if (!mounted || (!isOpen && !product)) return null

  const activeLists = lists?.filter(l => !l.completed) || [];

  const toggleList = (id: number) => {
    setSelectedListIds(prev => 
      prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id]
    )
    setFieldErrors(prev => ({ ...prev, selectedListIds: "" }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-slate-100 sm:rounded-[2.5rem]">
        <DialogHeader className="mb-6 text-left">
          <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
            {t("products.add_product_to", { defaultValue: 'Add to List' })}
          </DialogTitle>
          <p className="text-sm text-slate-500 font-bold mt-1 line-clamp-1">{product?.name}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">{formError}</div>}

          <div className="flex flex-col gap-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">
              {t("products.select_list", { defaultValue: 'Select active lists' })}
            </Label>
            <div className="flex flex-wrap gap-2">
              {activeLists.map(l => {
                const isSelected = selectedListIds.includes(l.id);
                return (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => toggleList(l.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 font-bold text-sm cursor-pointer",
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : cn(fieldErrors.selectedListIds ? 'border-red-200' : 'border-slate-100', 'bg-white text-slate-600 hover:border-slate-300')
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors", isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300')}>
                       {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                    {l.name}
                  </button>
                )
              })}
            </div>
            {fieldErrors.selectedListIds && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.selectedListIds}`, { defaultValue: fieldErrors.selectedListIds })}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">{t("modals.quantity_label", { defaultValue: 'Quantity' })}</Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className={cn(
                  "h-11 bg-slate-50 border-2 rounded-xl px-5 text-slate-800 font-bold transition-all shadow-sm",
                  fieldErrors.quantity ? 'border-red-300 focus-visible:ring-4 focus-visible:ring-red-500/10 focus-visible:border-red-500' : 'border-slate-100 focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-400'
                )}
              />
              {fieldErrors.quantity && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.quantity}`, { defaultValue: fieldErrors.quantity })}</p>}
            </div>

            <CustomSelect
              label={t("modals.unit_label", { defaultValue: 'Unit' })}
              value={unit}
              options={UNIT_OPTIONS.map(opt => ({
                ...opt,
                label: t(`units.${opt.value}`, { defaultValue: opt.label })
              }))}
              onChange={(val) => setUnit(val as UnitType)}
            />
          </div>

          {activeLists.length === 0 && (
             <div className="bg-amber-50 text-amber-700 text-sm font-bold p-4 rounded-xl text-center border border-amber-100 shadow-inner">
               {t("products.no_active_lists", { defaultValue: 'You have no pending shopping lists.' })}
             </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all cursor-pointer shadow-none"
            >
              {t("common.cancel", { defaultValue: 'Cancel' })}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || activeLists.length === 0}
              className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? t("common.adding", { defaultValue: 'Adding...' }) : t("common.add", { defaultValue: 'Add' })}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
