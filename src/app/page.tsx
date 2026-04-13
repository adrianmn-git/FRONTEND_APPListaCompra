"use client"

import { useEffect, useState, useMemo } from "react"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { useProduct } from "@/product/hooks/useProduct"
import { ShopType } from "@/shopping-list/entity/ShoppingList"
import ShoppingListCard from "@/shopping-list/components/ShoppingListCard"
import ShoppingListActions from "@/shopping-list/components/ShoppingListActions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowDownShortWide, faBasketShopping, faLayerGroup, faClock, faCircleCheck, faXmark, faStore } from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/i18n/hooks/useI18n"
import { getShopConfig } from "@/shopping-list/utils/shopConfig"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

type SortOrder = "newest" | "oldest"
type FilterStatus = "all" | "completed" | "pending"

export default function HomePage() {
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
    <main className="min-h-screen bg-transparent relative overflow-x-hidden font-sans pb-24">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-300/20 to-purple-400/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-gradient-to-bl from-emerald-300/20 to-sky-400/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10">

        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-2">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
              {t("home.your_lists", { defaultValue: 'Your Lists' })}
            </h1>
            <p className="text-slate-500 font-bold text-sm mt-2 uppercase tracking-widest">
              {lists.length} {t("home.results", { defaultValue: 'results' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ShoppingListActions />
          </div>
        </div>

        {/* MAIN TOOLBAR (Filters & Search) */}
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-slate-200/80 mb-6 flex flex-col xl:flex-row gap-5 xl:items-center justify-between z-20 relative">
          
          {/* Search Input */}
          <div className="relative w-full xl:max-w-md">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10" />
            <Input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("home.search_lists", { defaultValue: 'Search lists...' })}
              className="w-full h-12 bg-slate-50/50 border-slate-200 text-slate-800 placeholder:text-slate-400 pl-11 rounded-2xl focus-visible:ring-indigo-400 transition-all font-bold shadow-inner"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-black text-sm transition-colors z-10">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>

          {/* Filters Group */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full xl:w-auto overflow-x-auto scrollbar-hide">
            
            {/* Status Segmented Control */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0 w-full md:w-auto">
              {STATUS_FILTER_OPTIONS.map(opt => {
                const isActive = statusFilter === opt.value;
                return (
                  <button 
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value as FilterStatus)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    <FontAwesomeIcon icon={opt.icon} className={isActive ? opt.color : ''} />
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <div className="w-px h-8 bg-slate-200 hidden md:block" />

            {/* Sort Button */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
              className="h-11 rounded-2xl px-5 border-slate-200 shrink-0 w-full md:w-auto gap-2 bg-slate-50/50 hover:bg-slate-100"
            >
              <FontAwesomeIcon icon={faArrowDownShortWide} className={`text-slate-400 ${sortOrder === 'oldest' ? 'rotate-180' : ''} transition-transform duration-300`} />
              <span className="text-xs font-bold text-slate-700">
                {sortOrder === "newest" ? t("home.sort_recent", { defaultValue: 'Newest' }) : t("home.sort_oldest", { defaultValue: 'Oldest' })}
              </span>
            </Button>
          </div>
        </div>

        {/* SHOP FILTER CHIPS */}
        {availableShops.length > 0 && (
          <div className="mb-8 flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 mask-edges-right -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setShopFilter('all')}
              className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-300 ${
                shopFilter === 'all'
                  ? 'bg-slate-800 border-slate-800 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <FontAwesomeIcon icon={faStore} className={shopFilter === 'all' ? 'text-white' : 'text-slate-400'} />
              {t("common.all_shops", { defaultValue: 'All shops' })}
            </button>

            {availableShops.map(shop => {
              const isActive = shopFilter === shop;
              const config = getShopConfig(shop);
              return (
                <button
                  key={shop}
                  onClick={() => setShopFilter(shop)}
                  className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-white border-slate-800 text-slate-900 shadow-md ring-1 ring-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {config.logoUrl ? (
                      <img src={config.logoUrl} className="w-full h-full object-contain" alt={shop} />
                    ) : (
                      <FontAwesomeIcon icon={config.icon} className={isActive ? 'text-slate-800' : 'text-slate-400'} />
                    )}
                  </div>
                  {config.label}
                </button>
              )
            })}
          </div>
        )}

        {/* SHOPPING LISTS GRID */}
        <div className="flex flex-col gap-4">
          {listsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[280px] rounded-[2rem] w-full" />
              ))}
            </div>
          ) : filteredAndSortedLists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <FontAwesomeIcon icon={searchQuery ? faSearch : faBasketShopping} className="text-4xl text-slate-300" />
              </div>
              <p className="text-slate-500 text-lg font-bold max-w-sm text-center px-6">
                {searchQuery
                  ? "No encontramos ninguna lista con ese nombre."
                  : t("home.no_lists", { defaultValue: "You don't have any lists yet. Create one to start!" })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
              {filteredAndSortedLists.map((list) => (
                <ShoppingListCard key={list.id} list={list} />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}