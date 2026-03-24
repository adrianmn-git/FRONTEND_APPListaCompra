"use client"

import React, { useMemo } from "react"
import { useStatistics } from "../hooks/useStatistics"
import StatCard from "./StatCard"
import ProgressBarChart, { ProgressBarData } from "./ProgressBarChart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListCheck, faCartShopping, faBoxOpen, faStore, faPiggyBank, faChartSimple, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/i18n/hooks/useI18n"
import { SHOP_CONFIG } from "@/shopping-list/utils/shopConfig"
import { CATEGORY_CONFIG } from "@/product/utils/categoryConfig"

export default function StatisticsDashboard() {
  const {
    totalLists,
    completedLists,
    totalSpent,
    completionRate,
    listsByShop,
    expensesByShop,
    cheapestShop,
    totalProducts,
    productsByCategory,
    isLoading
  } = useStatistics()
  const { t } = useI18n()

  const formattedListsByShop: ProgressBarData[] = useMemo(() => {
    return listsByShop.map((item) => {
      const config = SHOP_CONFIG[item.shop]
      return {
        id: item.shop,
        label: config.label,
        count: item.count,
        percentage: item.percentage,
        icon: config.icon,
        logoUrl: config.logoUrl,
        solidColorClass: config.solid,
        bgColorClass: config.bg,
        textColorClass: config.text
      }
    })
  }, [listsByShop])

  const formattedProductsByCategory: ProgressBarData[] = useMemo(() => {
    return productsByCategory.map((item) => {
      const config = CATEGORY_CONFIG[item.category]
      return {
        id: item.category,
        label: t(config.i18nKey, { defaultValue: config.defaultLabel }),
        count: item.count,
        percentage: item.percentage,
        icon: config.icon,
        solidColorClass: config.solid,
        bgColorClass: config.bg,
        textColorClass: config.text
      }
    })
  }, [productsByCategory, t])

  const formattedExpenses: ProgressBarData[] = useMemo(() => {
    return expensesByShop.map((item) => {
      const config = SHOP_CONFIG[item.shop]
      return {
        id: item.shop,
        label: config.label,
        count: parseFloat(item.avgPrice.toFixed(2)),
        percentage: item.avgPrice > 0 ? 100 : 0, // Using percentage visually but maybe less meaningful here
        icon: config.icon,
        logoUrl: config.logoUrl,
        solidColorClass: config.solid,
        bgColorClass: config.bg,
        textColorClass: config.text
      }
    })
  }, [expensesByShop])

  // Fix: for expenses, progress bar needs to scale to max expense.
  const expensesChartData = formattedExpenses.map(d => ({
    ...d,
    percentage: formattedExpenses.length > 0 ? (d.count / Math.max(...formattedExpenses.map(x => x.count))) * 100 : 0
  }))

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 opacity-50">
         <FontAwesomeIcon icon={faChartSimple} className="text-4xl text-slate-300 animate-bounce mb-4" />
         <p className="text-slate-500 font-bold">{t("common.loading", { defaultValue: "Loading..." })}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 relative z-10">
      
      {/* Overview Cards Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
           <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
           <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("stats.overview_title", { defaultValue: "General Overview" })}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title={t("stats.total_spent", { defaultValue: "Total Spent" })}
            value={`${totalSpent.toFixed(2)}€`}
            subtitle={t("stats.total_spent_desc", { defaultValue: "Sum of all completed purchases" })}
            icon={<FontAwesomeIcon icon={faPiggyBank} />}
            colorClass="text-emerald-600 bg-emerald-50"
          />
          <StatCard 
            title={t("stats.completion_rate", { defaultValue: "Completion Rate" })}
            value={`${completionRate.toFixed(1)}%`}
            subtitle={`${completedLists} ${t("stats.completed_lists_label", { defaultValue: "completed lists" })}`}
            icon={<FontAwesomeIcon icon={faListCheck} />}
            colorClass="text-indigo-600 bg-indigo-50"
          />
          <StatCard 
            title={t("stats.total_products", { defaultValue: "Total Products" })}
            value={totalProducts}
            subtitle={t("stats.products_in_catalog", { defaultValue: "In your global catalog" })}
            icon={<FontAwesomeIcon icon={faBoxOpen} />}
            colorClass="text-sky-600 bg-sky-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title={t("stats.total_lists", { defaultValue: "Total Lists" })}
          value={totalLists}
          icon={<FontAwesomeIcon icon={faChartSimple} />}
          colorClass="text-slate-600 bg-slate-50"
        />
        <StatCard 
          title={t("stats.amount_shops", { defaultValue: "Shops Used" })}
          value={listsByShop.length}
          icon={<FontAwesomeIcon icon={faStore} />}
          colorClass="text-amber-600 bg-amber-50"
        />
        <StatCard 
          title={t("stats.completed_lists", { defaultValue: "Completed" })}
          value={completedLists}
          icon={<FontAwesomeIcon icon={faCartShopping} />}
          colorClass="text-emerald-600 bg-emerald-50"
        />
      </div>

      {/* Cheapest shop highlight - Premium Glassmorphism Edition */}
      {cheapestShop && (
         <div className="group relative overflow-hidden rounded-[3rem] p-10 md:p-14 shadow-2xl transition-all duration-700 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-emerald-600 to-teal-500 z-0"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay bg-[length:150px_150px] z-10"></div>
            
            {/* Animated Background Icons */}
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000 z-10">
              <FontAwesomeIcon icon={faPiggyBank} className="text-[12rem]" />
            </div>
            <div className="absolute -bottom-10 -left-10 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000 z-10">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10rem]" />
            </div>

            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-emerald-50 font-black tracking-widest uppercase">{t("stats.cheapest_shop_label", { defaultValue: "Cheapest Supermarket" })}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">
                  {SHOP_CONFIG[cheapestShop.shop]?.label}
                </h2>
                <p className="text-emerald-50/80 font-medium max-w-md leading-relaxed">
                  {t("stats.cheapest_shop_info", { defaultValue: "Based on the average ticket of your completed historical purchases." })}
                </p>
              </div>

              <div className="shrink-0 relative group/stat">
                <div className="absolute inset-0 bg-white/20 blur-3xl opacity-50 group-hover/stat:opacity-80 transition-opacity rounded-full"></div>
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 text-center min-w-[200px] border border-white/20 shadow-2xl transform transition-transform duration-500 group-hover:scale-105">
                  <span className="block text-emerald-100 font-black text-[10px] uppercase tracking-widest mb-3 opacity-80">{t("stats.avg_expense_label", { defaultValue: "Average Ticket" })}</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl md:text-7xl font-black text-white tracking-tighter">{cheapestShop.avgPrice.toFixed(2)}</span>
                    <span className="text-2xl font-black text-white/60">€</span>
                  </div>
                </div>
              </div>
            </div>
         </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProgressBarChart 
          title={t("stats.lists_by_shop", { defaultValue: "Shopping Lists by Supermarket" })}
          data={formattedListsByShop}
          emptyMessage={t("stats.empty_data", { defaultValue: "Not enough data available yet." })}
        />
        
        <ProgressBarChart 
          title={t("stats.products_by_category", { defaultValue: "Products by Category" })}
          data={formattedProductsByCategory}
          emptyMessage={t("stats.empty_data", { defaultValue: "Not enough data available yet." })}
        />
      </div>

      <div className="grid grid-cols-1">
        <ProgressBarChart 
          title={t("stats.avg_expense_by_shop", { defaultValue: "Average Expense by Supermarket (€)" })}
          data={expensesChartData}
          emptyMessage={t("stats.empty_data", { defaultValue: "Not enough data available yet." })}
        />
      </div>

    </div>
  )
}
