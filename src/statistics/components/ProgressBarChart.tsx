import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useI18n } from "@/i18n/hooks/useI18n"

export interface ProgressBarData {
  id: string;
  label: string;
  count: number;
  percentage: number;
  icon?: any;
  logoUrl?: string;
  solidColorClass: string;
  bgColorClass: string;
  textColorClass: string;
}

export default function ProgressBarChart({ title, data, emptyMessage }: { title: string, data: ProgressBarData[], emptyMessage?: string }) {
  const { t } = useI18n()
  const displayEmptyMessage = emptyMessage || t("stats.empty_data", { defaultValue: "No data available yet" })

  if (data.length === 0) {
    return (
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6">{title}</h3>
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-slate-500 font-bold text-lg">{displayEmptyMessage}</p>
        </div>
      </div>
    )
  }

  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
      <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
        <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
        {title}
      </h3>
      <div className="space-y-8">
        {data.map((item) => (
          <div key={item.id} className="relative group">
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-4">
                {item.logoUrl ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-200 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-xl"></div>
                    <img src={item.logoUrl} alt={item.label} className="relative w-12 h-12 rounded-xl shadow-sm object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ) : item.icon ? (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner ${item.bgColorClass} ${item.textColorClass}`}>
                    <FontAwesomeIcon icon={item.icon} className="w-6 h-6" />
                  </div>
                ) : null}
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors uppercase text-[10px] tracking-widest">{item.label}</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-black text-slate-900 text-2xl tracking-tighter">{item.count}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t("stats.units", { defaultValue: "Units" })}</span>
                  </div>
                </div>
              </div>
              <div className="text-right pb-1">
                <span className="text-sm font-black text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            {/* Background track */}
            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden ring-1 ring-slate-100 shadow-inner">
              {/* Animated fill with subtle gradient */}
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out-back relative ${item.solidColorClass}`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
