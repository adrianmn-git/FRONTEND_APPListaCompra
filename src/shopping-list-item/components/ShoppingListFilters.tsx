"use client"

import React from 'react'
import { ProductCategory } from '@/product/entity/Product'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faAppleWhole, faCarrot, faDrumstickBite, faFish, faGlassWater, 
  faEgg, faBreadSlice, faBowlFood, faUtensils, faSeedling,
  faIcicles, faBoxArchive, faCookie, faCandyCane, faJar, faPepperHot,
  faOilCan, faGlassWhiskey, faWineGlass, faSoap, faBroom, faBaby,
  faPaw, faBox, faSearch, faLayerGroup, faClock, faCircleCheck
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import CustomSelect, { CustomSelectOption } from '@/components/ui/CustomSelect'
import { useI18n } from '@/i18n/hooks/useI18n'

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

  const CATEGORY_MAP: Record<string, { label: string; icon: IconDefinition; color: string }> = {
    fruit: { label: t("categories.fruit", { defaultValue: 'Fruit' }), icon: faAppleWhole, color: 'bg-red-100 text-red-700 border-red-200' },
    vegetables: { label: t("categories.fruit", { defaultValue: 'Fruit' }), icon: faCarrot, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    meat: { label: t("categories.meat", { defaultValue: 'Meat' }), icon: faDrumstickBite, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    fish: { label: t("categories.meat", { defaultValue: 'Meat' }), icon: faFish, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    dairy: { label: t("categories.dairy", { defaultValue: 'Dairy' }), icon: faGlassWater, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    eggs: { label: t("categories.dairy", { defaultValue: 'Dairy' }), icon: faEgg, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    bread: { label: t("categories.bread", { defaultValue: 'Bread' }), icon: faBreadSlice, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    cereals: { label: t("categories.canned", { defaultValue: 'Canned & Grains' }), icon: faBowlFood, color: 'bg-stone-100 text-stone-700 border-stone-200' },
    pasta_rice: { label: t("categories.canned", { defaultValue: 'Canned & Grains' }), icon: faUtensils, color: 'bg-yellow-50 text-yellow-800 border-yellow-100' },
    legumes: { label: t("categories.canned", { defaultValue: 'Canned & Grains' }), icon: faSeedling, color: 'bg-brown-100 text-brown-700 border-brown-200' },
    frozen: { label: t("categories.frozen", { defaultValue: 'Frozen' }), icon: faIcicles, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    canned: { label: t("categories.canned", { defaultValue: 'Canned & Grains' }), icon: faBoxArchive, color: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
    snacks: { label: t("categories.snacks", { defaultValue: 'Snacks' }), icon: faCookie, color: 'bg-rose-100 text-rose-700 border-rose-200' },
    sweets: { label: t("categories.sweets", { defaultValue: 'Sweets' }), icon: faCandyCane, color: 'bg-pink-100 text-pink-700 border-pink-200' },
    sauces: { label: t("categories.sauces", { defaultValue: 'Sauces' }), icon: faJar, color: 'bg-red-50 text-red-800 border-red-100' },
    spices: { label: t("categories.spices", { defaultValue: 'Spices' }), icon: faPepperHot, color: 'bg-orange-50 text-orange-800 border-orange-100' },
    oil_vinegar: { label: t("categories.oil_vinegar", { defaultValue: 'Oil & Vinegar' }), icon: faOilCan, color: 'bg-yellow-100 text-yellow-900 border-yellow-200' },
    drinks: { label: t("categories.drinks", { defaultValue: 'Drinks' }), icon: faGlassWhiskey, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    alcohol: { label: t("categories.drinks", { defaultValue: 'Drinks' }), icon: faWineGlass, color: 'bg-violet-100 text-violet-700 border-violet-200' },
    cleaning: { label: t("categories.cleaning", { defaultValue: 'Cleaning' }), icon: faBroom, color: 'bg-blue-50 text-blue-700 border-blue-100' },
    hygiene: { label: t("categories.hygiene", { defaultValue: 'Hygiene' }), icon: faSoap, color: 'bg-teal-50 text-teal-700 border-teal-100' },
    baby: { label: t("categories.baby", { defaultValue: 'Baby' }), icon: faBaby, color: 'bg-sky-100 text-sky-700 border-sky-200' },
    pets: { label: t("categories.pets", { defaultValue: 'Pets' }), icon: faPaw, color: 'bg-gray-200 text-gray-800 border-gray-300' },
    other: { label: t("categories.other", { defaultValue: 'Other' }), icon: faBox, color: 'bg-gray-100 text-gray-700 border-gray-200' },
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Status Toggle Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("filters.search_placeholder", { defaultValue: 'Search products...' })}
            className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl pl-12 pr-4 h-12 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:bg-white hover:shadow-md transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="w-full md:w-64">
          <CustomSelect
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={(val) => onStatusChange(val as any)}
          />
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between ml-2">
          <span className="text-[10px] font-black uppercase text-slate-400">{t("filters.filter_category", { defaultValue: 'Filter by category' })}</span>
          <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {t("filters.shown_count", { current: filteredCount, total: totalCount, defaultValue: `Showing {{current}} of {{total}}` })}
          </span>
        </div>
        <div className="flex flex-nowrap overflow-x-auto gap-2 pt-1 pb-2 hide-scrollbar items-center">
          <button
            onClick={onClearCategories}
            className={`px-5 py-2.5 shrink-0 rounded-2xl text-[13px] font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              selectedCategories.length === 0
                ? 'bg-slate-900 text-white'
                : 'bg-[#F8FAFC] text-slate-500 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            {t("filters.all", { defaultValue: 'All' })}
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-1 shrink-0"></div>
          
          {availableCategories.map((catKey) => {
            const cat = CATEGORY_MAP[catKey] || CATEGORY_MAP.other
            const isActive = selectedCategories.includes(catKey)
            
            const activeClasses = `${cat.color} border border-transparent z-10 scale-105`
            
            return (
              <button
                key={catKey}
                onClick={() => onToggleCategory(catKey)}
                className={`flex items-center gap-2 px-4 py-2.5 shrink-0 rounded-2xl text-[13px] font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? activeClasses
                    : 'bg-[#F8FAFC] text-slate-500 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className={isActive ? '' : 'grayscale opacity-60'}>
                  <FontAwesomeIcon icon={cat.icon} />
                </div>
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
