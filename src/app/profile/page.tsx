"use client";

import { ProfileForm } from "../../auth/components/ProfileForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";

export default function ProfilePage() {
    const { t } = useI18n();
    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50 -z-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto px-6 py-6 lg:py-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-10 pb-4 border-b-2 border-slate-200">
                    <div className="bg-indigo-100 p-3 rounded-[1.5rem] text-indigo-600 shadow-sm">
                        <FontAwesomeIcon icon={faUserCog} className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 drop-shadow-sm">
                            {t("auth.profile", { defaultValue: "Mi Perfil" })}
                        </h1>
                        <p className="text-sm font-semibold text-slate-400">
                            {t("auth.manage_info", { defaultValue: "Gestiona tu información personal y seguridad" })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Main Form Column */}
                    <div className="md:col-span-8">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-white">
                            <ProfileForm />
                        </div>
                    </div>

                    {/* Sidebar / Info Card */}
                    <div className="md:col-span-4">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-200 flex flex-col items-center text-center gap-6 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                            
                            <div className="relative z-10 w-full text-left">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-[1.5rem] inline-block mb-4 border border-white/20">
                                    <FontAwesomeIcon icon={faShieldHalved} className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">{t("auth.privacy_security", { defaultValue: "Privacidad y Seguridad" })}</h3>
                                <p className="text-indigo-100 text-sm font-bold opacity-80 leading-relaxed">
                                    {t("auth.data_protected", { defaultValue: "Tus datos están protegidos. Asegúrate de usar una contraseña segura y no compartirla con nadie." })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
