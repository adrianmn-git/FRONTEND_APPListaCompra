"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useShoppingListItems } from "../hooks/useShoppingListItems"
import { useProduct } from "@/product/hooks/useProduct"
import { UnitType } from "../entity/ShoppingListItem"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark, faChevronDown, faScaleBalanced, faWeightHanging, faFlask, faJar, faBottleDroplet, faBox, faBasketShopping } from "@fortawesome/free-solid-svg-icons"
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect"
import { useI18n } from "@/i18n/hooks/useI18n"

const UNIT_OPTIONS: CustomSelectOption<UnitType>[] = [
  { value: 'unit', label: 'Unit', icon: faBox, color: 'bg-slate-50 text-slate-600 border-slate-100' },
  { value: 'g', label: 'g', icon: faScaleBalanced, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { value: 'kg', label: 'kg', icon: faWeightHanging, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { value: 'ml', label: 'ml', icon: faBottleDroplet, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'l', label: 'L', icon: faFlask, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
]

interface Props {
  listId: number
}

export default function AddShoppingListItemForm({ listId }: Props) {
  const { addItem } = useShoppingListItems()
  const { products, loadProducts } = useProduct()
  const { t } = useI18n()

  const [isOpen, setIsOpen] = useState(false)
  const [productId, setProductId] = useState<number | "">("")
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState<UnitType>("unit")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpen = async () => {
    setIsOpen(true)
    if (products.length === 0) await loadProducts()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (productId === "") return

    setIsLoading(true)
    try {
      await addItem({ shopping_list: listId, product: productId as number, quantity, unit })
      setProductId("")
      setQuantity(1)
      setUnit("unit")
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg active:scale-95 cursor-pointer"
      >
        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
        {t("list.add_product", { defaultValue: 'Add Product' })}
      </button>

      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in slide-in-from-bottom-4 duration-400 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t("modals.add_product", { defaultValue: 'Add Product' })}</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <CustomSelect
                label={t("modals.product_label", { defaultValue: 'Product' })}
                value={productId}
                placeholder={t("modals.product_placeholder", { defaultValue: 'Search a product...' })}
                options={products.map(p => ({
                  value: p.id,
                  label: p.name,
                  icon: faBasketShopping
                }))}
                onChange={(val) => setProductId(val as number)}
              />

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

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all cursor-pointer"
                >
                  {t("common.cancel", { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || productId === ""}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? t("common.adding", { defaultValue: 'Adding...' }) : t("common.add", { defaultValue: 'Add' })}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
