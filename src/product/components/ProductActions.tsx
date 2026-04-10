"use client"

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useProduct } from '../hooks/useProduct'
import { ProductCategory } from '../entity/Product'
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect"
import { useI18n } from "@/i18n/hooks/useI18n"
import { CATEGORY_CONFIG } from "../utils/categoryConfig"
import { createProductSchema } from "../entity/schemas"
import { ZodError } from "zod"

interface Props {
  variant?: 'vertical' | 'horizontal'
}

export default function ProductActions({ variant = 'vertical' }: Props) {
  const { addProduct } = useProduct()
  const { t } = useI18n()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProductCategory>('fruit')
  const [isLoading, setIsLoading] = useState(false)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)

  const CATEGORIES: CustomSelectOption<ProductCategory>[] = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
    value: key as ProductCategory,
    label: t(config.i18nKey, { defaultValue: config.defaultLabel }),
    icon: config.icon,
    color: `${config.bg} ${config.text} ${config.border}`
  }))

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorLocal(null)
    setFieldErrors({})

    try {
      createProductSchema.parse({ name: name.trim(), category })
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {}
        err.issues.forEach((issue) => {
          const field = issue.path[0] as string
          if (!errors[field]) errors[field] = issue.message
        })
        setFieldErrors(errors)
        const firstKey = err.issues[0].message
        setErrorLocal(t(`validation.${firstKey}`, { defaultValue: firstKey }))
        return
      }
    }

    setIsLoading(true)
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
      {/* Trigger Button */}
      {variant === 'vertical' ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full relative group overflow-hidden bg-slate-900 hover:bg-emerald-500 p-3 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex flex-col items-center text-center gap-2"
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
            <h3 className="text-white font-bold text-lg">{t("home.new_product_title", { defaultValue: 'New Product' })}</h3>
          </div>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-4 rounded-[1.5rem] transition-all duration-200 shadow-xl active:scale-95 cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
          {t("home.new_product_title", { defaultValue: 'New Product' })}
        </button>
      )}

      {/* Modal */}
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
              {errorLocal && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">{errorLocal}</div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">{t("modals.product_name_label", { defaultValue: 'Product Name' })}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: "" })) }}
                  placeholder={t("modals.product_name_placeholder", { defaultValue: 'Ex: Apples' })}
                  className={`w-full h-11 bg-slate-50 border-2 ${fieldErrors.name ? 'border-red-300 ring-4 ring-red-500/10' : 'border-slate-100'} rounded-xl px-6 text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all`}
                />
                {fieldErrors.name && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.name}`, { defaultValue: fieldErrors.name })}</p>}
              </div>

              <CustomSelect
                label={t("modals.category_label", { defaultValue: 'Category' })}
                value={category}
                options={CATEGORIES}
                onChange={(val) => setCategory(val)}
              />

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
                  disabled={isLoading}
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
