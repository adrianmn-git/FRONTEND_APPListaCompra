"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faCheck, faSearch } from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export interface CustomSelectOption<T> {
  value: T
  label: string
  icon?: IconDefinition
  color?: string
}

interface CustomSelectProps<T> {
  value: T
  options: CustomSelectOption<T>[]
  onChange: (value: T) => void
  label?: string
  placeholder?: string
  className?: string
}

export default function CustomSelect<T extends string | number>({
  value,
  options,
  onChange,
  label,
  placeholder = "Selecciona",
  className = ""
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  // Filter options based on search query
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  const toggleDropdown = () => {
    if (!isOpen) updatePosition()
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("")
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isInsideTrigger = containerRef.current?.contains(target)
      const isInsideDropdown = dropdownRef.current?.contains(target)
      
      if (!isInsideTrigger && !isInsideDropdown) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      window.addEventListener("scroll", updatePosition)
      window.addEventListener("resize", updatePosition)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", updatePosition)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen])

  return (
    <div className={`flex flex-col gap-1.5 w-full relative ${className}`} ref={containerRef}>
      {label && <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">{label}</label>}
      
      <button
        type="button"
        id="custom-select-trigger"
        onClick={toggleDropdown}
        className={`w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 h-11 flex items-center justify-between text-slate-800 font-bold transition-all hover:border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 group cursor-pointer ${isOpen ? 'border-indigo-400 ring-4 ring-indigo-500/10' : ''}`}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && (
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform group-hover:scale-105 ${selectedOption.color || 'bg-indigo-50 text-indigo-500'}`}>
              <FontAwesomeIcon icon={selectedOption.icon} />
            </div>
          )}
          <span className={`text-[11px] font-black transition-colors ${selectedOption ? "text-slate-800" : "text-slate-400"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500 font-bold' : ''}`} 
        />
      </button>

      {/* Dropdown Menu - Portalized */}
      {isOpen && mounted && createPortal(
        <div 
          ref={dropdownRef}
          style={{ 
            position: 'absolute',
            top: dropdownPos.top + 8,
            left: dropdownPos.left,
            width: dropdownPos.width,
          }}
          className="z-[20000] bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-300/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top select-none flex flex-col"
        >
          {/* Internal Search */}
          {options.length > 5 && (
            <div className="p-2 border-b border-slate-50">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-[0.8rem] text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-300 transition-all placeholder:text-slate-400"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]" 
                />
              </div>
            </div>
          )}

          <div className="p-1.5 max-h-[250px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[10px] font-black uppercase text-slate-400">Sin resultados</p>
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[0.9rem] transition-all mb-1 last:mb-0 cursor-pointer ${
                    value === option.value 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 group'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon && (
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform group-hover:scale-110 ${option.color || 'bg-indigo-50 text-indigo-500'}`}>
                        <FontAwesomeIcon icon={option.icon} />
                      </div>
                    )}
                    <span className={`text-xs font-black tracking-tight ${value === option.value ? 'text-indigo-800' : 'text-slate-700'}`}>
                      {option.label}
                    </span>
                  </div>
                  {value === option.value && (
                    <div className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 animate-in zoom-in duration-300">
                      <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
