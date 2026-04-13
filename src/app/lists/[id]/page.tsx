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
import { faChevronLeft, faCheck, faTrash, faBasketShopping, faSearch, faEuroSign, faPenToSquare, faStore, faTruck, faCartShopping, faBuilding, faPen } from '@fortawesome/free-solid-svg-icons'
import EditShoppingListForm from '@/shopping-list/components/EditShoppingListForm'
import FinalPriceModal from '@/shopping-list/components/FinalPriceModal'
import ConfirmAlertDialog from '@/components/ui/ConfirmAlertDialog'
import { useI18n } from '@/i18n/hooks/useI18n'
import { getShopConfig } from '@/shopping-list/utils/shopConfig'

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

  const currentShopTheme = getShopConfig(list.shop)

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative overflow-x-hidden font-sans pb-32">
      {/* 1. SEAMLESS CLEAN BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none mix-blend-multiply z-0"></div>
      
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-slate-200/20 to-transparent pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        
        {/* 2. CONSOLIDATED PREMIUM HEADER */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 p-6 sm:p-10 mb-10 overflow-hidden relative group">
          <div className="absolute -right-24 -top-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest ${currentShopTheme.solid} text-white`}>
                  {currentShopTheme.logoUrl ? (
                    <div className="w-3.5 h-3.5 shrink-0 mix-blend-screen opacity-90">
                      <img src={currentShopTheme.logoUrl} alt={currentShopTheme.label} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <FontAwesomeIcon icon={currentShopTheme.icon} className="text-[10px]" />
                  )}
                  {currentShopTheme.label}
                </div>
                
                {list.final_price > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100/50">
                    <FontAwesomeIcon icon={faEuroSign} />
                    {list.final_price.toFixed(2)}
                  </span>
                )}
                
                {list.completed && (
                   <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100/50">
                      {t("list.completed", { defaultValue: 'COMPLETED' })}
                   </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4 break-words">
                {list.name}
              </h1>

              {list.description && (
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-2xl">
                  {list.description}
                </p>
              )}
            </div>

            {/* Stats Pills Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
               {/* Progress Pill */}
              <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-1.5 pr-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                   <div className="relative w-7 h-7">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-emerald-500 transition-all duration-1000" strokeWidth="4" strokeDasharray={`${progress}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)"></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-600">
                        {Math.round(progress)}%
                      </div>
                   </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t("list.progress", { defaultValue: 'Progress' })}</span>
                  <span className="text-sm font-black text-slate-700 leading-none">
                    <span className="text-emerald-500">{pickedCount}</span>
                    <span className="text-slate-300 mx-0.5">/</span>
                    {totalItems}
                  </span>
                </div>
              </div>

              {/* Actions integrated */}
              <div className="flex items-center gap-1.5 bg-slate-50/50 border border-slate-100 p-1.5 rounded-2xl">
                {!list.completed && (
                  <EditShoppingListForm 
                    list={list} 
                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                  />
                )}
                <button
                  onClick={handleDeleteList}
                  disabled={list.completed}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm ${
                    list.completed
                      ? 'bg-slate-50 text-slate-200 cursor-not-allowed'
                      : 'bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 active:scale-95 cursor-pointer'
                  }`}
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- CELEBRATION BANNER FOR COMPLETED LISTS (Simplified) --- */}
        {list.completed && (
          <div className="w-full bg-emerald-500 rounded-[2rem] p-6 mb-10 shadow-xl shadow-emerald-500/10 flex items-center justify-between gap-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 border border-emerald-400/50">
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <FontAwesomeIcon icon={faCheck} className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {t("list.completed", { defaultValue: 'Purchase Completed' })}
                </h2>
                <p className="text-emerald-50/80 font-bold text-xs">
                  {t("notifications.list_completed", { defaultValue: 'Everything is collected and finished.' })}
                </p>
              </div>
            </div>
            {list.final_price > 0 && (
              <div className="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white font-black text-xs uppercase tracking-widest border border-white/20">
                {list.final_price.toFixed(2)}€
              </div>
            )}
          </div>
        )}

        {/* 3. TOOLBAR SECTION (SIMPLER) */}
        <div className="flex flex-col gap-6 mb-12">
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div className="w-full lg:flex-1">
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
            </div>
            {!list.completed && (
              <div className="w-full lg:w-auto shrink-0 flex justify-end">
                <AddShoppingListItemForm listId={Number(id)} />
              </div>
            )}
          </div>

          {/* 4. ITEMS LIST (REFINED SPACING) */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-300" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-200/50 animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
                <FontAwesomeIcon icon={faBasketShopping} className="text-3xl text-slate-200" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">{t("list.empty_state", { defaultValue: 'Your list is empty' })}</h2>
              <p className="text-slate-400 font-bold text-sm max-w-sm mx-auto leading-relaxed">{t("list.empty_description", { defaultValue: 'Start adding products using the button above to build your perfect shopping list.' })}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white/40 rounded-[2.5rem] w-full border border-dashed border-slate-200 animate-in fade-in duration-500">
                  <FontAwesomeIcon icon={faSearch} className="text-4xl mb-4 text-slate-200" />
                  <p className="text-slate-400 font-bold text-sm">{t("list.no_results", { defaultValue: 'No products found' })}</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategories([]); setStatusFilter('all'); }}
                    className="mt-3 text-indigo-500 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {t("list.reset_filters", { defaultValue: 'Reset filters' })}
                  </button>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 gap-1.5">
                  {filteredItems.map((item) => (
                    <ShoppingListItemCard 
                      key={item.id} 
                      item={item} 
                      disabled={list.completed} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. FLOATING ACTION BUTTON (FAB) FOR COMPLETE LIST */}
      {!list.completed && items.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <button
            onClick={handleCompleteList}
            disabled={pickedCount < totalItems}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${
              pickedCount < totalItems
                ? 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-1 active:scale-95 cursor-pointer'
            }`}
          >
            <FontAwesomeIcon icon={faCheck} className="text-lg" />
            <span>{t("list.complete", { defaultValue: 'Complete Purchase' })}</span>
            <div className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              {pickedCount}/{totalItems}
            </div>
          </button>
        </div>
      )}

      <FinalPriceModal 
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        onConfirm={handlePriceConfirm}
        listName={list.name}
      />
      <ConfirmAlertDialog
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