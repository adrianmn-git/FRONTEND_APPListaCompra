"use client";

import { LoginForm } from "../../auth/components/LoginForm";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";

export default function LoginPage() {
    const { t } = useI18n();
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50 -z-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-200 mb-6 drop-shadow-sm">
                        <FontAwesomeIcon icon={faBasketShopping} className="text-white text-3xl" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 drop-shadow-sm mb-2 tracking-tight">
                        {t("auth.hello_again", { defaultValue: "¡Hola de nuevo!" })}
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 opacity-80">
                        {t("auth.no_account", { defaultValue: "¿No tienes cuenta?" })}{" "}
                        <Link href="/register" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                            {t("auth.register_here", { defaultValue: "Regístrate aquí" })}
                        </Link>
                    </p>
                </div>
                
                <LoginForm />
            </div>
        </div>
    );
}
