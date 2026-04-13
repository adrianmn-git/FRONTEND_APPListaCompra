"use client"

import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faLayerGroup, faClock, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import CustomSelect, { CustomSelectOption } from '@/components/ui/CustomSelect'
import { useI18n } from '@/i18n/hooks/useI18n'
import { Input } from '@/components/ui/input'
import { CATEGORY_CONFIG, getCategoryIcon, getCategoryLabel, getCategoryColor } from '@/product/utils/categoryConfig'
import { ProductCategory } from '@/product/entity/Product'

interface Props {
  searchTerm: string
  onSearchChange: (val: string) => void
  selectedCategories: string[]
  onToggleCategory: (cat: string) => void
  onClearCategories: () => void
  statusFilter: 'all' | 'pending' | 'collected'
  onStatusChange: (status: 'all' | 'pending' | 'collected') => void
  totalCount: number
  filteredCount: number
  availableCategories: string[]
}

export default function ShoppingListFilters({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  statusFilter,
  onStatusChange,
  totalCount,
  filteredCount,
  availableCategories
}: Props) {
  const { t } = useI18n()

  const STATUS_OPTIONS: CustomSelectOption<string>[] = [
    { value: 'all', label: t("filters.all", { defaultValue: 'All' }), icon: faLayerGroup, color: 'bg-indigo-50 text-indigo-600' },
    { value: 'pending', label: t("filters.pending", { defaultValue: 'Pending' }), icon: faClock, color: 'bg-amber-50 text-amber-600' },
    { value: 'collected', label: t("filters.collected", { defaultValue: 'Collected' }), icon: faCircleCheck, color: 'bg-emerald-50 text-emerald-600' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Status Toggle Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
            <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
          </div>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("filters.search_placeholder", { defaultValue: 'Search products...' })}
            className="w-full bg-white/50 border border-slate-200 rounded-2xl pl-11 pr-4 h-11 text-[13px] font-bold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/10 hover:bg-white hover:border-slate-300 transition-all placeholder:text-slate-300 placeholder:font-semibold"
          />
        </div>

        <div className="w-full md:w-56 shrink-0">
          <CustomSelect
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={(val) => onStatusChange(val as any)}
          />
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">{t("filters.filter_category", { defaultValue: 'Categories' })}</span>
          <span className="text-[9px] font-black uppercase text-slate-400/60 transition-opacity">
            {t("filters.shown_count", { current: filteredCount, total: totalCount, defaultValue: `{{current}} / {{total}}` })}
          </span>
        </div>
        <div className="flex flex-nowrap overflow-x-auto gap-1.5 pt-0.5 pb-2 hide-scrollbar items-center">
          <button
            onClick={onClearCategories}
            className={`px-4 py-2 shrink-0 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              selectedCategories.length === 0
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-200/60'
            }`}
          >
            {t("filters.all", { defaultValue: 'All' })}
          </button>
          
          <div className="h-4 w-px bg-slate-200 mx-0.5 shrink-0"></div>
          
          {availableCategories.map((catKey) => {
            const catColor = getCategoryColor(catKey)
            const isActive = selectedCategories.includes(catKey)
            
            return (
              <button
                key={catKey}
                onClick={() => onToggleCategory(catKey)}
                className={`flex items-center gap-2 px-4 py-2 shrink-0 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `${catColor} text-white shadow-lg border-transparent`
                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-200/60'
                }`}
              >
                <FontAwesomeIcon icon={getCategoryIcon(catKey)} className={isActive ? 'text-[10px]' : 'text-[10px] opacity-40'} />
                {getCategoryLabel(catKey, t)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
