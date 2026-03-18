"use client";

import { RegisterForm } from "../../auth/components/RegisterForm";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";

export default function RegisterPage() {
    const { t } = useI18n();
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-tr from-emerald-50/50 via-teal-50/30 to-slate-50 -z-10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-3xl shadow-lg shadow-emerald-200 mb-6 drop-shadow-sm">
                        <FontAwesomeIcon icon={faUserPlus} className="text-white text-3xl ml-1" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 drop-shadow-sm mb-2 tracking-tight">
                        {t("auth.create_account", { defaultValue: "Crea tu cuenta" })}
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 opacity-80">
                        {t("auth.already_have_account", { defaultValue: "¿Ya tienes cuenta?" })}{" "}
                        <Link href="/login" className="text-emerald-600 hover:text-emerald-500 transition-colors">
                            {t("auth.login_here", { defaultValue: "Inicia sesión aquí" })}
                        </Link>
                    </p>
                </div>
                
                <RegisterForm />
            </div>
        </div>
    );
}
