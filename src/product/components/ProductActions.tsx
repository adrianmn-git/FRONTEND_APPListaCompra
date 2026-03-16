"use client"

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark, faChevronDown, faAppleWhole, faDrumstickBite, faGlassWater, faBoxArchive, faIcicles, faGlassWhiskey, faBroom, faSoap, faBox } from "@fortawesome/free-solid-svg-icons"
import { useProduct } from '../hooks/useProduct'
import { ProductCategory } from '../entity/Product'
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect"

const CATEGORIES: CustomSelectOption<ProductCategory>[] = [
  { value: 'fruit', label: 'Fruta y Verdura', icon: faAppleWhole, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { value: 'meat', label: 'Carne y Pescado', icon: faDrumstickBite, color: 'bg-red-50 text-red-600 border-red-100' },
  { value: 'dairy', label: 'Lácteos y Huevos', icon: faGlassWater, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { value: 'canned', label: 'Despensa', icon: faBoxArchive, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { value: 'frozen', label: 'Congelados', icon: faIcicles, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  { value: 'drinks', label: 'Bebidas', icon: faGlassWhiskey, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { value: 'cleaning', label: 'Limpieza', icon: faBroom, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'hygiene', label: 'Higiene', icon: faSoap, color: 'bg-teal-50 text-teal-600 border-teal-100' },
  { value: 'other', label: 'Otros', icon: faBox, color: 'bg-slate-50 text-slate-600 border-slate-100' },
]

export default function ProductActions() {
  const { addProduct } = useProduct()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProductCategory>('fruit')
  const [isLoading, setIsLoading] = useState(false)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    setErrorLocal(null)
    try {
      await addProduct({
        name: name.trim(),
        category
      })
      setName('')
      setIsOpen(false)
    } catch (err: any) {
      setErrorLocal(err.message || 'Error al crear producto')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Trigger Button - More Formal Design */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full relative group overflow-hidden bg-slate-900 hover:bg-emerald-500 p-3 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex flex-col items-center text-center gap-2"
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
          <h3 className="text-white font-bold text-lg">Registrar Producto</h3>
        </div>
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
              <h2 className="text-2xl font-bold text-slate-800">Nuevo Producto</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Nombre del producto</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Plátanos de Canarias"
                  required
                  className="w-full h-11 bg-slate-50 border-2 border-slate-100 rounded-xl px-6 text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                />
              </div>

              <CustomSelect
                label="Categoría"
                value={category}
                options={CATEGORIES}
                onChange={(val) => setCategory(val)}
              />

              {errorLocal && (
                <p className="text-red-500 text-sm font-semibold ml-1">{errorLocal}</p>
              )}

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
                  {isLoading ? "Registrando..." : "Registrar"}
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
