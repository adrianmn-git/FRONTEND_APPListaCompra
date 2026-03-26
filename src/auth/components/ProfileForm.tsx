"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { UpdateUserData } from "../entity/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";

export const ProfileForm = () => {
    const { user, updateProfile } = useAuth();
    const { t } = useI18n();
    const [formData, setFormData] = useState<UpdateUserData & { confirmPassword: "" }>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password && formData.password.length <= 8) {
            setError(t("auth.errors.new_password_length", { defaultValue: "La nueva contraseña debe tener más de 8 caracteres" }));
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError(t("auth.errors.passwords_mismatch", { defaultValue: "Las contraseñas no coinciden" }));
            return;
        }

        setLoading(true);
        try {
            const updateData: any = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
            };
            
            if (formData.password) {
                updateData.password = formData.password;
            }

            await updateProfile(updateData);
            setSuccess(t("auth.success.profile_updated", { defaultValue: "Perfil actualizado correctamente" }));
            setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        } catch (err: any) {
            setError(err.message || t("auth.errors.profile_update_fail", { defaultValue: "Error al actualizar perfil" }));
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold shadow-sm">{error}</div>}
            {success && <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-sm font-semibold shadow-sm">{success}</div>}
            
            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="first_name" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.first_name", { defaultValue: "Nombre" })}</label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3.5 transition-all outline-none font-medium shadow-sm"
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
                        className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3.5 transition-all outline-none font-medium shadow-sm"
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
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3.5 transition-all outline-none font-medium shadow-sm"
                />
            </div>

            <hr className="my-6 border-slate-200" />
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-2">
                <p className="text-xs font-bold text-amber-700">{t("auth.leave_blank", { defaultValue: "Deja los siguientes campos en blanco si no quieres cambiar tu contraseña actual." })}</p>
            </div>

            <div className="flex flex-col gap-2 relative">
                <label htmlFor="password" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.new_password", { defaultValue: "Nueva Contraseña" })}</label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3.5 pr-12 transition-all outline-none font-medium shadow-sm placeholder-slate-400"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <div className={`text-xs ml-1 font-bold transition-colors ${(formData.password ?? "").length === 0 ? 'hidden' : (formData.password ?? "").length > 8 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {(formData.password ?? "").length > 8 ? '✓' : '•'} {t("auth.password_rule", { defaultValue: "Debe tener más de 8 caracteres" })}
                </div>
            </div>
            
            <div className="flex flex-col gap-2 relative">
                <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.confirm_new_password", { defaultValue: "Confirmar Nueva Contraseña" })}</label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3.5 pr-12 transition-all outline-none font-medium shadow-sm placeholder-slate-400"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={loading || ((formData.password ?? "").length > 0 && (formData.password ?? "").length <= 8)}
                    className="w-full sm:w-auto text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-bold rounded-2xl text-base px-8 py-3.5 text-center transition-all duration-300 shadow-lg shadow-indigo-600/30 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
                >
                    {loading ? t("auth.updating", { defaultValue: "Actualizando..." }) : t("auth.save_changes", { defaultValue: "Guardar Cambios" })}
                </button>
            </div>
        </form>
    );
};
