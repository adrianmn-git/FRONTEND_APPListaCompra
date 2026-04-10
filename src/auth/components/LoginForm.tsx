"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";
import { loginSchema } from "../entity/schemas";
import { ZodError } from "zod";

export const LoginForm = () => {
    const { login } = useAuth();
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        try {
            loginSchema.parse(formData);
        } catch (err) {
            if (err instanceof ZodError) {
                const errors: Record<string, string> = {};
                err.issues.forEach((issue) => {
                    const field = issue.path[0] as string;
                    errors[field] = issue.message;
                });
                setFieldErrors(errors);
                const firstKey = err.issues[0].message;
                setError(t(`validation.${firstKey}`, { defaultValue: firstKey }));
                return;
            }
        }

        setLoading(true);
        try {
            await login({ email: formData.email, password: formData.password });
        } catch (err: any) {
            setError(err.message || t("auth.errors.login_fail", { defaultValue: "Error al iniciar sesión" }));
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full bg-white border-2 ${fieldErrors[field] ? 'border-red-300 ring-4 ring-red-500/10' : 'border-slate-200'} text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-4 transition-all outline-none font-medium placeholder-slate-400 shadow-sm`;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8">
            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold shadow-sm">{error}</div>}
            
            <div className="flex flex-col gap-2 relative">
                <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">{t("auth.email", { defaultValue: "Email" })}</label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setFieldErrors(prev => ({ ...prev, email: "" })); }}
                    className={inputClass("email")}
                    placeholder={t("auth.email_placeholder", { defaultValue: "tu@email.com" })}
                />
                {fieldErrors.email && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.email}`, { defaultValue: fieldErrors.email })}</p>}
            </div>

            <div className="flex flex-col gap-2 relative">
                <label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">{t("auth.password", { defaultValue: "Contraseña" })}</label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setFieldErrors(prev => ({ ...prev, password: "" })); }}
                        className={`${inputClass("password")} pr-12`}
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
                {fieldErrors.password && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.password}`, { defaultValue: fieldErrors.password })}</p>}
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
