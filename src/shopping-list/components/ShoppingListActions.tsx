"use client"

import { useState } from "react"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { ShoppingList } from "@/shopping-list/entity/ShoppingList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect"
import { useI18n } from "@/i18n/hooks/useI18n"
import { SHOP_CONFIG } from "../utils/shopConfig"
import { createShoppingListSchema } from "../entity/schemas"
import { ZodError } from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type ShopType = ShoppingList['shop']

export default function ShoppingListActions() {
  const { createList } = useShoppingList()
  const { t } = useI18n()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [shop, setShop] = useState<ShopType>("mercadona")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const SHOPS: CustomSelectOption<ShopType>[] = Object.entries(SHOP_CONFIG).map(([key, config]) => ({
    value: key as ShopType,
    label: config.label,
    icon: config.icon,
    logoUrl: config.logoUrl,
    color: `${config.bg} ${config.text} ${config.border}`
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setFieldErrors({})

    try {
      createShoppingListSchema.parse({ name: name.trim(), shop, description: description.trim() })
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
      await createList(name.trim(), shop, description.trim() || undefined)
      setName("")
      setDescription("")
      setShop("mercadona")
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field: string) =>
    cn(
      "h-11 bg-slate-50 border-2 text-slate-800 font-bold placeholder:text-slate-400 rounded-xl px-6 transition-all",
      fieldErrors[field] ? "border-red-300 focus-visible:ring-4 focus-visible:ring-red-500/10 focus-visible:border-red-500" : "border-slate-100 focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-400"
    )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm h-14 px-6 rounded-[1.5rem] transition-all duration-200 shadow-xl active:scale-95 cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
          {t("home.new_list", { defaultValue: 'New List' })}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-slate-100 sm:rounded-[2.5rem]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight text-left">
            {t("modals.create_list", { defaultValue: 'Create List' })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">{formError}</div>}

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">{t("modals.name_label", { defaultValue: 'Name' })}</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setFieldErrors(prev => ({ ...prev, name: "" })) }}
              placeholder={t("modals.name_placeholder", { defaultValue: 'Ex: Weekly Shopping' })}
              className={inputClass("name")}
            />
            {fieldErrors.name && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.name}`, { defaultValue: fieldErrors.name })}</p>}
          </div>

          <CustomSelect
            label={t("modals.shop_label", { defaultValue: 'Supermarket' })}
            value={shop}
            options={SHOPS}
            onChange={(val) => setShop(val)}
          />

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">{t("modals.description_label", { defaultValue: 'Description' })}</Label>
            <Textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setFieldErrors(prev => ({ ...prev, description: "" })) }}
              placeholder={t("modals.description_placeholder", { defaultValue: 'Add a description...' })}
              rows={3}
              maxLength={500}
              className={cn(
                "bg-slate-50 border-2 font-bold text-slate-600 placeholder:text-slate-400 px-6 py-3 rounded-xl resize-none min-h-[80px] transition-all",
                fieldErrors.description ? 'border-red-300 focus-visible:ring-4 focus-visible:ring-red-500/10 focus-visible:border-red-500' : 'border-slate-100 focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-400'
              )}
            />
            <div className="flex justify-between pr-2">
              {fieldErrors.description && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.description}`, { defaultValue: fieldErrors.description })}</p>}
              <span className={cn("text-[10px] font-black uppercase ml-auto", description.length >= 500 ? 'text-red-500' : 'text-slate-400')}>
                {description.length} / 500
              </span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all cursor-pointer shadow-none"
            >
              {t("common.cancel", { defaultValue: 'Cancel' })}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? t("common.loading", { defaultValue: 'Loading...' }) : t("modals.create_list", { defaultValue: 'Create List' })}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
