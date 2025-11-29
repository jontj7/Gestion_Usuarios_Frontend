import { APIResponse, AuthResponse, LoginCredentials, RegisterData, Statistics, User } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data as T;
};

// Helper function to make authenticated requests
const fetchWithAuth = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const token = getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Handle token expiration
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expires_at');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }

    return handleResponse<T>(response);
};

// Auth API
export const authAPI = {
    // Login  ->  POST /api/auth/login
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await handleResponse<AuthResponse>(response);

        // Store token and user data
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.expires_at) {
                localStorage.setItem('token_expires_at', data.expires_at);
            }
        }

        return data;
    },

    // Register  ->  POST /api/auth/register
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        return handleResponse<AuthResponse>(response);
    },

    // Logout  ->  POST /api/auth/logout
    logout: async (): Promise<{ message: string }> => {
        const data = await fetchWithAuth<{ message: string }>(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
        });

        // Clear local storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expires_at');

        return data;
    },

    // Refresh token  ->  POST /api/auth/refresh
    refreshToken: async (): Promise<AuthResponse> => {
        const data = await fetchWithAuth<AuthResponse>(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
        });

        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            if (data.expires_at) {
                localStorage.setItem('token_expires_at', data.expires_at);
            }
        }

        return data;
    },

    // Check token validity  ->  GET /api/auth/check
    checkToken: async (): Promise<AuthResponse> => {
        return fetchWithAuth<AuthResponse>(`${API_BASE_URL}/auth/check`);
    },
};

// Users API (rutas protegidas con auth:sanctum)
export const usersAPI = {
    // Get all users  ->  GET /api/usuarios
    getAll: async (): Promise<APIResponse<User[]>> => {
        return fetchWithAuth<APIResponse<User[]>>(`${API_BASE_URL}/usuarios`);
    },

    // Get user by ID  ->  GET /api/usuarios/{id}
    getById: async (id: number | string): Promise<APIResponse<User>> => {
        return fetchWithAuth<APIResponse<User>>(`${API_BASE_URL}/usuarios/${id}`);
    },

    // Create user  ->  POST /api/usuarios
    create: async (userData: RegisterData): Promise<APIResponse<User>> => {
        return fetchWithAuth<APIResponse<User>>(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // Update user  ->  PUT /api/usuarios/{id}
    update: async (id: number | string, userData: Partial<RegisterData>): Promise<APIResponse<User>> => {
        return fetchWithAuth<APIResponse<User>>(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    // Delete user  ->  DELETE /api/usuarios/{id}
    delete: async (id: number | string): Promise<{ message: string }> => {
        return fetchWithAuth<{ message: string }>(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'DELETE',
        });
    },
};

// Statistics API (públicas en tu backend)
export const statisticsAPI = {
    // Get general statistics  ->  GET /api/estadisticas
    getGeneral: async (): Promise<APIResponse<Statistics>> => {
        return fetchWithAuth<APIResponse<Statistics>>(`${API_BASE_URL}/estadisticas`);
    },

    // Get daily statistics  ->  GET /api/estadisticas/diarias
    getDaily: async (): Promise<any> => {
        return fetchWithAuth(`${API_BASE_URL}/estadisticas/diarias`);
    },

    // Get weekly statistics  ->  GET /api/estadisticas/semanales
    getWeekly: async (): Promise<any> => {
        return fetchWithAuth(`${API_BASE_URL}/estadisticas/semanales`);
    },

    // Get monthly statistics  ->  GET /api/estadisticas/mensuales
    getMonthly: async (): Promise<any> => {
        return fetchWithAuth(`${API_BASE_URL}/estadisticas/mensuales`);
    },
};

export default {
    authAPI,
    usersAPI,
    statisticsAPI,
};
