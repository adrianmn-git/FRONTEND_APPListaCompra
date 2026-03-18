"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";

export const RegisterForm = () => {
    const { register } = useAuth();
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
            setError(t("auth.errors.fill_fields", { defaultValue: "Por favor, rellena todos los campos" }));
            return;
        }

        if (formData.password.length <= 8) {
            setError(t("auth.errors.password_length", { defaultValue: "La contraseña debe tener más de 8 caracteres" }));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(t("auth.errors.passwords_mismatch", { defaultValue: "Las contraseñas no coinciden" }));
            return;
        }

        setLoading(true);
        try {
            await register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password
            });
        } catch (err: any) {
            setError(err.message || t("auth.errors.register_fail", { defaultValue: "Error al registrarse" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold shadow-sm">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="first_name" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.first_name", { defaultValue: "Nombre" })}</label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium shadow-sm"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="last_name" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.last_name", { defaultValue: "Apellidos" })}</label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium shadow-sm"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.email", { defaultValue: "Email" })}</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium shadow-sm"
                />
            </div>

            <div className="flex flex-col gap-2 relative">
                <label htmlFor="password" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.password", { defaultValue: "Contraseña" })}</label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 pr-12 transition-all outline-none font-medium shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <p className={`text-xs ml-1 font-bold transition-colors ${formData.password.length > 8 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {formData.password.length > 8 ? '✓' : '•'} {t("auth.password_rule", { defaultValue: "Debe tener más de 8 caracteres" })}
                </p>
            </div>
            
            <div className="flex flex-col gap-2 relative">
                <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.confirm_password", { defaultValue: "Confirmar Contraseña" })}</label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 pr-12 transition-all outline-none font-medium shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || (formData.password.length > 0 && formData.password.length <= 8)}
                className="mt-4 w-full text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-bold rounded-2xl text-base px-5 py-4 text-center transition-all duration-300 shadow-lg shadow-emerald-500/30 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
            >
                {loading ? t("auth.registering", { defaultValue: "Registrando..." }) : t("auth.register", { defaultValue: "Registrarse" })}
            </button>
        </form>
    );
};
