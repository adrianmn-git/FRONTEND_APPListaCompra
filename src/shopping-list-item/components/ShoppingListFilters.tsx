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

const STATUS_OPTIONS: CustomSelectOption<string>[] = [
  { value: 'all', label: 'Todas', icon: faLayerGroup, color: 'bg-indigo-50 text-indigo-600' },
  { value: 'pending', label: 'Pendientes', icon: faClock, color: 'bg-amber-50 text-amber-600' },
  { value: 'collected', label: 'Completadas', icon: faCircleCheck, color: 'bg-emerald-50 text-emerald-600' },
]

const CATEGORY_MAP: Record<string, { label: string; icon: IconDefinition; color: string }> = {
  fruit: { label: 'Fruta', icon: faAppleWhole, color: 'bg-red-100 text-red-700 border-red-200' },
  vegetables: { label: 'Verdura', icon: faCarrot, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  meat: { label: 'Carne', icon: faDrumstickBite, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  fish: { label: 'Pescado', icon: faFish, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  dairy: { label: 'Lácteos', icon: faGlassWater, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  eggs: { label: 'Huevos', icon: faEgg, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  bread: { label: 'Panadería', icon: faBreadSlice, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  cereals: { label: 'Cereales', icon: faBowlFood, color: 'bg-stone-100 text-stone-700 border-stone-200' },
  pasta_rice: { label: 'Pasta/Arroz', icon: faUtensils, color: 'bg-yellow-50 text-yellow-800 border-yellow-100' },
  legumes: { label: 'Legumbres', icon: faSeedling, color: 'bg-brown-100 text-brown-700 border-brown-200' },
  frozen: { label: 'Congelados', icon: faIcicles, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  canned: { label: 'Conservas', icon: faBoxArchive, color: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
  snacks: { label: 'Snacks', icon: faCookie, color: 'bg-rose-100 text-rose-700 border-rose-200' },
  sweets: { label: 'Dulces', icon: faCandyCane, color: 'bg-pink-100 text-pink-700 border-pink-200' },
  sauces: { label: 'Salsas', icon: faJar, color: 'bg-red-50 text-red-800 border-red-100' },
  spices: { label: 'Especias', icon: faPepperHot, color: 'bg-orange-50 text-orange-800 border-orange-100' },
  oil_vinegar: { label: 'Aceites', icon: faOilCan, color: 'bg-yellow-100 text-yellow-900 border-yellow-200' },
  drinks: { label: 'Bebidas', icon: faGlassWhiskey, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  alcohol: { label: 'Alcohol', icon: faWineGlass, color: 'bg-violet-100 text-violet-700 border-violet-200' },
  cleaning: { label: 'Limpieza', icon: faBroom, color: 'bg-blue-50 text-blue-700 border-blue-100' },
  hygiene: { label: 'Higiene', icon: faSoap, color: 'bg-teal-50 text-teal-700 border-teal-100' },
  baby: { label: 'Bebé', icon: faBaby, color: 'bg-sky-100 text-sky-700 border-sky-200' },
  pets: { label: 'Mascotas', icon: faPaw, color: 'bg-gray-200 text-gray-800 border-gray-300' },
  other: { label: 'Otros', icon: faBox, color: 'bg-gray-100 text-gray-700 border-gray-200' },
}

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
  return (
    <div className="flex flex-col gap-6 mb-8">
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
            placeholder="Buscar por nombre..."
            className="w-full bg-white border-2 border-slate-100 rounded-xl pl-12 pr-4 h-11 text-slate-700 font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm"
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
          <span className="text-[10px] font-black uppercase text-slate-400">Filtrar por categoría</span>
          <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {filteredCount} de {totalCount} mostrados
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          <button
            onClick={onClearCategories}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
              selectedCategories.length === 0
                ? 'bg-slate-800 border-slate-800 text-white shadow-lg'
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600 shadow-sm'
            }`}
          >
            Todas
          </button>
          {availableCategories.map((catKey) => {
            const cat = CATEGORY_MAP[catKey] || CATEGORY_MAP.other
            const isActive = selectedCategories.includes(catKey)
            return (
              <button
                key={catKey}
                onClick={() => onToggleCategory(catKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                  isActive
                    ? `${cat.color} shadow-lg scale-105 z-10`
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600 shadow-sm'
                }`}
              >
                <div className={isActive ? '' : 'grayscale opacity-70'}>
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
