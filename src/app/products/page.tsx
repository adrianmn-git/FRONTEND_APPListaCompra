"use client"

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
/*
- [x] Integrate `CustomSelect` in Products Catalog (`app/products/page.tsx`)
- [x] Add icons and colors to catalog categories
- [x] Verify functionality and design consistency
*/
import { useProduct } from '@/product/hooks/useProduct'
import { ProductCategory } from '@/product/entity/Product'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronLeft, faSearch, faFilter, faChevronDown, faStar,
  faAppleWhole, faCarrot, faDrumstickBite, faFish, faGlassWater, 
  faEgg, faBreadSlice, faBowlFood, faUtensils, faSeedling,
  faIcicles, faBoxArchive, faCookie, faCandyCane, faJar, faPepperHot,
  faOilCan, faGlassWhiskey, faWineGlass, faSoap, faBroom, faBaby,
  faPaw, faBox
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import CustomSelect, { CustomSelectOption } from '@/components/ui/CustomSelect'
import { useI18n } from '@/i18n/hooks/useI18n'

export default function ProductsPage() {
  const router = useRouter()
  const { products, loadProducts, loading } = useProduct()
  const { t } = useI18n()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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

  const CATEGORIES_LIST: CustomSelectOption<string>[] = useMemo(() => [
    { value: 'all', label: t("filters.all", { defaultValue: 'All' }), icon: faFilter, color: 'bg-slate-100 text-slate-500' },
    ...Object.entries(CATEGORY_MAP).map(([value, { label, icon, color }]) => ({
      value,
      label,
      icon,
      color
    })),
  ], [t])

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q))
    }

    // Sort alphabetically
    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [products, search, selectedCategory])

  const getCategoryIcon = (cat: string) => {
    return CATEGORY_MAP[cat]?.icon || faBox
  }
  
  const getCategoryLabel = (cat: string) => {
    return CATEGORY_MAP[cat]?.label || cat
  }

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50 -z-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Superior navigation & Header Info */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-8">
          <button
            onClick={() => router.push('/')}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold mb-6 transition-colors bg-white hover:bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-sm w-fit cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            {t("products.back", { defaultValue: 'Back' })}
          </button>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full shadow-sm">
                {t("products.global_catalog", { defaultValue: 'Global Catalog' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4">
              {t("products.title", { defaultValue: 'Database' })}
            </h1>
            <p className="text-slate-500 font-medium">{t("products.subtitle", { defaultValue: 'Global product search for your account' })} ({products.length})</p>
          </div>
        </div>

        {/* Content Container (Glass) */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl shadow-slate-300/50 border border-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Tiempos y Buscador */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t("products.search_placeholder", { defaultValue: 'Search by name...' })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 h-11 bg-white border-2 border-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
            </div>
          </div>
          
          <div className="relative shrink-0 sm:w-64">
            <CustomSelect
              value={selectedCategory}
              options={CATEGORIES_LIST}
              onChange={(val) => setSelectedCategory(val)}
            />
          </div>
        </div>

          {/* List of Products */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600" />
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-6 md:p-8">
              <div className="flex flex-col">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                    <FontAwesomeIcon icon={faSearch} className="text-5xl mb-4 block text-slate-300 mx-auto" />
                    <p className="text-slate-600 font-bold text-xl">{t("products.no_products", { defaultValue: 'No products found' })}</p>
                    <p className="text-slate-400 text-sm mt-1">{t("products.no_products_desc", { defaultValue: 'Try another search or category' })}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="group flex items-center justify-between py-4 px-2 hover:bg-slate-50/50 transition-colors cursor-default rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm border text-xl group-hover:scale-110 transition-transform ${CATEGORY_MAP[product.category]?.color || 'bg-white border-slate-100 text-slate-400'}`}>
                            <FontAwesomeIcon icon={getCategoryIcon(product.category)} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 capitalize leading-tight group-hover:text-indigo-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-[11px] uppercase font-extrabold text-slate-400 mt-0.5">
                              {getCategoryLabel(product.category)}
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase rounded-lg hover:bg-indigo-600 hover:text-white transition-all transform translate-x-2 group-hover:translate-x-0 cursor-pointer"
                          onClick={() => {
                            // Aquí se podría añadir a una lista por defecto o abrir selector
                            alert(`Añadir ${product.name} a una lista (funcionalidad extra)`)
                          }}
                        >
                          {t("products.add_to_list", { defaultValue: 'Add to list' })}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
