"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import ScanListUploader from "@/scan-list/components/ScanListUploader";
import ScanListResult from "@/scan-list/components/ScanListResult";
import { useScanList } from "@/scan-list/hooks/useScanList";
import { useI18n } from "@/i18n/hooks/useI18n";

function ScanPageContent() {
  const { scanResult, scanError } = useScanList();
  const { t } = useI18n();

  const showResult = scanResult || scanError;

  return (
    <main className="min-h-screen bg-transparent relative overflow-x-hidden font-sans transition-colors duration-1000 pb-24">
      {/* Universal Noise Background for Texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] bg-[length:250px_250px] opacity-[0.06] pointer-events-none"></div>

      {/* Dynamic Ambient Glows (Discreet) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-300/40 to-purple-400/20 blur-[160px] rounded-full pointer-events-none mix-blend-multiply z-0 opacity-15"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-gradient-to-bl from-emerald-300/30 to-sky-400/20 blur-[160px] rounded-full pointer-events-none mix-blend-multiply z-0 opacity-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        
        {/* Navigation & Premium Hero */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-8">
          <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 text-white p-10 md:p-14 mb-10 shadow-2xl flex flex-col items-center text-center justify-center min-h-[320px] group z-20">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay bg-[length:150px_150px]"></div>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000 z-0 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 shadow-inner">
                   {t("scan.badge", { defaultValue: "INTELIGENCIA ARTIFICIAL" })}
                 </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 leading-tight drop-shadow-md">
                {t("scan.title", { defaultValue: "Scan Shopping List" })}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed mt-2 opacity-90 mx-auto">
                {t("scan.subtitle", {
                  defaultValue:
                    "Upload a photo of your handwritten shopping list and we'll digitize it automatically.",
                })}
              </p>
            </div>
          </section>
        </div>

        {/* Content Wrapper */}
        <section className="bg-white rounded-[3rem] p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative z-30">
          {showResult ? <ScanListResult /> : <ScanListUploader />}
        </section>
      </div>
    </main>
  );
}

export default function ScanPage() {
  return <ScanPageContent />;
}
