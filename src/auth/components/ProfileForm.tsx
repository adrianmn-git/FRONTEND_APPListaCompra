"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { UpdateUserData } from "../entity/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";
import { profileSchema } from "../entity/schemas";
import { ZodError } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
        setFieldErrors(prev => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFieldErrors({});

        try {
            profileSchema.parse(formData);
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

    const inputClass = (field: string) =>
        cn(
            "h-12 px-3.5 bg-slate-50 border-2 text-slate-800 text-sm rounded-2xl transition-all outline-none font-medium shadow-sm",
            fieldErrors[field] ? "border-red-300 focus-visible:ring-4 focus-visible:ring-red-500/10 focus-visible:border-red-500" : "border-slate-200 focus-visible:ring-4 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
        );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold shadow-sm">{error}</div>}
            {success && <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-sm font-semibold shadow-sm">{success}</div>}
            
            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="first_name" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.first_name", { defaultValue: "Nombre" })}</Label>
                    <Input
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
                    <Label htmlFor="last_name" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.last_name", { defaultValue: "Apellidos" })}</Label>
                    <Input
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
                <Label htmlFor="email" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.email", { defaultValue: "Email" })}</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                />
                {fieldErrors.email && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.email}`, { defaultValue: fieldErrors.email })}</p>}
            </div>

            <hr className="my-6 border-slate-200" />
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-2">
                <p className="text-xs font-bold text-amber-700">{t("auth.leave_blank", { defaultValue: "Deja los siguientes campos en blanco si no quieres cambiar tu contraseña actual." })}</p>
            </div>

            <div className="flex flex-col gap-2 relative">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.new_password", { defaultValue: "Nueva Contraseña" })}</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className={cn(inputClass("password"), "pr-12 placeholder:text-slate-400")}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                {fieldErrors.password && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.password}`, { defaultValue: fieldErrors.password })}</p>}
                <div className={cn("flex flex-col gap-1 mt-1", (formData.password ?? "").length === 0 ? 'hidden' : '')}>
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
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">{t("auth.confirm_new_password", { defaultValue: "Confirmar Nueva Contraseña" })}</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={cn(inputClass("confirmPassword"), "pr-12 placeholder:text-slate-400")}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                {fieldErrors.confirmPassword && <p className="text-xs font-bold text-red-500 ml-1">{t(`validation.${fieldErrors.confirmPassword}`, { defaultValue: fieldErrors.confirmPassword })}</p>}
            </div>

            <div className="mt-4 flex justify-end">
                <Button
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
                    className="w-full sm:w-auto h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-base px-8 transition-all duration-300 shadow-lg shadow-indigo-600/30 active:scale-95"
                >
                    {loading ? t("auth.updating", { defaultValue: "Actualizando..." }) : t("auth.save_changes", { defaultValue: "Guardar Cambios" })}
                </Button>
            </div>
        </form>
    );
};
