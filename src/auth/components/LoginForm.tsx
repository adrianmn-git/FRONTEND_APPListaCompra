"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../../i18n/hooks/useI18n";
import { loginSchema } from "../entity/schemas";
import { ZodError } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        cn(
            "h-14 px-4 bg-white border-2 text-slate-800 text-sm rounded-2xl transition-all outline-none font-medium placeholder:text-slate-400 shadow-sm",
            fieldErrors[field] ? "border-red-300 focus-visible:ring-4 focus-visible:ring-red-500/10 focus-visible:border-red-500" : "border-slate-200 focus-visible:ring-4 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
        );
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8">
            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold shadow-sm">{error}</div>}
            
            <div className="flex flex-col gap-2 relative">
                <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">{t("auth.email", { defaultValue: "Email" })}</Label>
                <Input
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
                <Label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">{t("auth.password", { defaultValue: "Contraseña" })}</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setFieldErrors(prev => ({ ...prev, password: "" })); }}
                        className={cn(inputClass("password"), "pr-12")}
                        placeholder={t("auth.password_placeholder", { defaultValue: "••••••••" })}
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
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="mt-4 w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-base px-5 py-4 transition-all duration-300 shadow-lg shadow-indigo-600/30 active:scale-95"
            >
                {loading ? t("auth.logging_in", { defaultValue: "Iniciando sesión..." }) : t("auth.login", { defaultValue: "Iniciar Sesión" })}
            </Button>
        </form>
    );
};
