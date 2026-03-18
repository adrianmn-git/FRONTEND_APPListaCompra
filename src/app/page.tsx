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
import { faListCheck, faFilter, faStore, faArrowDownShortWide, faBasketShopping, faDatabase, faAppleWhole, faBoxOpen, faChevronDown, faHouse, faLayerGroup, faClock, faCircleCheck, faCartShopping, faShop, faBuilding, faTruck, faStore as faStoreAlt } from "@fortawesome/free-solid-svg-icons"
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect"
import { useI18n } from "@/i18n/hooks/useI18n"

type SortOrder = "newest" | "oldest"
type FilterStatus = "all" | "completed" | "pending"

export default function HomePage() {
  const router = useRouter()
  const { lists, getLists, isLoading: listsLoading } = useShoppingList()
  const { products, loadProducts } = useProduct()
  const { t } = useI18n()

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [shopFilter, setShopFilter] = useState<ShopType | "all">("all")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")

  const STATUS_FILTER_OPTIONS: CustomSelectOption<FilterStatus>[] = useMemo(() => [
    { value: 'all', label: t("common.all_feminine", { defaultValue: 'All' }), icon: faLayerGroup, color: 'bg-indigo-50 text-indigo-600' },
    { value: 'pending', label: t("list.pending_plural", { defaultValue: 'Pending' }), icon: faClock, color: 'bg-amber-50 text-amber-600' },
    { value: 'completed', label: t("list.completed_plural", { defaultValue: 'Completed' }), icon: faCircleCheck, color: 'bg-emerald-50 text-emerald-600' },
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
  }, [lists, statusFilter, shopFilter, sortOrder])

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50 -z-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 py-6 lg:py-10">

        {/* Header Section */}
        <div className="text-center md:text-left mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 drop-shadow-sm mb-4">
            {t("home.main_title_1", { defaultValue: 'Your Shopping,' })} <span className="text-indigo-600">{t("home.main_title_2", { defaultValue: 'Organized' })}</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto md:mx-0 font-medium opacity-80">
            {t("home.tagline", { defaultValue: 'Manage your lists, products, and supermarkets in one place.' })}
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">

          {/* Main Column: Shopping Lists */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600 shadow-sm">
                  <FontAwesomeIcon icon={faListCheck} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{t("home.your_lists", { defaultValue: 'Your Lists' })}</h2>
                  <p className="text-sm font-semibold text-slate-400">{filteredAndSortedLists.length} {t("home.results", { defaultValue: 'results' })}</p>
                </div>
              </div>
              <ShoppingListActions />
            </div>

            {/* Premium Filters Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50">
              {/* Status Filter */}
              <div className="flex-1">
                <CustomSelect
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={(val) => setStatusFilter(val as FilterStatus)}
                />
              </div>

              {/* Shop Filter */}
              <div className="flex-1">
                <CustomSelect
                  value={shopFilter}
                  placeholder={t("home.filter_by_shop", { defaultValue: 'Filter by shop' })}
                  options={[
                    { value: 'all', label: t("common.all_shops", { defaultValue: 'All shops' }), icon: faStore, color: 'bg-slate-50 text-slate-500' },
                    ...availableShops.map(shop => ({
                      value: shop,
                      label: SHOP_LABELS[shop] ?? shop,
                      icon: SHOP_ICONS[shop] ?? faStore
                    }))
                  ]}
                  onChange={(val) => setShopFilter(val as ShopType | "all")}
                />
              </div>

              {/* Date Sort Toggle Button */}
              <button
                onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-white hover:to-white border border-slate-200 px-4 h-11 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <FontAwesomeIcon icon={faArrowDownShortWide} className={`w-4 h-4 text-indigo-500 transition-transform ${sortOrder === 'oldest' ? 'rotate-180' : ''}`} />
                <span className="text-[10px] font-black uppercase text-slate-600">
                  {sortOrder === "newest" ? t("home.sort_recent", { defaultValue: 'Newest' }) : t("home.sort_oldest", { defaultValue: 'Oldest' })}
                </span>
              </button>
            </div>

            {/* Lists Container */}
            <div className="flex flex-col gap-4">
              {listsLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600" />
                </div>
              ) : filteredAndSortedLists.length === 0 ? (
                <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border-2 border-dashed border-white/60">
                  <FontAwesomeIcon icon={faBasketShopping} className="text-5xl mb-4 text-slate-300" />
                  <p className="text-slate-500 font-black">{t("home.no_lists", { defaultValue: "You don't have any lists yet. Create one to start!" })}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 justify-center">
                  {filteredAndSortedLists.map((list) => (
                    <ShoppingListCard key={list.id} list={list} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column: Catalog & Quick Actions */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2.5 rounded-2xl text-emerald-600 shadow-sm">
                  <FontAwesomeIcon icon={faDatabase} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{t("nav.catalog", { defaultValue: 'Catalog' })}</h2>
                  <p className="text-sm font-bold text-slate-400">Global BD</p>
                </div>
              </div>
            </div>

            {/* Quick Action: New Product Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center text-center gap-6 relative overflow-hidden group w-full">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full transition-transform duration-700 group-hover:scale-[2.5] -z-0"></div>

              <div className="relative z-10 w-full">
                <div className="bg-white shadow-sm shadow-emerald-100 p-5 rounded-[1.5rem] inline-block mb-4 rotate-3 group-hover:rotate-0 transition-all duration-500 border border-emerald-100">
                  <FontAwesomeIcon icon={faAppleWhole} className="text-4xl text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{t("home.new_product_title", { defaultValue: 'New Product' })}</h3>
                <p className="text-slate-500 text-sm font-bold mb-8 max-w-[220px] mx-auto opacity-80">
                  {t("home.new_product_desc", { defaultValue: 'Add products to your global database for later use.' })}
                </p>
                <ProductActions />
              </div>
            </div>

            {/* Quick Action: Exploration Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-200 flex flex-col items-center text-center gap-6 relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full transition-transform duration-700 group-hover:scale-[3] -z-0"></div>

              <div className="relative z-10 w-full">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-[1.5rem] inline-block mb-4 -rotate-2 group-hover:rotate-0 transition-all duration-500 border border-white/20">
                  <FontAwesomeIcon icon={faBoxOpen} className="text-4xl text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{t("home.explore_catalog", { defaultValue: 'Explore Catalog' })}</h3>
                <p className="text-indigo-100 text-sm font-extrabold mb-8 max-w-[220px] mx-auto opacity-70">
                  {t("home.explore_desc", { defaultValue: 'Search and filter all stored products.' })}
                </p>

                <button className="w-full relative group overflow-hidden bg-slate-900 hover:bg-purple-800 p-3 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex flex-col items-center text-center gap-2" onClick={() => router.push('/products')}>
                  <h3 className="text-white font-bold text-lg mb-1">{t("home.explore_btn", { defaultValue: 'Explore DB' })}</h3>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}