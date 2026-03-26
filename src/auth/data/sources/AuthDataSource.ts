import { AuthResponse, LoginData, RegisterData, UpdateUserData } from "../../entity/User";
import { HttpClient } from "../../../shared/HttpClient";

const API_URL = "http://127.0.0.1:8000";

export class AuthDataSource {
    async login(data: LoginData): Promise<AuthResponse> {
        const res = await HttpClient(`${API_URL}/auth/login`, 'POST', JSON.stringify(data));

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al iniciar sesión');
        }

        return res.json();
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const res = await HttpClient(`${API_URL}/auth/register`, 'POST', JSON.stringify(data));

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al registrarse');
        }

        return res.json();
    }

    async updateProfile(userId: number, data: UpdateUserData): Promise<AuthResponse> {
        const res = await HttpClient(`${API_URL}/auth/user/${userId}/update`, 'PATCH', JSON.stringify(data));

        if (!res.ok) {
             const errorData = await res.json().catch(() => ({}));
             throw new Error(errorData.error || 'Error al actualizar el perfil');
        }

        return res.json();
    }
}
