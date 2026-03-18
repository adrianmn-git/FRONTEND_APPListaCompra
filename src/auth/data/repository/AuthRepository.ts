import { AuthResponse, LoginData, RegisterData, UpdateUserData } from "../../entity/User";
import { AuthDataSource } from "../sources/AuthDataSource";

export class AuthRepository {
    private dataSource: AuthDataSource;

    constructor() {
        this.dataSource = new AuthDataSource();
    }

    async login(data: LoginData): Promise<AuthResponse> {
        return this.dataSource.login(data);
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        return this.dataSource.register(data);
    }

    async updateProfile(userId: number, data: UpdateUserData, token: string): Promise<AuthResponse> {
         return this.dataSource.updateProfile(userId, data, token);
    }
}
