import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tokenRefreshInterval, setTokenRefreshInterval] = useState<NodeJS.Timeout | null>(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Verify token is still valid
                    await authAPI.checkToken();
                    setUser(JSON.parse(storedUser));
                    startTokenRefresh();
                } catch (error) {
                    console.error('Token validation failed:', error);
                    logout();
                }
            }

            setLoading(false);
        };

        initAuth();

        return () => {
            if (tokenRefreshInterval) {
                clearInterval(tokenRefreshInterval);
            }
        };
    }, []);

    // Auto-refresh token every 4 minutes (token expires in 5 minutes)
    const startTokenRefresh = () => {
        const interval = setInterval(async () => {
            try {
                await authAPI.refreshToken();
                console.log('Token refreshed successfully');
            } catch (error) {
                console.error('Failed to refresh token:', error);
                logout();
            }
        }, 4 * 60 * 1000); // 4 minutes

        setTokenRefreshInterval(interval);
    };

    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await authAPI.login(credentials);
            setUser(response.user);
            startTokenRefresh();
            return response;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: RegisterData): Promise<AuthResponse> => {
        try {
            const response = await authAPI.register(userData);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            if (tokenRefreshInterval) {
                clearInterval(tokenRefreshInterval);
                setTokenRefreshInterval(null);
            }
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
