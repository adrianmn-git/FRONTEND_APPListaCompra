"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { RegisterData } from "../entity/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";
import { registerSchema } from "../entity/schemas";
import { ZodError } from "zod";

export const RegisterForm = () => {
    const { register } = useAuth();
    const { t } = useI18n();
    const [formData, setFormData] = useState<RegisterData & { confirmPassword: "" }>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFieldErrors(prev => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        
        try {
            registerSchema.parse(formData);
        } catch (err) {
            if (err instanceof ZodError) {
                const errors: Record<string, string> = {};
                err.issues.forEach((issue) => {
                    const field = issue.path[0] as string;
                    if (!errors[field]) errors[field] = issue.message;
                });
                setFieldErrors(errors);
                const firstKey = err.issues[0].message;
                setError(t(`validation.${firstKey}`, { defaultValue: firstKey }));
                return;
            }
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

    const inputClass = (field: string) =>
        `w-full bg-white border-2 ${fieldErrors[field] ? 'border-red-300 ring-4 ring-red-500/10' : 'border-slate-200'} text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium shadow-sm`;

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
                        className={inputClass("first_name")}
                    />
                    {fieldErrors.first_name && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.first_name}`, { defaultValue: fieldErrors.first_name })}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="last_name" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.last_name", { defaultValue: "Apellidos" })}</label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={inputClass("last_name")}
                    />
                    {fieldErrors.last_name && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.last_name}`, { defaultValue: fieldErrors.last_name })}</p>}
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
                    className={inputClass("email")}
                />
                {fieldErrors.email && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.email}`, { defaultValue: fieldErrors.email })}</p>}
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
                        className={`${inputClass("password")} pr-12`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                {fieldErrors.password && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.password}`, { defaultValue: fieldErrors.password })}</p>}
                <div className="flex flex-col gap-1 mt-1">
                    <p className={`text-xs ml-1 font-bold transition-colors ${(formData.password ?? "").length > 8 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {(formData.password ?? "").length > 8 ? '✓' : '•'} {t("auth.password_rule_length", { defaultValue: "Debe tener más de 8 caracteres" })}
                    </p>
                    <p className={`text-xs ml-1 font-bold transition-colors ${/\p{Lu}/u.test(formData.password ?? "") ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {/\p{Lu}/u.test(formData.password ?? "") ? '✓' : '•'} {t("auth.password_rule_uppercase", { defaultValue: "Mínimo una mayúscula" })}
                    </p>
                    <p className={`text-xs ml-1 font-bold transition-colors ${/\d/.test(formData.password ?? "") ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {/\d/.test(formData.password ?? "") ? '✓' : '•'} {t("auth.password_rule_number", { defaultValue: "Mínimo un número" })}
                    </p>
                    <p className={`text-xs ml-1 font-bold transition-colors ${/[^\p{L}\p{N}\s]/u.test(formData.password ?? "") ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {/[^\p{L}\p{N}\s]/u.test(formData.password ?? "") ? '✓' : '•'} {t("auth.password_rule_symbol", { defaultValue: "Mínimo un símbolo (_, -, !, ?...)" })}
                    </p>
                </div>
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
                        className={`${inputClass("confirmPassword")} pr-12`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                {fieldErrors.confirmPassword && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.confirmPassword}`, { defaultValue: fieldErrors.confirmPassword })}</p>}
            </div>

            <button
                type="submit"
                disabled={
                    loading || 
                    ((formData.password ?? "").length > 0 && (
                        (formData.password ?? "").length <= 8 ||
                        !/\p{Lu}/u.test(formData.password ?? "") ||
                        !/\d/.test(formData.password ?? "") ||
                        !/[^\p{L}\p{N}\s]/u.test(formData.password ?? "")
                    ))
                }
                className="mt-4 w-full text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-bold rounded-2xl text-base px-5 py-4 text-center transition-all duration-300 shadow-lg shadow-emerald-500/30 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
            >
                {loading ? t("auth.registering", { defaultValue: "Registrando..." }) : t("auth.register", { defaultValue: "Registrarse" })}
            </button>
        </form>
    );
};
