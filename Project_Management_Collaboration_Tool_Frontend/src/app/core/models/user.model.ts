export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    role: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    expiresAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    username: string;
    email: string;
    password: string;
}
