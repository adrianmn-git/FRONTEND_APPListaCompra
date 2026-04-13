import React, { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string | ReactNode;
  icon?: ReactNode;
  colorClass?: string;
}

export default function StatCard({ title, value, subtitle, icon, colorClass = "text-indigo-600 bg-indigo-50" }: StatCardProps) {
  // Extract color for the ambient glow from the colorClass if possible
  const isIndigo = colorClass.includes('indigo');
  const isEmerald = colorClass.includes('emerald');
  const isSky = colorClass.includes('sky');
  const isAmber = colorClass.includes('amber');
  
  const glowColor = isIndigo ? 'from-indigo-500/10' : 
                    isEmerald ? 'from-emerald-500/10' :
                    isSky ? 'from-sky-500/10' :
                    isAmber ? 'from-amber-500/10' : 'from-slate-500/10';

  return (
    <Card className="group rounded-[2rem] shadow-xl shadow-slate-200/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 hover:ring-slate-900/10 transition-all duration-500 hover:-translate-y-1.5 border-transparent overflow-hidden cursor-default p-0 flex h-full">
      <CardContent className="p-6 flex items-center gap-6 relative w-full">
        {/* Ambient Glow */}
        <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br ${glowColor} to-transparent opacity-40 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-1000 ease-out pointer-events-none z-0`}></div>

        {icon && (
          <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner transform group-hover:scale-110 transition-transform duration-500 ${colorClass}`}>
            {icon}
          </div>
        )}
        <div className="relative z-10 flex-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
          <div className="text-4xl font-black text-slate-800 tracking-tight mt-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-slate-800 group-hover:to-indigo-600 transition-all duration-500">
            {value}
          </div>
          {subtitle && <p className="text-xs font-bold text-slate-500 mt-1 opacity-80">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
