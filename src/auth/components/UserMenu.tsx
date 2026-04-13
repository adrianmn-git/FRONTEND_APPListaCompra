"use client";

import React from "react";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "../../i18n/hooks/useI18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const UserMenu = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { t } = useI18n();

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

    const initials = (user.first_name?.charAt(0) || "") + (user.last_name?.charAt(0) || "");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 rounded-[1.2rem] hover:scale-105 transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-500/30 border-none outline-none">
                <Avatar className="w-10 h-10 rounded-[1.2rem] border border-indigo-400 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-none">
                    <AvatarFallback className="bg-transparent text-white font-black uppercase shadow-none text-sm tracking-wider">
                        {initials || "U"}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-[20000]">
                <DropdownMenuLabel className="px-3 py-2 flex flex-col font-normal">
                    <span className="text-sm font-black text-slate-800 truncate">
                        {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 truncate mt-0.5">
                        {user.email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100/60 -mx-2 my-1" />
                <DropdownMenuItem 
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer px-3 py-2.5 text-sm font-bold text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 rounded-xl transition-colors"
                >
                    {t("auth.profile", { defaultValue: "Mi Perfil" })}
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer px-3 py-2.5 text-sm font-bold text-red-500 focus:bg-red-50 focus:text-red-600 rounded-xl transition-colors mt-1"
                >
                    {t("auth.logout", { defaultValue: "Cerrar Sesión" })}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
