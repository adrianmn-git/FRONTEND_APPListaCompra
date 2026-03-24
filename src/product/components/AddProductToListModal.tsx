"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useShoppingListItems } from "@/shopping-list-item/hooks/useShoppingListItems"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { UnitType } from "@/shopping-list-item/entity/ShoppingListItem"
import { Product } from "@/product/entity/Product"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faScaleBalanced, faWeightHanging, faFlask, faBottleDroplet, faBox, faListCheck } from "@fortawesome/free-solid-svg-icons"
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect"
import { useI18n } from "@/i18n/hooks/useI18n"
import { useNotification } from "@/notifications/hooks/useNotification"

const UNIT_OPTIONS: CustomSelectOption<UnitType>[] = [
  { value: 'unit', label: 'Unit', icon: faBox, color: 'bg-slate-50 text-slate-600 border-slate-100' },
  { value: 'g', label: 'g', icon: faScaleBalanced, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { value: 'kg', label: 'kg', icon: faWeightHanging, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { value: 'ml', label: 'ml', icon: faBottleDroplet, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'l', label: 'L', icon: faFlask, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
]

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

  // Sync animation open state with prop changes
  useEffect(() => {
    if (product) {
      setMounted(true)
      setIsLoading(false)
      getLists() // ensure we have updated lists
      // Small timeout for intro animation
      setTimeout(() => setIsOpen(true), 10)
    } else {
      setIsOpen(false)
    }
  }, [product, getLists])

  // Handle exiting animation cleanly
  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => onClose(), 300) // matches duration of fade out
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || selectedListIds.length === 0) return

    setIsLoading(true)
    try {
      // Add item to all selected lists concurrently
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

  // Ensure active lists exist
  const activeLists = lists?.filter(l => !l.completed) || [];

  const toggleList = (id: number) => {
    setSelectedListIds(prev => 
      prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id]
    )
  }

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-slate-100 relative overflow-y-auto max-h-[90vh] transition-all transform duration-400 ease-out-expo ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
             <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{t("products.add_product_to", { defaultValue: 'Add to List' })}</h2>
             <p className="text-sm text-slate-500 font-bold mt-1 line-clamp-1">{product?.name}</p>
          </div>
          <button 
            onClick={handleClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-xl cursor-pointer shrink-0"
          >
            <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">
              {t("products.select_list", { defaultValue: 'Select active lists' })}
            </label>
            <div className="flex flex-wrap gap-2">
              {activeLists.map(l => {
                const isSelected = selectedListIds.includes(l.id);
                return (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => toggleList(l.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 font-bold text-sm cursor-pointer ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                       {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                    {l.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">{t("modals.quantity_label", { defaultValue: 'Quantity' })}</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full h-11 bg-slate-50 border-2 border-slate-100 rounded-xl px-5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
              />
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
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all cursor-pointer"
            >
              {t("common.cancel", { defaultValue: 'Cancel' })}
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedListIds.length === 0 || activeLists.length === 0}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? t("common.adding", { defaultValue: 'Adding...' }) : t("common.add", { defaultValue: 'Add' })}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
