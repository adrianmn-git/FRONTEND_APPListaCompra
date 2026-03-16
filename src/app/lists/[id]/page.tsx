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
import { faChevronLeft, faCheck, faTrash, faBasketShopping, faSearch, faEuroSign } from '@fortawesome/free-solid-svg-icons'
import EditShoppingListForm from '@/shopping-list/components/EditShoppingListForm'
import FinalPriceModal from '@/shopping-list/components/FinalPriceModal'
import ConfirmModal from '@/components/ui/ConfirmModal'

const SHOP_LABELS: Record<string, string> = {
// ... existing labels
  mercadona: "Mercadona", alcampo: "Alcampo", sorli: "Sorli",
  esclat: "Esclat", bonpreusa: "Bonpreu", caprabo: "Caprabo", carrefour: "Carrefour",
}

export default function ShoppingListDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { getList, completeList, deleteList, updateList } = useShoppingList()
  const { items, loading, loadItems, removeItem } = useShoppingListItems()

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

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50 -z-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">

        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl shadow-slate-200/50 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-6 h-6" />
            </button>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-10">
                <h1 className="text-3xl md:text-5xl font-black text-slate-800 drop-shadow-sm">
                  {list.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black uppercase text-indigo-500 bg-white px-3 py-3 rounded-3xl border border-indigo-50 shadow-sm">
                    {SHOP_LABELS[list.shop] ?? list.shop}
                  </span>
                  {list.completed && (
                    <span className="text-xs font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-3 rounded-3xl border border-emerald-100 shadow-sm">
                      Finalizada
                    </span>
                  )}
                  {list.final_price > 0 && (
                    <span className="text-xs font-black uppercase text-amber-600 bg-amber-50 px-4 py-3 rounded-3xl border border-amber-100 shadow-sm flex items-center gap-2">
                       <FontAwesomeIcon icon={faEuroSign} className="text-[10px]" />
                       {list.final_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!list.completed && (
              <div className="flex flex-col items-end gap-2 px-1">
                <button
                  onClick={handleCompleteList}
                  disabled={pickedCount < totalItems || totalItems === 0}
                  className={`font-black text-xs uppercase px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center gap-2 ${
                    pickedCount < totalItems || totalItems === 0
                      ? 'bg-slate-200 text-slate-400 shadow-slate-100 cursor-not-allowed grayscale'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-100 hover:shadow-emerald-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer'
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} className="w-5 h-5" />
                  Cerrar Compra
                </button>
                {pickedCount < totalItems && totalItems > 0 && (
                  <span className="text-[10px] font-bold text-amber-500 animate-pulse bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    Recoge todos los productos para finalizar
                  </span>
                )}
              </div>
            )}

            <EditShoppingListForm 
              list={list} 
              className="bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 p-4 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center icon-lg"
            />
            <button
              onClick={handleDeleteList}
              className="bg-white hover:bg-red-50 text-red-400 hover:text-red-500 p-4 rounded-2xl border border-red-50 shadow-xl shadow-red-100/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Eliminar lista"
            >
              <FontAwesomeIcon icon={faTrash} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Description Section (Stand-alone) */}
        {list.description && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-slate-500 text-sm font-medium opacity-80 max-w-full bg-white/40 backdrop-blur-sm px-5 py-4 rounded-2xl border border-white/60 shadow-sm leading-relaxed">
              {list.description}
            </p>
          </div>
        )}

        {/* Progress Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-4xl shadow-2xl shadow-indigo-100/50 border border-white mb-8 overflow-hidden relative group">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 px-5 py-4">
            <div className="flex-1">
              <div className="flex flex-row items-center justify-between mb-5">
                <span className="text-sm font-black text-slate-800 uppercase pr-4">Progreso de la Compra - {Math.round(progress)}%</span>
                <AddShoppingListItemForm listId={Number(id)} />
              </div>
              <div className="flex gap-1">
                <div className="flex items-center gap-2 bg-white/50 px-3 rounded-xl border border-white">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black uppercase text-slate-400">{pickedCount} recogidos</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-3 rounded-xl border border-white">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] font-black uppercase text-slate-400">{totalItems - pickedCount} pendientes</span>
                </div>
              </div>  
            </div>
          </div>
          <div className="h-5 w-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-500 rounded-sm transition-all duration-1000 ease-out"
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
              <h2 className="text-2xl font-black text-slate-800 mb-2">Tu lista está vacía</h2>
              <p className="text-slate-500 font-bold mb-8">Empieza añadiendo productos con el botón superior</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20 animate-in fade-in duration-500">
                  <FontAwesomeIcon icon={faSearch} className="text-5xl mb-4 text-slate-300" />
                  <p className="text-slate-400 font-bold">No se encontraron productos que coincidan con los filtros</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategories([]); setStatusFilter('all'); }}
                    className="mt-4 text-indigo-600 font-black text-xs uppercase hover:underline cursor-pointer"
                  >
                    Restablecer filtros
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
        title="¿Eliminar esta lista?"
        message={`¿Estás seguro de que quieres eliminar "${list.name}"? Esta acción borrará todos los productos y no se puede deshacer.`}
        confirmText="Eliminar permanentemente"
        cancelText="Volver atrás"
      />
    </main>
  )
}