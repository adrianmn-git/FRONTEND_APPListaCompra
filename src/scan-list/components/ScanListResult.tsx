"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faArrowRight,
  faRotateLeft,
  faShoppingBasket,
  faBoxOpen,
  faWeightScale,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useScanList } from "../hooks/useScanList";
import { useI18n } from "@/i18n/hooks/useI18n";

export default function ScanListResult() {
  const { scanResult, scanError, resetScan } = useScanList();
  const { t } = useI18n();

  if (scanError) {
    return (
      <section className="bg-red-50/80 border border-red-100 rounded-[2.5rem] p-10 md:p-14 text-center space-y-6 shadow-xl shadow-red-100/50">
        <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-[2rem] mx-auto shadow-inner border border-red-200">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="font-black text-red-800 text-2xl">
          {t("scan.error_title", { defaultValue: "Scan failed" })}
        </h3>
        <p className="text-red-600 font-medium max-w-md mx-auto">{scanError}</p>
        <div className="pt-4">
          <button
            type="button"
            onClick={resetScan}
            className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-full transition-all shadow-lg hover:shadow-red-600/30 cursor-pointer active:scale-95"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-lg" />
            {t("scan.try_again", { defaultValue: "Try again" })}
          </button>
        </div>
      </section>
    );
  }

  if (!scanResult) return null;

  const { list, items_created, items } = scanResult;

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-[2.5rem] p-10 md:p-14 text-center space-y-5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] mx-auto shadow-xl shadow-emerald-200/50 animate-bounce">
          <FontAwesomeIcon icon={faCircleCheck} className="text-white text-4xl" />
        </div>
        <div className="relative z-10">
          <h3 className="font-black text-slate-800 text-3xl mb-2">
            {t("scan.success_title", { defaultValue: "List created successfully!" })}
          </h3>
          <p className="text-slate-500 font-medium text-lg">
            {t("scan.success_subtitle", {
              count: String(items_created),
              defaultValue: `${items_created} products added to your list`,
            })}
          </p>
        </div>
      </div>

      {/* List Info Card */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/30">
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-inner">
            <FontAwesomeIcon icon={faShoppingBasket} className="text-indigo-500 text-2xl" />
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-xl">{list.name}</h4>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mt-1">{list.shop}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <FontAwesomeIcon icon={faBoxOpen} className="text-slate-400 text-sm" />
            </div>
            <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("scan.products_detected", { defaultValue: "Products detected" })}
            </h5>
          </div>
          <ul className="divide-y divide-slate-100 bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between py-4 px-5 hover:bg-white transition-colors group"
              >
                <span className="text-base font-bold text-slate-700 capitalize group-hover:text-indigo-600 transition-colors">
                  {item.product_name}
                </span>
                <span className="flex items-center gap-2 text-sm text-slate-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                  <FontAwesomeIcon icon={faWeightScale} className="text-xs text-slate-400" />
                  {item.quantity} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link
          href={`/lists/${list.id}`}
          className="flex-1 flex items-center justify-center gap-3 py-4 md:py-5 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-full shadow-xl shadow-slate-900/20 transition-all duration-300 active:scale-[0.98]"
        >
          {t("scan.view_list", { defaultValue: "View list" })}
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
        <button
          type="button"
          onClick={resetScan}
          className="flex-1 flex items-center justify-center gap-3 py-4 md:py-5 px-8 bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-black text-lg rounded-full transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <FontAwesomeIcon icon={faRotateLeft} />
          {t("scan.scan_another", { defaultValue: "Scan another list" })}
        </button>
      </div>
    </section>
  );
}
