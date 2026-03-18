"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";

export const LoginForm = () => {
    const { login } = useAuth();
    const { t } = useI18n();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!email || !password) {
            setError(t("auth.errors.fill_fields", { defaultValue: "Por favor, rellena todos los campos" }));
            return;
        }

        setLoading(true);
        try {
            await login({ email, password });
            // The AuthContext router.push will handle redirect or we let the page handle it
        } catch (err: any) {
            setError(err.message || t("auth.errors.login_fail", { defaultValue: "Error al iniciar sesión" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8">
            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold shadow-sm">{error}</div>}
            
            <div className="flex flex-col gap-2 relative">
                <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">{t("auth.email", { defaultValue: "Email" })}</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-4 transition-all outline-none font-medium placeholder-slate-400 shadow-sm"
                    placeholder={t("auth.email_placeholder", { defaultValue: "tu@email.com" })}
                />
            </div>

            <div className="flex flex-col gap-2 relative">
                <label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">{t("auth.password", { defaultValue: "Contraseña" })}</label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-4 pr-12 transition-all outline-none font-medium placeholder-slate-400 shadow-sm"
                        placeholder={t("auth.password_placeholder", { defaultValue: "••••••••" })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-bold rounded-2xl text-base px-5 py-4 text-center transition-all duration-300 shadow-lg shadow-indigo-600/30 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
            >
                {loading ? t("auth.logging_in", { defaultValue: "Iniciando sesión..." }) : t("auth.login", { defaultValue: "Iniciar Sesión" })}
            </button>
        </form>
    );
};
