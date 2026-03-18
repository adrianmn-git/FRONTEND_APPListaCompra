"use client"

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark, faChevronDown, faAppleWhole, faDrumstickBite, faGlassWater, faBoxArchive, faIcicles, faGlassWhiskey, faBroom, faSoap, faBox } from "@fortawesome/free-solid-svg-icons"
import { useProduct } from '../hooks/useProduct'
import { ProductCategory } from '../entity/Product'
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect"
import { useI18n } from "@/i18n/hooks/useI18n"

export default function ProductActions() {
  const { addProduct } = useProduct()
  const { t } = useI18n()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProductCategory>('fruit')
  const [isLoading, setIsLoading] = useState(false)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const CATEGORIES: CustomSelectOption<ProductCategory>[] = [
    { value: 'fruit', label: t("categories.fruit", { defaultValue: 'Fruit' }), icon: faAppleWhole, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { value: 'meat', label: t("categories.meat", { defaultValue: 'Meat' }), icon: faDrumstickBite, color: 'bg-red-50 text-red-600 border-red-100' },
    { value: 'dairy', label: t("categories.dairy", { defaultValue: 'Dairy' }), icon: faGlassWater, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { value: 'canned', label: t("categories.canned", { defaultValue: 'Canned' }), icon: faBoxArchive, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { value: 'frozen', label: t("categories.frozen", { defaultValue: 'Frozen' }), icon: faIcicles, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
    { value: 'drinks', label: t("categories.drinks", { defaultValue: 'Drinks' }), icon: faGlassWhiskey, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { value: 'cleaning', label: t("categories.cleaning", { defaultValue: 'Cleaning' }), icon: faBroom, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { value: 'hygiene', label: t("categories.hygiene", { defaultValue: 'Hygiene' }), icon: faSoap, color: 'bg-teal-50 text-teal-700 border-teal-100' },
    { value: 'other', label: t("categories.other", { defaultValue: 'Other' }), icon: faBox, color: 'bg-slate-50 text-slate-600 border-slate-100' },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    setErrorLocal(null)
    try {
      await addProduct({
        name: name.trim(),
        category
      })
      setName('')
      setIsOpen(false)
    } catch (err: any) {
      setErrorLocal(err.message || t("notifications.error_create_product", { defaultValue: 'Error creating product' }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Trigger Button - More Formal Design */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full relative group overflow-hidden bg-slate-900 hover:bg-emerald-500 p-3 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex flex-col items-center text-center gap-2"
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
          <h3 className="text-white font-bold text-lg">{t("home.new_product_title", { defaultValue: 'New Product' })}</h3>
        </div>
      </button>

      {/* Modal - More Formal and Functional */}
      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in slide-in-from-bottom-4 duration-400 relative overflow-y-auto max-h-[90vh]"
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
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">{t("modals.product_name_label", { defaultValue: 'Product Name' })}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("modals.product_name_placeholder", { defaultValue: 'Ex: Apples' })}
                  required
                  className="w-full h-11 bg-slate-50 border-2 border-slate-100 rounded-xl px-6 text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                />
              </div>

              <CustomSelect
                label={t("modals.category_label", { defaultValue: 'Category' })}
                value={category}
                options={CATEGORIES}
                onChange={(val) => setCategory(val)}
              />

              {errorLocal && (
                <p className="text-red-500 text-sm font-semibold ml-1">{errorLocal}</p>
              )}

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
                  disabled={isLoading || !name.trim()}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? t("common.loading", { defaultValue: 'Loading...' }) : t("common.save", { defaultValue: 'Save' })}
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
