"use client"

import React from 'react'
import { ShoppingListItem, UnitType } from '../entity/ShoppingListItem'
import { useShoppingListItems } from '../hooks/useShoppingListItems'
import { useProduct } from '@/product/hooks/useProduct'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faAppleWhole, faCarrot, faDrumstickBite, faFish, faGlassWater, 
  faEgg, faBreadSlice, faBowlFood, faUtensils, faSeedling,
  faIcicles, faBoxArchive, faCookie, faCandyCane, faJar, faPepperHot,
  faOilCan, faGlassWhiskey, faWineGlass, faSoap, faBroom, faBaby,
  faPaw, faBox, faMinus, faPlus, faTrash, faCheck,
  faScaleBalanced, faWeightHanging, faFlask, faBottleDroplet
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const UNIT_LABELS: Record<UnitType, string> = {
  unit: 'unidad/es',
  kg: 'Kg',
  g: 'g',
  l: 'L',
  ml: 'ml',
}

const UNIT_THEMES: Record<UnitType, { icon: IconDefinition; color: string }> = {
  unit: { icon: faBox, color: 'bg-slate-50 text-slate-600 border-slate-100' },
  g: { icon: faScaleBalanced, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  kg: { icon: faWeightHanging, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  ml: { icon: faBottleDroplet, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  l: { icon: faFlask, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
}

const CATEGORY_ICONS: Record<string, IconDefinition> = {
  fruit: faAppleWhole,
  vegetables: faCarrot,
  meat: faDrumstickBite,
  fish: faFish,
  dairy: faGlassWater,
  eggs: faEgg,
  bread: faBreadSlice,
  cereals: faBowlFood,
  pasta_rice: faUtensils,
  legumes: faSeedling,
  frozen: faIcicles,
  canned: faBoxArchive,
  snacks: faCookie,
  sweets: faCandyCane,
  sauces: faJar,
  spices: faPepperHot,
  oil_vinegar: faOilCan,
  drinks: faGlassWhiskey,
  alcohol: faWineGlass,
  cleaning: faBroom,
  hygiene: faSoap,
  baby: faBaby,
  pets: faPaw,
  other: faBox,
}

const CATEGORY_LABELS: Record<string, string> = {
  fruit: 'Frutas y Verduras',
  vegetables: 'Frutas y Verduras',
  meat: 'Carne y Pescado',
  fish: 'Carne y Pescado',
  dairy: 'Lácteos y Huevos',
  eggs: 'Lácteos y Huevos',
  bread: 'Panadería',
  cereals: 'Despensa',
  pasta_rice: 'Despensa',
  legumes: 'Despensa',
  frozen: 'Congelados',
  canned: 'Conservas',
  snacks: 'Snacks',
  sweets: 'Dulces',
  sauces: 'Salsas',
  spices: 'Especias',
  oil_vinegar: 'Aceites y Vinagres',
  drinks: 'Bebidas',
  alcohol: 'Bebidas Alcohólicas',
  cleaning: 'Limpieza',
  hygiene: 'Higiene',
  baby: 'Bebé',
  pets: 'Mascotas',
  other: 'Otros',
}

interface Props {
  item: ShoppingListItem
}

export default function ShoppingListItemCard({ item }: Props) {
  const { updateItem, removeItem } = useShoppingListItems()
  const { products } = useProduct()

  // Resolve product info if the API only returns an ID or if info is missing
  const productInfo = typeof item.product === 'object' && item.product !== null
    ? item.product
    : products.find(p => p.id === (item.product as any))

  const togglePickedUp = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.item-controls')) return
    updateItem(item.id, { picked_up: !item.picked_up })
  }

  const handleQuantityChange = (amount: number) => {
    const newQty = Math.max(1, item.quantity + amount)
    if (newQty !== item.quantity) {
      updateItem(item.id, { quantity: newQty })
    }
  }

  return (
    <div
      onClick={togglePickedUp}
      className="w-full group relative flex flex-row items-center gap-4 p-3 bg-white border-b border-slate-100 transition-all duration-300 active:scale-[0.99] cursor-pointer select-none overflow-hidden"
    >
      {/* 1. Category Icon */}
      <div className="group-hover:grayscale-0 transition-all flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform ${item.picked_up
          ? 'bg-emerald-500 border-emerald-500 shadow-sm text-white'
          : 'border-slate-200 group-hover:border-indigo-400 bg-white text-slate-400'}`}>
          <FontAwesomeIcon 
            icon={item.picked_up ? faCheck : (CATEGORY_ICONS[productInfo?.category || ''] || faBox)} 
            className={item.picked_up ? 'text-lg' : 'text-xl'}
          />
        </div>
      </div>

      {/* 2. Product Info (Name & Category) */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className={`font-bold text-sm transition-all duration-200 truncate pr-2 ${item.picked_up ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}>
          {productInfo?.name ? productInfo.name.charAt(0).toUpperCase() + productInfo.name.slice(1) : 'Cargando...'}
        </span>
        {productInfo?.category && (
          <span className="text-[10px] font-semibold text-slate-400 uppercase">
            {CATEGORY_LABELS[productInfo.category] || productInfo.category}
          </span>
        )}
      </div>

      {/* 3. Quantity Display */}
      <div className="shrink-0">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-black shadow-sm transition-transform group-hover:scale-105 ${UNIT_THEMES[item.unit]?.color || 'bg-slate-100 text-slate-600 border-slate-200/50'}`}>
          <FontAwesomeIcon icon={UNIT_THEMES[item.unit]?.icon || faBox} className="text-[10px] opacity-70" />
          <span>
            {item.quantity} {UNIT_LABELS[item.unit]}
          </span>
        </div>
      </div>

      {/* Controls Container (Quantity & Delete) */}
      <div className="item-controls flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* 4. Quantity Selector */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={item.picked_up || item.quantity <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm disabled:opacity-20 transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
          </button>

          <button
            onClick={() => handleQuantityChange(1)}
            disabled={item.picked_up}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm disabled:opacity-20 transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
          </button>
        </div>

        {/* 5. Delete Button */}
        <button
          onClick={() => removeItem(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-red-500 transition-all duration-300 cursor-pointer"
        >
          <FontAwesomeIcon icon={faTrash} className="text-xs" />
        </button>
      </div>
    </div>
  )
}

