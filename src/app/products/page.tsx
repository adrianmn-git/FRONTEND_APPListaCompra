"use client"

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProduct } from '@/product/hooks/useProduct'
import { Product } from '@/product/entity/Product'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronLeft, faSearch, faFilter, faChevronDown, faStar, faPlus,
  faAppleWhole, faCarrot, faDrumstickBite, faFish, faGlassWater, 
  faEgg, faBreadSlice, faBowlFood, faUtensils, faSeedling,
  faIcicles, faBoxArchive, faCookie, faCandyCane, faJar, faPepperHot,
  faOilCan, faGlassWhiskey, faWineGlass, faSoap, faBroom, faBaby,
  faPaw, faBox
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useI18n } from '@/i18n/hooks/useI18n'
import AddProductToListModal from "@/product/components/AddProductToListModal"
import ProductActions from "@/product/components/ProductActions"
import { CATEGORY_CONFIG, getCategoryConfig, getCategoryLabel } from "@/product/utils/categoryConfig"

export default function CatalogPage() {
  const router = useRouter()
  const { products, loadProducts, loading } = useProduct()
  const { t } = useI18n()

  const [searchQuery, setSearchQuery] = useState('')
  // Multi-select state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [addingProduct, setAddingProduct] = useState<Product | null>(null)



  useEffect(() => {
    loadProducts()
  }, [])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    )
  }

  const clearCategories = () => setSelectedCategories([])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q))
    }

    // Sort alphabetically
    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [products, searchQuery, selectedCategories])



  // Calculate dynamic backgrounds
  const dynamicBg1 = selectedCategories.length > 0 ? getCategoryConfig(selectedCategories[0]).gradient : 'from-indigo-300/40 to-purple-400/20';
  const dynamicBg2 = selectedCategories.length > 1 ? getCategoryConfig(selectedCategories[1]).gradient : (selectedCategories.length === 1 ? dynamicBg1 : 'from-emerald-300/30 to-sky-400/20');

  // Format name safely
  const formatName = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return (
    <main className="min-h-screen bg-transparent relative overflow-x-hidden font-sans transition-colors duration-1000">
      
      {/* Universal Noise Background for Texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] bg-[length:250px_250px] opacity-[0.06] pointer-events-none"></div>

      {/* Dynamic Backgrounds (Discreet & Highly Blurred) */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br ${dynamicBg1} blur-[160px] rounded-full pointer-events-none mix-blend-multiply z-0 transition-all duration-[2000ms] ease-in-out opacity-10`}></div>
      <div className={`absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-gradient-to-bl ${dynamicBg2} blur-[160px] rounded-full pointer-events-none mix-blend-multiply z-0 transition-all duration-[2000ms] ease-in-out opacity-10`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        
        {/* Navigation & Titles */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-8">
          <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 text-white p-10 md:p-14 mb-10 shadow-2xl flex flex-col items-center text-center justify-center min-h-[320px] group z-20">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay bg-[length:150px_150px]"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000 z-0 pointer-events-none"></div>
          
          <div className="relative z-10 w-full flex flex-col items-center text-center justify-center p-4">
            <div className="flex items-center gap-3 mb-6">
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 shadow-inner">
                 Catálogo Global
               </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-tight drop-shadow-md">
              Base de Datos
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed flex items-center justify-center gap-4 mt-2">
              Buscador global de productos de tu cuenta 
              <span className="bg-slate-800 text-indigo-300 px-3 py-1 rounded-full text-xs font-black border border-slate-700 shadow-inner translate-y-[-1px]">
                {products.length} Items
              </span>
            </p>
          </div>
        </section>
        </div>

        {/* Universal Control Center */}
        <section className="bg-white rounded-[3rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-6 relative z-30 animate-in fade-in slide-in-from-bottom-8 duration-1000 mb-8">
          
          {/* Top Control Row: Search & Add */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
            <div className="relative w-full">
              <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar producto por nombre..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400/80 px-14 py-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all font-black shadow-inner"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-black text-sm transition-colors cursor-pointer">
                  ✕
                </button>
              )}
            </div>
            
            <div className="shrink-0 w-full lg:w-auto">
               <ProductActions variant="horizontal" />
            </div>
          </div>

          {/* Bottom Row: Categories */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between px-2 mb-4">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtrar por Categoría Multiselección</h3>
               {selectedCategories.length > 0 && (
                  <button onClick={clearCategories} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer bg-indigo-50 px-2 py-1 rounded-md mb-1">
                    Limpiar ({selectedCategories.length})
                  </button>
               )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 px-1 pb-1">
            {Object.entries(CATEGORY_CONFIG).map(([catId, config]) => {
              const isSelected = selectedCategories.includes(catId);
              return (
                <button
                  key={catId}
                  onClick={() => toggleCategory(catId)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300 font-bold text-xs cursor-pointer ${
                    isSelected 
                      ? `border-transparent bg-gradient-to-r ${config.gradient} text-white shadow-md shadow-slate-200 hover:shadow-lg transform -translate-y-[1px]`
                      : `border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white hover:shadow-sm`
                  }`}
                >
                  <FontAwesomeIcon icon={config.icon} className={isSelected ? 'text-white' : config.text} />
                  {t(config.i18nKey, { defaultValue: config.defaultLabel })}
                </button>
              )
            })}
            </div>
          </div>
        </section>

        {/* Products Grid (Bento Style) */}
        <div className="mt-8 relative z-20">
          {loading ? (
             <div className="flex justify-center py-32">
               <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600" />
             </div>
          ) : filteredProducts.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faSearch} className="text-4xl text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{t("products.no_products", { defaultValue: 'No products found' })}</h3>
                <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
               {filteredProducts.map(product => {
                 const config = getCategoryConfig(product.category);
                 
                 return (
                   <div 
                     key={product.id}
                     className="group bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 hover:ring-slate-900/10 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between gap-6 cursor-default relative overflow-hidden"
                   >
                     {/* Ambient Card Background Glow */}
                     <div className={`absolute -bottom-16 -right-16 w-40 h-40 bg-gradient-to-br ${config.gradient} opacity-[0.05] blur-[40px] rounded-full group-hover:scale-150 group-hover:opacity-[0.1] transition-all duration-1000 ease-out pointer-events-none z-0`}></div>
                     
                     <div className="relative z-10 flex items-start justify-between gap-4">
                        {/* Premium Apple-esque Icon Badge */}
                        <div className="relative group/badge">
                          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-2xl blur-md opacity-20 group-hover/badge:opacity-40 transition-opacity duration-500`}></div>
                          <div className={`relative w-14 h-14 bg-gradient-to-br ${config.gradient} p-[1px] rounded-2xl shadow-sm transform group-hover:rotate-[8deg] group-hover:scale-110 transition-transform duration-500 ease-out-back flex items-center justify-center`}>
                             <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-[0.9rem] flex items-center justify-center overflow-hidden">
                               <FontAwesomeIcon icon={config.icon} className={`text-xl ${config.text}`} />
                             </div>
                          </div>
                        </div>

                        {/* Add Button */}
                        <button 
                          onClick={() => setAddingProduct(product)}
                          className="shrink-0 w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-full transition-colors duration-300 shadow-sm active:scale-95 cursor-pointer"
                          aria-label={t("products.add_to_list", { defaultValue: 'Add to List' })}
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-sm" />
                        </button>
                     </div>

                     <div className="relative z-10 flex flex-col gap-1">
                        <h3 className="text-xl font-black text-slate-800 tracking-[-0.02em] leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-indigo-600 transition-all duration-500 line-clamp-2">
                          {formatName(product.name)}
                        </h3>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">
                          {getCategoryLabel(product.category, t)}
                        </p>
                     </div>
                   </div>
                 )
               })}
             </div>
          )}
        </div>
      </div>

      {/* Global Add Product Modal Portal */}
      <AddProductToListModal 
        product={addingProduct} 
        onClose={() => setAddingProduct(null)} 
      />
    </main>
  )
}
