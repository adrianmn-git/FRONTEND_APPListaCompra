"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "../../i18n/hooks/useI18n";

export const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { t } = useI18n();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <Link 
                    href="/login" 
                    className="hidden sm:flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-600 bg-white/50 backdrop-blur-md rounded-xl hover:bg-white hover:text-indigo-600 border border-white/40 shadow-sm transition-all duration-300 active:scale-95"
                >
                    {t("auth.login", { defaultValue: "Iniciar Sesión" })}
                </Link>
                <Link 
                    href="/register" 
                    className="flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-400 hover:to-teal-400 border border-emerald-400 shadow-md shadow-emerald-500/20 transition-all duration-300 active:scale-95"
                >
                    {t("auth.register", { defaultValue: "Registrarse" })}
                </Link>
            </div>
        );
    }

    // Obtenemos las dos primeras letras del nombre, o la primera del nombre y primera del apellido.
    const initials = (user.first_name?.charAt(0) || "") + (user.last_name?.charAt(0) || "");

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-[1.2rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black uppercase hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/30 border border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 active:scale-95"
            >
                {initials || "U"}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50 border border-white animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-3 border-b border-slate-100/50 mb-2">
                        <p className="text-sm font-black text-slate-800 truncate">
                            {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs font-semibold text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            router.push("/profile");
                        }}
                        className="w-full text-left flex items-center px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                        {t("auth.profile", { defaultValue: "Mi Perfil" })}
                    </button>
                    
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            logout();
                        }}
                        className="w-full text-left flex items-center px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
                    >
                        {t("auth.logout", { defaultValue: "Cerrar Sesión" })}
                    </button>
                </div>
            )}
        </div>
    );
};
