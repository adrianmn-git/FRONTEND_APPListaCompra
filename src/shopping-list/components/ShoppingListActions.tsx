"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useShoppingList } from "@/shopping-list/hooks/useShoppingList"
import { ShoppingList } from "@/shopping-list/entity/ShoppingList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark, faChevronDown, faBasketShopping, faShop, faTruck, faCartShopping, faStore, faBuilding } from "@fortawesome/free-solid-svg-icons"
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect"

type ShopType = ShoppingList['shop']

const SHOPS: CustomSelectOption<ShopType>[] = [
  { value: "mercadona", label: "Mercadona", icon: faCartShopping, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { value: "alcampo", label: "Alcampo", icon: faShop, color: "bg-red-50 text-red-600 border-red-100" },
  { value: "sorli", label: "Sorli", icon: faBuilding, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { value: "esclat", label: "Esclat", icon: faStore, color: "bg-orange-50 text-orange-600 border-orange-100" },
  { value: "bonpreusa", label: "Bonpreu", icon: faStore, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { value: "caprabo", label: "Caprabo", icon: faBasketShopping, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { value: "carrefour", label: "Carrefour", icon: faTruck, color: "bg-sky-50 text-sky-600 border-sky-100" },
]

export default function ShoppingListActions() {
  const { createList } = useShoppingList()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [shop, setShop] = useState<ShopType>("mercadona")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      await createList(name.trim(), shop, description.trim() || undefined)
      setName("")
      setDescription("")
      setShop("mercadona")
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>      {/* Action Button - More Formal Design */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-4 rounded-[1.5rem] transition-all duration-200 shadow-xl active:scale-95 cursor-pointer"
      >
        <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
        Nueva Lista
      </button>

      {/* Modal - More Formal and Functional */}
      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in slide-in-from-bottom-4 duration-400 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Crea una Lista</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Nombre de la lista</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Compra Semanal"
                  required
                  className="w-full h-11 bg-slate-50 border-2 border-slate-100 rounded-xl px-6 text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                />
              </div>

                <CustomSelect
                  label="Supermercado"
                  value={shop}
                  options={SHOPS}
                  onChange={(val) => setShop(val)}
                />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Descripción (opcional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Ingredientes para la cena del viernes..."
                  rows={3}
                  maxLength={500}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-6 py-3 text-slate-600 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all resize-none min-h-[80px]"
                />
                <div className="flex justify-end pr-2">
                  <span className={`text-[10px] font-black uppercase ${description.length >= 500 ? 'text-red-500' : 'text-slate-400'}`}>
                    {description.length} / 500
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Creando..." : "Crear Lista"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
