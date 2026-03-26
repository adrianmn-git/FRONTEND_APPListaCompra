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
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useI18n } from '@/i18n/hooks/useI18n'
import { SHOP_CONFIG } from '@/shopping-list/utils/shopConfig'

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
    <main className="min-h-screen bg-[#F8FAFC] relative overflow-x-hidden font-sans pb-32">
      {/* 1. SEAMLESS AMBIENT BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-multiply z-0"></div>
      
      {/* Massive soft glowing blobs that fade seamlessly */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[120%] ${currentShopTheme.bg.replace('bg-', 'from-')}/15 via-transparent to-transparent bg-gradient-to-br blur-[100px] rounded-[100%] transform -rotate-12`}></div>
        <div className={`absolute top-[10%] -right-[10%] w-[50%] h-[100%] ${currentShopTheme.bg.replace('bg-', 'from-')}/10 via-transparent to-transparent bg-gradient-to-bl blur-[120px] rounded-[100%] transform rotate-12`}></div>
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[80%] bg-indigo-400/5 blur-[120px] rounded-[100%]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        
        {/* 2. BENTO GRID HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* Main Info Box (Spans 8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 p-8 sm:p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 transition-opacity pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm text-xs font-black uppercase tracking-widest ${currentShopTheme.bg} text-white`}>
                  {SHOP_CONFIG[list.shop as keyof typeof SHOP_CONFIG]?.logoUrl ? (
                    <div className="w-4 h-4 shrink-0 mix-blend-screen opacity-90">
                      <img src={SHOP_CONFIG[list.shop as keyof typeof SHOP_CONFIG].logoUrl} alt={currentShopTheme.label} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <FontAwesomeIcon icon={currentShopTheme.icon} />
                  )}
                  {currentShopTheme.label}
                </div>
                
                {list.final_price > 0 && (
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider shadow-sm border border-emerald-200">
                    <FontAwesomeIcon icon={faEuroSign} />
                    {list.final_price.toFixed(2)}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-[-0.03em] leading-[1.1] mb-6 drop-shadow-sm break-words">
                {list.name}
              </h1>

              {list.description && (
                <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed max-w-2xl bg-[#F8FAFC] px-5 py-4 rounded-2xl border border-slate-100/80 break-words">
                  {list.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats & Actions (Spans 4 cols, arranged vertically) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Progress Stats Box */}
            <div className="bg-[#0F172A] rounded-[2.5rem] p-8 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.3)] text-white flex-1 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              <div className={`absolute bottom-0 left-0 w-32 h-32 ${currentShopTheme.bg.replace('bg-', 'bg-')}/10 rounded-full blur-[60px] pointer-events-none`}></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">{t("list.progress", { defaultValue: 'Progress' })}</span>
                    <span className="text-4xl font-black tracking-tighter">{Math.round(progress)}<span className="text-2xl text-slate-500">%</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">{pickedCount}</span>
                    <span className="text-slate-500 text-sm font-bold"> / {totalItems}</span>
                  </div>
                </div>
                
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-[2px]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Box */}
            <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100/60 p-3 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {list.completed ? (
                    <div className="w-14 h-14 flex items-center justify-center bg-[#F8FAFC] text-slate-300 rounded-2xl opacity-60 cursor-not-allowed">
                      <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                    </div>
                  ) : (
                    <EditShoppingListForm 
                      list={list} 
                      className="w-14 h-14 flex items-center justify-center bg-[#F8FAFC] hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-2xl transition-all active:scale-95 cursor-pointer group"
                    />
                  )}
                  <button
                    onClick={handleDeleteList}
                    disabled={list.completed}
                    aria-label={t("list.delete_title", { defaultValue: 'Delete' })}
                    className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${
                      list.completed
                        ? 'bg-[#F8FAFC] text-slate-300 opacity-60 cursor-not-allowed'
                        : 'bg-[#F8FAFC] hover:bg-red-50 text-slate-400 hover:text-red-500 active:scale-95 cursor-pointer group'
                    }`}
                    title={t("list.delete_title", { defaultValue: 'Delete list?' })}
                  >
                    <FontAwesomeIcon icon={faTrash} className={`w-4 h-4 ${!list.completed ? 'group-hover:scale-110 transition-transform' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleCompleteList}
                  disabled={list.completed || pickedCount < totalItems || totalItems === 0}
                  className={`h-14 flex-1 flex items-center justify-center gap-2 font-black text-[12px] uppercase tracking-wider rounded-2xl transition-all duration-300 ${
                    list.completed
                      ? 'bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed border border-slate-200'
                      : pickedCount < totalItems || totalItems === 0
                        ? 'bg-[#F8FAFC] text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 cursor-pointer active:scale-95'
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} className="text-sm" />
                  <span className="hidden sm:inline">{list.completed ? t("list.completed", { defaultValue: 'Completed' }) : t("list.complete", { defaultValue: 'Complete' })}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* --- CELEBRATION BANNER FOR COMPLETED LISTS --- */}
        {list.completed && (
          <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.5rem] p-8 md:p-10 mb-12 shadow-2xl shadow-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
            {/* Abstract Background Decor */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-32 -right-10 w-96 h-96 bg-white/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full sm:w-auto text-center sm:text-left">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center shadow-lg transform -rotate-6 border border-white/30">
                <FontAwesomeIcon icon={faCheck} className="text-4xl text-white drop-shadow-md" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  {t("list.completed", { defaultValue: 'Purchase Completed' })}
                </h2>
                <p className="text-emerald-50/90 font-bold text-sm">
                  {t("notifications.list_completed", { defaultValue: 'Everything is collected and finished.' })}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex shrink-0 sm:self-center w-full sm:w-auto mt-4 sm:mt-0">
               <span className="w-full sm:w-auto text-center bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest border border-white/30 shadow-lg">
                  {list.final_price > 0 ? `${t("list.final_price", { defaultValue: 'Final Price' })}: ${list.final_price.toFixed(2)}€` : t("list.completed", { defaultValue: 'Completed' })}
               </span>
            </div>
          </div>
        )}

        {/* Items List Section */}
        <div className="flex flex-col gap-8 mb-16">
          
          {/* Unified Filter & Add Toolbar */}
          <div className="bg-white rounded-[2.5rem] p-4 sm:p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100/60 flex flex-col xl:flex-row justify-between xl:items-start gap-6 relative z-20">
            <div className="w-full xl:w-auto xl:flex-1">
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
              <div className="w-full xl:w-auto shrink-0 flex justify-end xl:mt-[4px]">
                <AddShoppingListItemForm listId={Number(id)} />
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in fade-in zoom-in duration-700">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
                <FontAwesomeIcon icon={faBasketShopping} className="text-4xl text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">{t("list.empty_state", { defaultValue: 'Your list is empty' })}</h2>
              <p className="text-slate-500 font-bold max-w-md mx-auto">{t("list.empty_description", { defaultValue: 'Start adding products using the button above to build your perfect shopping list.' })}</p>
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
                <div className="w-full flex flex-col gap-2">
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