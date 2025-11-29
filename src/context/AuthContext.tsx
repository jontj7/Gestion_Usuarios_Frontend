import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    showSessionModal: boolean;
    continueSession: () => Promise<void>;
    cancelSession: () => void;
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
    const tokenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showSessionModal, setShowSessionModal] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    await authAPI.checkToken();
                    setUser(JSON.parse(storedUser));
                    startTokenExpirationTimer();
                } catch {
                    await logout();
                }
            }

            setLoading(false);
        };

        initAuth();

        return () => {
            if (tokenTimerRef.current) {
                clearTimeout(tokenTimerRef.current);
                tokenTimerRef.current = null;
            }
        };
    }, []);

    const TOKEN_DURATION_MS = 5 * 60 * 1000; // 5 minutos reales

    const startTokenExpirationTimer = (msUntilExpiry?: number) => {
        if (tokenTimerRef.current) {
            clearTimeout(tokenTimerRef.current);
            tokenTimerRef.current = null;
        }

        const timeoutMs = typeof msUntilExpiry === 'number' ? msUntilExpiry : TOKEN_DURATION_MS;

        tokenTimerRef.current = setTimeout(() => {
            setShowSessionModal(true);
        }, timeoutMs);
    };

    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await authAPI.login(credentials);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        startTokenExpirationTimer();
        return response;
    };

    const register = async (userData: RegisterData): Promise<AuthResponse> => {
        const response = await authAPI.register(userData);
        return response;
    };

    const logout = async (): Promise<void> => {
        try {
            await authAPI.logout();
        } finally {
            setUser(null);
            setShowSessionModal(false);

            if (tokenTimerRef.current) {
                clearTimeout(tokenTimerRef.current);
                tokenTimerRef.current = null;
            }

            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    };

    const continueSession = async () => {
        try {
            await authAPI.refreshToken();
            startTokenExpirationTimer();
            setShowSessionModal(false);
        } catch {
            await logout();
        }
    };

    const cancelSession = () => {
        setShowSessionModal(false);
        logout();
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        showSessionModal,
        continueSession,
        cancelSession
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
