"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, LoginData, RegisterData, UpdateUserData } from "../entity/User";
import { AuthRepository } from "../data/repository/AuthRepository";
import { TokenManager } from "../../shared/TokenManager";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (data: UpdateUserData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const repository = new AuthRepository();

    // Init context on load
    useEffect(() => {
        const storedToken = TokenManager.get();
        const storedUser = localStorage.getItem("auth_user");

        if (storedToken && storedUser) {
            try {
                const decodedToken = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    logout();
                } else {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Invalid token format", error);
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    // Set auto-logout timer on token change
    useEffect(() => {
        const currentToken = TokenManager.get();
        if (currentToken) {
            try {
                const decodedToken = jwtDecode(currentToken);
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
    }, [user]);


    const saveAuthData = (user: User, token: string) => {
        TokenManager.set(token);
        localStorage.setItem("auth_user", JSON.stringify(user));
        setUser(user);
    };

    const login = async (data: LoginData) => {
        const response = await repository.login(data);
        saveAuthData(response.user, response.token);
        router.push("/");
    };

    const register = async (data: RegisterData) => {
        await repository.register(data);
        router.push("/login");
    };

    const logout = () => {
        TokenManager.set(null);
        localStorage.removeItem("auth_user");
        setUser(null);
        router.push("/login");
    };

    const updateProfile = async (data: UpdateUserData) => {
        if (!user) throw new Error("No estás autenticado");
        const response = await repository.updateProfile(user.id, data);
        saveAuthData(response.user, response.token);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
