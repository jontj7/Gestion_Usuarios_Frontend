import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User, RegisterData } from '../types';

interface UserModalProps {
    user: User | null;
    onClose: () => void;
    onSave: (data: RegisterData) => Promise<void>;
}

interface FormData extends RegisterData {
    confirmPassword?: string;
}

const UserModal = ({ user, onClose, onSave }: UserModalProps) => {
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        direccion: '',
        password: '',
        activo: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                email: user.email || '',
                telefono: user.telefono || '',
                fecha_nacimiento: user.fecha_nacimiento || '',
                direccion: user.direccion || '',
                password: '',
                activo: user.activo ?? true
            });
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

        // Password is only required when creating a new user
        if (!user && !formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password && formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
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
            // Don't send password if it's empty (for updates)
            const dataToSend = { ...formData };
            if (!dataToSend.password) {
                delete dataToSend.password;
            }

            await onSave(dataToSend);
        } catch (error: any) {
            setErrors({ submit: error.message || 'Error al guardar usuario' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-lg)',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="card" style={{
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div className="card-header">
                    <h2 className="card-title">
                        {user ? 'Editar Usuario' : 'Crear Usuario'}
                    </h2>
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
                            value={formData.direccion}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Contraseña {user ? '(dejar en blanco para no cambiar)' : '*'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder={user ? 'Dejar en blanco para no cambiar' : ''}
                        />
                        {errors.password && <div className="form-error">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                name="activo"
                                checked={formData.activo}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <span>Usuario activo</span>
                        </label>
                    </div>

                    {errors.submit && (
                        <div className="form-error" style={{ marginBottom: 'var(--spacing-md)' }}>
                            {errors.submit}
                        </div>
                    )}

                    <div className="card-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
