"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useShoppingList } from '@/shopping-list/hooks/useShoppingList'
import { useShoppingListItems } from '@/shopping-list-item/hooks/useShoppingListItems'
import { ShoppingList } from '@/shopping-list/entity/ShoppingList'
import ShoppingListItemCard from '@/shopping-list-item/components/ShoppingListItemCard'
import AddShoppingListItemForm from '@/shopping-list-item/components/AddShoppingListItemForm'
import ShoppingListFilters from '@/shopping-list-item/components/ShoppingListFilters'
import { useProduct } from '@/product/hooks/useProduct'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faCheck, faTrash, faBasketShopping, faSearch, faEuroSign, faPenToSquare, faStore, faTruck, faCartShopping, faBuilding } from '@fortawesome/free-solid-svg-icons'
import EditShoppingListForm from '@/shopping-list/components/EditShoppingListForm'
import FinalPriceModal from '@/shopping-list/components/FinalPriceModal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useI18n } from '@/i18n/hooks/useI18n'

export default function ShoppingListDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { getList, completeList, deleteList, updateList } = useShoppingList()
  const { items, loading, loadItems, removeItem } = useShoppingListItems()
  const { t } = useI18n()

  const [list, setList] = useState<ShoppingList | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const SHOP_THEMES: Record<string, { label: string, icon: any, bg: string, text: string }> = {
    mercadona: { label: "Mercadona", icon: faCartShopping, bg: "bg-emerald-500", text: "text-white" },
    alcampo: { label: "Alcampo", icon: faStore, bg: "bg-red-600", text: "text-white" },
    sorli: { label: "Sorli", icon: faBuilding, bg: "bg-blue-600", text: "text-white" },
    esclat: { label: "Esclat", icon: faStore, bg: "bg-orange-600", text: "text-white" },
    bonpreusa: { label: "Bonpreu", icon: faStore, bg: "bg-amber-500", text: "text-white" },
    caprabo: { label: "Caprabo", icon: faBasketShopping, bg: "bg-indigo-600", text: "text-white" },
    carrefour: { label: "Carrefour", icon: faTruck, bg: "bg-sky-600", text: "text-white" },
  }
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'collected'>('all')
  
  const { products } = useProduct()

  const fetchListAndItems = async () => {
    if (id && typeof id === 'string') {
      const result = await getList(id)
      setList(result)
      await loadItems(Number(id))
    }
  }

  useEffect(() => {
    fetchListAndItems()
  }, [id])

  const fetchedItems = items // Original items from hook
  
  const filteredItems = fetchedItems.filter(item => {
    // 1. Search filter
    const product = typeof item.product === 'object' ? item.product : products.find(p => p.id === (item.product as any))
    const nameMatch = product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
    
    // 2. Category filter
    const categoryMatch = selectedCategories.length === 0 || (product?.category && selectedCategories.includes(product.category))
    
    // 3. Status filter
    const statusMatch = statusFilter === 'all' 
      || (statusFilter === 'pending' && !item.picked_up)
      || (statusFilter === 'collected' && item.picked_up)
      
    return nameMatch && categoryMatch && statusMatch
  })

  // Calculate available categories from current items
  const availableCategories = Array.from(new Set(
    items.map(item => {
      const product = typeof item.product === 'object' ? item.product : products.find(p => p.id === (item.product as any))
      return product?.category
    }).filter(Boolean) as string[]
  )).sort()

  const pickedCount = items.filter((i) => i.picked_up).length
  const totalItems = items.length
  const progress = totalItems > 0 ? (pickedCount / totalItems) * 100 : 0

  const handleCompleteList = async () => {
    if (!id || typeof id !== 'string') return
    await completeList(id)
    fetchListAndItems()
    setShowPriceModal(true)
  }

  const handlePriceConfirm = async (price: number) => {
    if (!id || !list) return
    await updateList(list.id, { final_price: price })
    fetchListAndItems()
  }

  const handleDeleteList = async () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteList = async () => {
    if (!id || typeof id !== 'string') return
    try {
      await deleteList(Number(id))
      router.push('/')
    } catch (error) {
      // Error handled by Toast in context
    }
  }

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600" />
      </div>
    )
  }

  const currentShopTheme = SHOP_THEMES[list.shop] || { label: list.shop, icon: faStore, bg: "bg-slate-800", text: "text-white" }

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50 -z-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">

        {/* Supermarket Top Band */}
        <div className={`w-full rounded-[2rem] mb-6 px-6 py-3.5 flex items-center justify-center gap-3 shadow-lg shadow-${currentShopTheme.bg.split('-')[1]}-500/30 transition-all ${currentShopTheme.bg} outline outline-4 outline-white`}>
          <FontAwesomeIcon icon={currentShopTheme.icon} className={`text-xl ${currentShopTheme.text}`} />
          <span className={`font-black uppercase tracking-widest text-sm ${currentShopTheme.text}`}>{currentShopTheme.label}</span>
        </div>

        {/* Navigation & Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10 w-full">
          {/* Top row: back + title + badges */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => router.push('/')}
              aria-label={t("common.go_back", { defaultValue: 'Go back' })}
              className="bg-white/80 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-2xl border border-white shadow-xl shadow-slate-200/50 text-slate-400 hover:text-indigo-600 transition-all hover:-translate-x-1 active:scale-95 cursor-pointer shrink-0"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-1.5 min-w-0">
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 drop-shadow-sm truncate leading-tight">
                {list.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {list.final_price > 0 && (
                  <span className="text-xs font-black uppercase text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm flex items-center gap-1.5">
                     <FontAwesomeIcon icon={faEuroSign} className="text-[10px]" />
                     {list.final_price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions row - Uniform Sizes */}
          <div className="flex flex-wrap items-center justify-start xl:justify-end gap-8 shrink-0">
            {!list.completed && (
              <div className="flex items-center gap-3">
                {pickedCount < totalItems && totalItems > 0 && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 h-12 px-4 rounded-2xl border border-amber-100 hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm">
                    <FontAwesomeIcon icon={faCheck} className="text-[8px] text-amber-400" />
                    {t("notifications.picked_all_needed", { defaultValue: 'Collect all products to complete' })}
                  </span>
                )}
                <button
                  onClick={handleCompleteList}
                  disabled={pickedCount < totalItems || totalItems === 0}
                  className={`h-12 font-black text-[11px] md:text-xs uppercase px-5 md:px-6 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 whitespace-nowrap ${
                    pickedCount < totalItems || totalItems === 0
                      ? 'bg-slate-200 text-slate-400 shadow-slate-100 cursor-not-allowed'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer'
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                  {t("list.complete", { defaultValue: 'Complete Purchase' })}
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <EditShoppingListForm 
                list={list} 
                className="w-12 h-12 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center icon-lg"
              />
              <button
                onClick={handleDeleteList}
                aria-label={t("list.delete_title", { defaultValue: 'Delete list?' })}
                className="w-12 h-12 bg-white hover:bg-red-50 text-red-400 hover:text-red-500 rounded-2xl border border-red-50 shadow-lg shadow-red-100/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                title={t("list.delete_title", { defaultValue: 'Delete list?' })}
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* --- CELEBRATION BANNER FOR COMPLETED LISTS --- */}
        {list.completed && (
          <div className="w-full bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] p-6 sm:p-8 mb-10 shadow-2xl shadow-emerald-200/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 border border-emerald-300">
            {/* Abstract Background Decor */}
            <div className="absolute -right-8 -top-12 w-48 h-48 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute right-20 -bottom-12 w-32 h-32 bg-teal-400/40 blur-2xl rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
              <div className="w-16 h-16 bg-white shrink-0 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
                <FontAwesomeIcon icon={faCheck} className="text-3xl text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  {t("list.completed", { defaultValue: 'Completed' })}
                </h2>
                <p className="text-emerald-50 font-bold text-sm mt-1 opacity-90">
                  {t("notifications.list_completed", { defaultValue: 'Purchase completed successfully!' })}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex shrink-0 self-start sm:self-center">
               <span className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl text-white font-black text-xs uppercase border border-white/30 truncate shadow-sm">
                  {list.final_price > 0 ? `${t("list.final_price", { defaultValue: 'Final Price' })}: ${list.final_price.toFixed(2)}€` : t("list.completed", { defaultValue: 'Completed' })}
               </span>
            </div>
          </div>
        )}

        {/* Description Section (Stand-alone) */}
        {list.description && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-slate-500 text-sm font-medium opacity-80 max-w-full bg-white/40 backdrop-blur-sm px-5 py-4 rounded-2xl border border-white/60 shadow-sm leading-relaxed">
              {list.description}
            </p>
          </div>
        )}

        {/* Progress Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white mb-8 overflow-hidden relative group">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5">
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-sm font-black text-slate-800 uppercase">{t("list.progress", { defaultValue: 'Shopping Progress' })} — {Math.round(progress)}%</span>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-lg border border-white">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black uppercase text-slate-400">{pickedCount} {t("list.picked", { defaultValue: 'picked' })}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-lg border border-white">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] font-black uppercase text-slate-400">{totalItems - pickedCount} {t("list.pending", { defaultValue: 'pending' })}</span>
                </div>
              </div>
            </div>
            <AddShoppingListItemForm listId={Number(id)} />
          </div>
          <div className="h-4 w-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items List Section */}
        <div className="flex flex-col gap-6">
          <ShoppingListFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategories={selectedCategories}
            onToggleCategory={(cat) => {
              setSelectedCategories(prev => 
                prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
              )
            }}
            onClearCategories={() => setSelectedCategories([])}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            totalCount={items.length}
            filteredCount={filteredItems.length}
            availableCategories={availableCategories}
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-white/60 animate-in fade-in zoom-in duration-700">
              <FontAwesomeIcon icon={faBasketShopping} className="text-7xl mb-6 text-slate-300" />
              <h2 className="text-2xl font-black text-slate-800 mb-2">{t("list.empty_state", { defaultValue: 'Your list is empty' })}</h2>
              <p className="text-slate-500 font-bold mb-8">{t("list.empty_description", { defaultValue: 'Start adding products using the button above' })}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20 animate-in fade-in duration-500">
                  <FontAwesomeIcon icon={faSearch} className="text-5xl mb-4 text-slate-300" />
                  <p className="text-slate-400 font-bold">{t("list.no_results", { defaultValue: 'No products found' })}</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategories([]); setStatusFilter('all'); }}
                    className="mt-4 text-indigo-600 font-black text-xs uppercase hover:underline cursor-pointer"
                  >
                    {t("list.reset_filters", { defaultValue: 'Reset filters' })}
                  </button>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <ShoppingListItemCard key={item.id} item={item} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <FinalPriceModal 
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        onConfirm={handlePriceConfirm}
        listName={list.name}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteList}
        title={t("list.delete_title")}
        message={t("list.delete_message", { name: list.name, defaultValue: `This action cannot be undone. The list "{{name}}" and all its products will be deleted.` })}
        confirmText={t("list.delete_permanent", { defaultValue: 'Delete permanently' })}
        cancelText={t("common.cancel", { defaultValue: 'Cancel' })}
      />
    </main>
  )
}