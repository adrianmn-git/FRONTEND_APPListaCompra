export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginData {
    email: string;
    password?: string;
}

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
}

export interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
}
