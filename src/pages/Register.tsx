import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { RegisterData } from '../types';

interface RegisterFormData extends RegisterData {
    confirmPassword?: string;
}

const Register = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        direccion: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password && formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        return newErrors;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...userData } = formData;
            await register(userData);
            setToast({ message: 'Registro exitoso. Redirigiendo al login...', type: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            setToast({ message: error.message || 'Error al registrarse', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)'
        }}>
            {toast && (
                <div className="toast-container">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="card-header text-center">
                    <h1 className="card-title" style={{
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Crear Cuenta
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                        Completa el formulario para registrarte
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label htmlFor="nombre" className="form-label">Nombre *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className="form-input"
                                placeholder="Juan"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.nombre && <div className="form-error">{errors.nombre}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellido" className="form-label">Apellido *</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                className="form-input"
                                placeholder="Pérez"
                                value={formData.apellido}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.apellido && <div className="form-error">{errors.apellido}</div>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label htmlFor="telefono" className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                className="form-input"
                                placeholder="+52 123 456 7890"
                                value={formData.telefono}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                id="fecha_nacimiento"
                                name="fecha_nacimiento"
                                className="form-input"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="direccion" className="form-label">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            className="form-input"
                            placeholder="Calle, Ciudad, Estado"
                            value={formData.direccion}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.password && <div className="form-error">{errors.password}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                Registrando...
                            </div>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: 'var(--spacing-lg)',
                    textAlign: 'center',
                    paddingTop: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--color-border)'
                }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-primary">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
