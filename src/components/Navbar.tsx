import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav style={{
            background: 'var(--glass-bg)',
            borderBottom: '1px solid var(--glass-border)',
            backdropFilter: 'var(--glass-blur)',
            padding: 'var(--spacing-md) 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: 'var(--shadow-md)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
                    <h2 style={{
                        margin: 0,
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Gestión de Usuarios
                    </h2>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <Link
                            to="/dashboard"
                            className={isActive('/dashboard') ? 'text-primary' : ''}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all var(--transition-base)',
                                background: isActive('/dashboard') ? 'rgba(124, 58, 237, 0.1)' : 'transparent'
                            }}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/users"
                            className={isActive('/users') ? 'text-primary' : ''}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all var(--transition-base)',
                                background: isActive('/users') ? 'rgba(124, 58, 237, 0.1)' : 'transparent'
                            }}
                        >
                            Usuarios
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                        {user?.nombre} {user?.apellido}
                    </span>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
