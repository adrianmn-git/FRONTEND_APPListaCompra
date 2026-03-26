"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { useProduct } from "@/product/hooks/useProduct"
import { ShoppingList, ShopType } from "@/shopping-list/entity/ShoppingList"
import ShoppingListCard from "@/shopping-list/components/ShoppingListCard"
import ShoppingListActions from "@/shopping-list/components/ShoppingListActions"
import ProductActions from "@/product/components/ProductActions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListCheck, faSearch, faStore, faArrowDownShortWide, faBasketShopping, faDatabase, faAppleWhole, faBoxOpen, faLayerGroup, faClock, faCircleCheck, faCartShopping, faShop, faBuilding, faTruck, faStore as faStoreAlt, faCameraRetro, faChartPie, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/i18n/hooks/useI18n"
import { SHOP_CONFIG } from "@/shopping-list/utils/shopConfig"

type SortOrder = "newest" | "oldest"
type FilterStatus = "all" | "completed" | "pending"

export default function HomePage() {
  const router = useRouter()
  const { lists, getLists, isLoading: listsLoading } = useShoppingList()
  const { loadProducts } = useProduct()
  const { t } = useI18n()

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [shopFilter, setShopFilter] = useState<ShopType | "all">("all")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [searchQuery, setSearchQuery] = useState("")

  const STATUS_FILTER_OPTIONS = useMemo(() => [
    { value: 'all', label: t("common.all_feminine", { defaultValue: 'All' }), icon: faLayerGroup, color: 'text-indigo-600' },
    { value: 'pending', label: t("list.pending_plural", { defaultValue: 'Pending' }), icon: faClock, color: 'text-amber-600' },
    { value: 'completed', label: t("list.completed_plural", { defaultValue: 'Completed' }), icon: faCircleCheck, color: 'text-emerald-600' },
  ], [t])

  const SHOP_LABELS: Record<string, string> = {
    mercadona: "Mercadona", alcampo: "Alcampo", sorli: "Sorli",
    esclat: "Esclat", bonpreusa: "Bonpreu", caprabo: "Caprabo", carrefour: "Carrefour",
  }

  const SHOP_ICONS: Record<string, any> = {
    mercadona: faCartShopping, alcampo: faShop, sorli: faBuilding,
    esclat: faStoreAlt, bonpreusa: faStoreAlt, caprabo: faBasketShopping, carrefour: faTruck,
  }

  useEffect(() => {
    getLists()
    loadProducts()
  }, [])

  const availableShops = useMemo(() => {
    const shops = new Set(lists.map(list => list.shop))
    return Array.from(shops)
  }, [lists])

  const filteredAndSortedLists = useMemo(() => {
    let result = [...lists]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(list => list.name.toLowerCase().includes(q) || list.description?.toLowerCase().includes(q))
    }

    if (statusFilter === "completed") {
      result = result.filter(list => list.completed)
    } else if (statusFilter === "pending") {
      result = result.filter(list => !list.completed)
    }

    if (shopFilter !== "all") {
      result = result.filter(list => list.shop === shopFilter)
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return result
  }, [lists, statusFilter, shopFilter, sortOrder, searchQuery])

  return (
    <main className="min-h-screen bg-transparent relative overflow-x-hidden font-sans">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-300/40 to-purple-400/20 blur-[120px] rounded-full point-events-none mix-blend-multiply"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-gradient-to-bl from-emerald-300/30 to-sky-400/20 blur-[120px] rounded-full point-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">

        {/* HERO SECTION ("About Us" Style + Search) */}
        <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 text-white p-10 md:p-16 mb-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 group">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000 z-0 pointer-events-none"></div>
          
          <div className="relative z-10 w-full md:w-3/5">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
              {t("home.main_title_1", { defaultValue: 'Your Shopping,' })} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                {t("home.main_title_2", { defaultValue: 'Elevated.' })}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed mb-8">
              {t("home.tagline", { defaultValue: 'Organize your supermarkets, optimize your spending, and discover the smartest way to build your shopping list. An experience designed for you.' })}
            </p>
            
            {/* Expanded Hero Features */}
            <div className="flex flex-col gap-4 mt-8 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 w-fit transform hover:bg-white/10 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                   <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-400" />
                </div>
                <span className="text-slate-200 font-bold">{t("home.feature_1", { defaultValue: 'Crea listas ilimitadas para cada ocasión.' })}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                   <FontAwesomeIcon icon={faDatabase} className="text-indigo-400" />
                </div>
                <span className="text-slate-200 font-bold">{t("home.feature_2", { defaultValue: 'Gestiona tu catálogo global de productos.' })}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                   <FontAwesomeIcon icon={faBasketShopping} className="text-amber-400" />
                </div>
                <span className="text-slate-200 font-bold">{t("home.feature_3", { defaultValue: 'Control total de tus gastos en tiempo real.' })}</span>
              </div>
            </div>
          </div>
          
          {/* Hero Visual Decor */}
          <div className="relative z-10 hidden md:block w-2/5 p-8">
            <div className="relative w-full aspect-square bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 rounded-[3rem] border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl transform rotate-3 group-hover:rotate-6 transition-all duration-700">
              <FontAwesomeIcon icon={faBasketShopping} className="text-[120px] text-white/80 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
              <div className="absolute -bottom-6 -left-6 bg-emerald-500 font-black text-white px-6 py-3 rounded-full border-4 border-slate-900 shadow-xl transform -rotate-12">
                v0.3
              </div>
            </div>
          </div>
        </section>

        {/* 1-Column Layout Stacked */}
        <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">

          {/* RADIACAL FILTERS SECTION */}
          <section className="bg-white rounded-[3rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-6 relative z-30">
            {/* Search Input in Filters */}
            <div className="relative w-full">
              <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("home.search_lists", { defaultValue: 'Search lists by name...' })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400/80 px-14 py-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all font-black shadow-inner"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-black text-sm transition-colors">
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-2">
              
              {/* Status Segmented Control */}
              <div className="w-full lg:w-auto flex bg-slate-100 p-1.5 rounded-full overflow-x-auto scrollbar-hide">
                {STATUS_FILTER_OPTIONS.map(opt => {
                  const isActive = statusFilter === opt.value;
                  return (
                    <button 
                      key={opt.value}
                      onClick={() => setStatusFilter(opt.value as FilterStatus)}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-black text-sm whitespace-nowrap transition-all duration-300 ${
                        isActive 
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                      }`}
                    >
                      <FontAwesomeIcon icon={opt.icon} className={isActive ? opt.color : ''} />
                      {opt.label}
                    </button>
                  )
                })}
              </div>

              {/* Action Buttons (Sort & Add) */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <button
                  onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                  className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-6 h-14 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 group"
                >
                  <FontAwesomeIcon icon={faArrowDownShortWide} className={`text-lg text-slate-400 group-hover:text-indigo-600 transition-all duration-300 ${sortOrder === 'oldest' ? 'rotate-180' : ''}`} />
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    {sortOrder === "newest" ? t("home.sort_recent", { defaultValue: 'Newest' }) : t("home.sort_oldest", { defaultValue: 'Oldest' })}
                  </span>
                </button>
                <div className="shrink-0">
                  <ShoppingListActions />
                </div>
              </div>
            </div>

            {/* Shop Filters Carousel */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Filtrar por Supermercado</h3>
              <div className="flex items-center gap-4 overflow-x-auto pb-6 pt-4 px-4 -mx-2 scrollbar-hide mask-edges">
                <button 
                  onClick={() => setShopFilter('all')}
                  className={`flex-shrink-0 flex flex-col items-center gap-3 group transition-all duration-500 ${shopFilter === 'all' ? 'opacity-100 transform -translate-y-1' : 'opacity-50 hover:opacity-100 hover:-translate-y-0.5'}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-colors duration-300 ${shopFilter === 'all' ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-slate-200 bg-white shadow-sm'}`}>
                    <FontAwesomeIcon icon={faStore} className={`text-2xl ${shopFilter === 'all' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-wider ${shopFilter === 'all' ? 'text-indigo-600' : 'text-slate-500'}`}>{t("common.all_shops", { defaultValue: 'All' })}</span>
                </button>
                
                {availableShops.map(shop => {
                  const isActive = shopFilter === shop;
                  const config = SHOP_CONFIG[shop as keyof typeof SHOP_CONFIG];
                  return (
                    <button 
                      key={shop}
                      onClick={() => setShopFilter(shop)}
                      className={`flex-shrink-0 flex flex-col items-center gap-3 group transition-all duration-500 ${isActive ? 'opacity-100 transform -translate-y-1' : 'opacity-50 hover:opacity-100 hover:-translate-y-0.5'}`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-white transition-all duration-300 overflow-hidden ${isActive ? 'border-slate-800 shadow-md shadow-slate-200' : 'border-slate-200 shadow-sm'}`}>
                         {config?.logoUrl ? (
                           <img src={config.logoUrl} className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-300 group-hover:scale-125" alt={shop} />
                         ) : (
                           <FontAwesomeIcon icon={SHOP_ICONS[shop] || faStore} className={`text-2xl ${isActive ? 'text-slate-800' : 'text-slate-400'}`} />
                         )}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{SHOP_LABELS[shop] ?? shop}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Main Column: Shopping Lists Grid */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center gap-4 px-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t("home.your_lists", { defaultValue: 'Your Lists' })}</h2>
              <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-black">{filteredAndSortedLists.length}</span>
            </div>

            {/* Lists Container */}
            <div className="flex flex-col gap-4">
              {listsLoading ? (
                <div className="flex justify-center py-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600" />
                </div>
              ) : filteredAndSortedLists.length === 0 ? (
                <div className="text-center py-32 bg-white/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-white shadow-xl shadow-slate-200/50">
                  <FontAwesomeIcon icon={searchQuery ? faSearch : faBasketShopping} className="text-6xl mb-6 text-slate-300 transform -rotate-12" />
                  <p className="text-slate-500 text-xl font-black max-w-sm mx-auto">
                    {searchQuery 
                      ? "No encontramos ninguna lista con ese nombre."
                      : t("home.no_lists", { defaultValue: "You don't have any lists yet. Create one to start!" })}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredAndSortedLists.map((list) => (
                    <ShoppingListCard key={list.id} list={list} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Catalog & Quick Actions */}
          <div className="flex flex-col gap-8 w-full mt-12 bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-white/10 relative z-10 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl text-emerald-400 backdrop-blur-md border border-white/10">
                  <FontAwesomeIcon icon={faDatabase} className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">{t("nav.catalog", { defaultValue: 'Catalog' })}</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Database</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Quick Action: New Product Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-[2.5rem] p-10 shadow-2xl border border-white/10 flex flex-col items-center text-center gap-6 relative overflow-hidden group w-full h-full hover:bg-white/10 transition-colors duration-500">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full transition-transform duration-700 group-hover:scale-[2.5] blur-xl -z-0"></div>

                <div className="relative z-10 w-full flex flex-col flex-grow items-center">
                  <div className="bg-white/10 p-6 rounded-[2rem] inline-block mb-6 rotate-3 group-hover:rotate-0 transition-all duration-500 border border-white/10">
                    <FontAwesomeIcon icon={faAppleWhole} className="text-5xl text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{t("home.new_product_title", { defaultValue: 'New Product' })}</h3>
                  <p className="text-slate-300 text-sm font-bold mb-10 max-w-[280px] mx-auto opacity-80 flex-grow leading-relaxed">
                    {t("home.new_product_desc", { defaultValue: 'Add products to your global database for later use.' })}
                  </p>
                  <div className="mt-auto w-full max-w-[280px]">
                     <ProductActions />
                  </div>
                </div>
              </div>

              {/* Quick Action: Exploration Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-10 shadow-lg shadow-indigo-500/20 flex flex-col items-center text-center gap-6 relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] h-full">
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/20 rounded-full transition-transform duration-700 group-hover:scale-[3] blur-2xl -z-0"></div>

                <div className="relative z-10 w-full flex flex-col flex-grow items-center">
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-[2rem] inline-block mb-6 -rotate-2 group-hover:rotate-0 transition-all duration-500 border border-white/30 text-white shadow-xl">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-5xl" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{t("home.explore_catalog", { defaultValue: 'Explore Catalog' })}</h3>
                  <p className="text-indigo-100 text-sm font-extrabold mb-10 max-w-[280px] mx-auto opacity-80 flex-grow leading-relaxed">
                    {t("home.explore_desc", { defaultValue: 'Search and filter all stored products.' })}
                  </p>

                  <div className="mt-auto w-full max-w-[280px]">
                    <button className="w-full relative overflow-hidden bg-white text-indigo-900 hover:bg-slate-50 p-4 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex flex-col items-center text-center font-black text-lg" onClick={() => router.push('/products')}>
                      {t("home.explore_btn", { defaultValue: 'Explore DB' })}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Actions (Scan & Statistics) */}
          <div className="flex flex-col gap-8 w-full mt-12 bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-white/10 relative z-10 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl text-purple-400 backdrop-blur-md border border-white/10">
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">{t("home.advanced_tools", { defaultValue: 'Advanced Tools' })}</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t("home.smart_features", { defaultValue: 'Smart Features' })}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Quick Action: Scan Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-[2.5rem] p-10 shadow-2xl border border-white/10 flex flex-col items-center text-center gap-6 relative overflow-hidden group w-full h-full hover:bg-white/10 transition-colors duration-500">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full transition-transform duration-700 group-hover:scale-[2.5] blur-xl -z-0"></div>

                <div className="relative z-10 w-full flex flex-col flex-grow items-center">
                  <div className="bg-white/10 p-6 rounded-[2rem] inline-block mb-6 rotate-3 group-hover:rotate-0 transition-all duration-500 border border-white/10">
                    <FontAwesomeIcon icon={faCameraRetro} className="text-5xl text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{t("nav.scan", { defaultValue: 'Scan' })}</h3>
                  <p className="text-slate-300 text-sm font-bold mb-10 max-w-[280px] mx-auto opacity-80 flex-grow leading-relaxed">
                    {t("scan.subtitle", { defaultValue: "Upload a photo of your handwritten shopping list and we'll digitize it automatically." })}
                  </p>
                  <div className="mt-auto w-full max-w-[280px]">
                    <button className="w-full relative overflow-hidden bg-white/10 text-white hover:bg-white/20 p-4 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex flex-col items-center text-center font-black text-lg border border-white/10" onClick={() => router.push('/scan')}>
                      {t("home.go_to_scan", { defaultValue: 'Go to Scan' })}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Action: Stats Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-10 shadow-lg shadow-indigo-500/20 flex flex-col items-center text-center gap-6 relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] h-full">
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/20 rounded-full transition-transform duration-700 group-hover:scale-[3] blur-2xl -z-0"></div>

                <div className="relative z-10 w-full flex flex-col flex-grow items-center">
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-[2rem] inline-block mb-6 -rotate-2 group-hover:rotate-0 transition-all duration-500 border border-white/30 text-white shadow-xl">
                    <FontAwesomeIcon icon={faChartPie} className="text-5xl" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{t("stats.global_stats", { defaultValue: 'Insights & Analytics' })}</h3>
                  <p className="text-indigo-100 text-sm font-extrabold mb-10 max-w-[280px] mx-auto opacity-80 flex-grow leading-relaxed">
                    {t("stats.subtitle", { defaultValue: 'Analyze your purchasing habits and database.' })}
                  </p>

                  <div className="mt-auto w-full max-w-[280px]">
                    <button className="w-full relative overflow-hidden bg-white text-indigo-900 hover:bg-slate-50 p-4 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex flex-col items-center text-center font-black text-lg" onClick={() => router.push('/stats')}>
                      {t("home.go_to_stats", { defaultValue: 'View Stats' })}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}