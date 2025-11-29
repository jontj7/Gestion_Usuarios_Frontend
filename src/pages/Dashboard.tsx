import { useState, useEffect } from 'react';
import { statisticsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { Statistics } from '../types';

const Dashboard = () => {
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            const response = await statisticsAPI.getGeneral();
            setStats(response.data);
        } catch (error) {
            setToast({ message: 'Error al cargar estadísticas', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            {toast && (
                <div className="toast-container">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Dashboard</h1>
                    <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                        Resumen general del sistema de gestión de usuarios
                    </p>
                </div>

                {/* Statistics Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-2xl)'
                }}>
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                        borderColor: 'rgba(124, 58, 237, 0.3)'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                            TOTAL USUARIOS
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary-light)' }}>
                            {stats?.total_usuarios || 0}
                        </div>
                    </div>

                    <div className="card" style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(74, 222, 128, 0.1) 100%)',
                        borderColor: 'rgba(34, 197, 94, 0.3)'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                            USUARIOS ACTIVOS
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
                            {stats?.usuarios_activos || 0}
                        </div>
                    </div>

                    <div className="card" style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.1) 100%)',
                        borderColor: 'rgba(239, 68, 68, 0.3)'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                            USUARIOS INACTIVOS
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-error)' }}>
                            {stats?.usuarios_inactivos || 0}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    <div className="card">
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Registros Recientes</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 'var(--spacing-md)',
                                background: 'var(--glass-bg)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Hoy</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-primary-light)' }}>
                                    {stats?.registros_hoy || 0} usuarios
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 'var(--spacing-md)',
                                background: 'var(--glass-bg)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Esta semana</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-primary-light)' }}>
                                    {stats?.registros_esta_semana || 0} usuarios
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 'var(--spacing-md)',
                                background: 'var(--glass-bg)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Este mes</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-primary-light)' }}>
                                    {stats?.registros_este_mes || 0} usuarios
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Acciones Rápidas</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <a href="/users" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                Ver Todos los Usuarios
                            </a>
                            <a href="/users?action=create" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                                Crear Nuevo Usuario
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
