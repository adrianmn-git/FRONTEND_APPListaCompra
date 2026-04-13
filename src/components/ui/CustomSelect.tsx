"use client"

import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { useI18n } from "@/i18n/hooks/useI18n"
import { cn } from "@/lib/utils"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export interface CustomSelectOption<T> {
  value: T
  label: string
  icon?: IconDefinition
  logoUrl?: string
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
  const [open, setOpen] = React.useState(false)
  const { t } = useI18n()

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={cn("flex flex-col gap-1.5 w-full relative", className)}>
      {label && <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 h-11 flex items-center justify-between text-slate-800 font-bold transition-all hover:border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 group cursor-pointer",
              open ? 'border-indigo-400 ring-4 ring-indigo-500/10' : ''
            )}
          >
            <div className="flex items-center gap-3">
              {selectedOption?.logoUrl ? (
                <img src={selectedOption.logoUrl} alt={selectedOption.label} className="w-7 h-7 rounded-full shadow-sm shadow-black/20 object-cover" />
              ) : selectedOption?.icon ? (
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform group-hover:scale-105", selectedOption.color || 'bg-indigo-50 text-indigo-500')}>
                  <FontAwesomeIcon icon={selectedOption.icon} />
                </div>
              ) : null}
              <span className={cn("text-[11px] font-black transition-colors", selectedOption ? "text-slate-800" : "text-slate-400")}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className={cn("w-3 h-3 text-slate-400 transition-transform duration-300", open ? 'rotate-180 text-indigo-500 font-bold' : '')} 
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-[20000] min-w-[var(--radix-popover-trigger-width)] rounded-2xl border-slate-100 shadow-2xl shadow-slate-300/60" align="start">
          <Command>
            {options.length > 5 && (
              <CommandInput placeholder={t("common.search", { defaultValue: 'Search...' })} className="h-11" />
            )}
            <CommandList className="max-h-[250px] p-1.5">
              <CommandEmpty className="py-8 text-center text-[10px] font-black uppercase text-slate-400">{t("common.no_results", { defaultValue: 'No results' })}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={String(option.value)}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-[0.9rem] mb-1 last:mb-0 cursor-pointer",
                      value === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 group'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {option.logoUrl ? (
                        <img src={option.logoUrl} alt={option.label} className="w-7 h-7 rounded-full shadow-sm shadow-black/10 object-cover" />
                      ) : option.icon ? (
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform group-hover:scale-110", option.color || 'bg-indigo-50 text-indigo-500')}>
                          <FontAwesomeIcon icon={option.icon} />
                        </div>
                      ) : null}
                      <span className={cn("text-xs font-black tracking-tight", value === option.value ? 'text-indigo-800' : 'text-slate-700')}>
                        {option.label}
                      </span>
                    </div>
                    {value === option.value && (
                      <div className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 animate-in zoom-in duration-300">
                        <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
