"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, LoginData, RegisterData, UpdateUserData } from "../entity/User";
import { AuthRepository } from "../data/repository/AuthRepository";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (data: UpdateUserData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const repository = new AuthRepository();

    // Init context on load
    useEffect(() => {
        const storedToken = Cookies.get("auth_token");
        const storedUser = localStorage.getItem("auth_user");

        if (storedToken && storedUser) {
            try {
                // Check if token is expired
                const decodedToken = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    logout();
                } else {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Invalid token format", error);
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    // Set auto-logout timer on token load/change
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp) {
                    const currentTime = Date.now();
                    const expirationTime = decodedToken.exp * 1000;
                    const timeLeft = expirationTime - currentTime;

                    if (timeLeft > 0) {
                        const timeoutId = setTimeout(() => {
                            logout();
                            alert("¡Tu sesión ha expirado!");
                        }, timeLeft);
                        
                        return () => clearTimeout(timeoutId);
                    } else {
                        logout();
                    }
                }
            } catch (error) {
                console.error("Invalid token format", error);
            }
        }
    }, [token]);


    const saveAuthData = (user: User, token: string) => {
        // Guardar token en cookies (expira en 3 días para coincidir con la config típica de JWT si aplica)
        Cookies.set("auth_token", token, { expires: 3, path: "/" });
        localStorage.setItem("auth_user", JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    const login = async (data: LoginData) => {
        const response = await repository.login(data);
        saveAuthData(response.user, response.token);
    };

    const register = async (data: RegisterData) => {
        const response = await repository.register(data);
        saveAuthData(response.user, response.token);
    };

    const logout = () => {
        Cookies.remove("auth_token", { path: "/" });
        localStorage.removeItem("auth_user");
        setToken(null);
        setUser(null);
        router.push("/login");
    };

    const updateProfile = async (data: UpdateUserData) => {
        if (!user || !token) throw new Error("No estás autenticado");
        const response = await repository.updateProfile(user.id, data, token);
        saveAuthData(response.user, response.token);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
