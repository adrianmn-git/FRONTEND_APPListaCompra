"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faEuroSign, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/i18n/hooks/useI18n"
import { finalPriceSchema } from "../entity/schemas"
import { ZodError } from "zod"

interface FinalPriceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (price: number) => Promise<void>
  listName: string
}

export default function FinalPriceModal({ isOpen, onClose, onConfirm, listName }: FinalPriceModalProps) {
  const { t } = useI18n()
  const [price, setPrice] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    const numPrice = parseFloat(price)

    try {
      finalPriceSchema.parse({ price: numPrice })
    } catch (err) {
      if (err instanceof ZodError) {
        const firstKey = err.issues[0].message
        setFormError(t(`validation.${firstKey}`, { defaultValue: firstKey }))
        return
      }
    }

    setIsLoading(true)
    try {
      await onConfirm(numPrice)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-white/50 backdrop-blur-xl animate-in zoom-in slide-in-from-bottom-4 duration-500 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Abstract Background Decor */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3 transition-transform hover:rotate-0 duration-500">
            <FontAwesomeIcon icon={faEuroSign} className="text-3xl" />
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-2 leading-tight">
            {t("modals.final_price_title", { defaultValue: 'Final Purchase Price' })}
          </h2>
          <p className="text-slate-500 font-medium mb-10 px-4">
            {t("modals.final_price_desc", { name: listName, defaultValue: 'Enter the total price paid for "{{name}}" to complete the purchase.' })}
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {formError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">{formError}</div>}

            <div className="relative flex flex-col items-center">
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                   <FontAwesomeIcon icon={faEuroSign} className="text-xl" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  autoFocus
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); setFormError("") }}
                  placeholder="0.00"
                  className={`w-full h-12 bg-white border-2 ${formError ? 'border-red-300 ring-4 ring-red-500/10' : 'border-slate-100'} rounded-xl pl-12 pr-4 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-lg appearance-none`}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-5 bg-slate-100/50 hover:bg-slate-100 text-slate-500 font-bold rounded-[2rem] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                {t("common.skip", { defaultValue: 'Skip' })}
              </button>
              <button
                type="submit"
                disabled={isLoading || !price}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    {t("common.save", { defaultValue: 'Save' })}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
