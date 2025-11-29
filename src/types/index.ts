export interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    fecha_nacimiento?: string;
    direccion?: string;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
    expires_at: string;
    expires_in: number;
    status: number;
}

export interface Statistics {
    total_usuarios: number;
    usuarios_activos: number;
    usuarios_inactivos: number;
    registros_hoy: number;
    registros_esta_semana: number;
    registros_este_mes: number;
}

export interface APIResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    fecha_nacimiento?: string;
    direccion?: string;
    password?: string;
    activo?: boolean;
}
