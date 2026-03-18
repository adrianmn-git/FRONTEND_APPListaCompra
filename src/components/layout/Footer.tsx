"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/i18n/hooks/useI18n"
import LanguageSelector from "@/i18n/components/LanguageSelector"

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="w-full bg-slate-900 text-slate-400 mt-20 relative overflow-hidden">
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Side: Brand & Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white text-xs font-black">LC</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Lista<span className="text-indigo-400">Compra</span>
              </span>
            </div>
            <p className="text-slate-400 text-base font-medium max-w-xs leading-relaxed opacity-80">
              {t("footer.tagline", { defaultValue: 'Transforming your daily shopping management into a simple, fast, and elegant experience.' })}
            </p>
            <div className="mt-2">
              <LanguageSelector variant="footer" />
            </div>
          </div>

          {/* Right Side: Links & Credits */}
          <div className="flex flex-col items-center md:items-end gap-8">
            <div className="flex items-center gap-5">
              <a 
                href="#" 
                className="w-12 h-12 flex items-center justify-center bg-slate-800 text-slate-300 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 border border-slate-700 hover:border-indigo-500 hover:-translate-y-1 shadow-xl"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-xl" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 flex items-center justify-center bg-slate-800 text-slate-300 rounded-2xl hover:bg-slate-700 hover:text-white transition-all duration-300 border border-slate-700 hover:border-slate-600 hover:-translate-y-1 shadow-xl"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="text-xl" />
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-xs font-black uppercase bg-slate-800/50 px-6 py-3 rounded-2xl border border-slate-700/50">
              {t("footer.made_with", { defaultValue: 'Made with' })} <FontAwesomeIcon icon={faHeart} className="text-rose-500 animate-pulse" /> {t("footer.by", { defaultValue: 'by' })} <span className="text-white italic">Adri</span>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} ListaCompra Premium. {t("footer.rights", { defaultValue: 'All rights reserved.' })}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-indigo-400 text-[10px] font-bold uppercase tracking-widest transition-colors">{t("footer.privacy", { defaultValue: 'Privacy' })}</a>
            <a href="#" className="text-slate-500 hover:text-indigo-400 text-[10px] font-bold uppercase tracking-widest transition-colors">{t("footer.terms", { defaultValue: 'Terms' })}</a>
          </div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10 rounded-full"></div>
    </footer>
  )
}
