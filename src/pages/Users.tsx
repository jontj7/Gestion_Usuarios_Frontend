import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import UserModal from '../components/UserModal';
import { User, RegisterData } from '../types';

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(response.data);
        } catch (error) {
            setToast({ message: 'Error al cargar usuarios', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
            return;
        }

        try {
            await usersAPI.delete(id);
            setToast({ message: 'Usuario eliminado exitosamente', type: 'success' });
            loadUsers();
        } catch (error) {
            setToast({ message: 'Error al eliminar usuario', type: 'error' });
        }
    };

    const handleSave = async (userData: RegisterData) => {
        try {
            if (selectedUser) {
                await usersAPI.update(selectedUser.id, userData);
                setToast({ message: 'Usuario actualizado exitosamente', type: 'success' });
            } else {
                await usersAPI.create(userData);
                setToast({ message: 'Usuario creado exitosamente', type: 'success' });
            }
            setModalOpen(false);
            loadUsers();
        } catch (error) {
            throw error;
        }
    };

    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        return (
            user.nombre?.toLowerCase().includes(search) ||
            user.apellido?.toLowerCase().includes(search) ||
            user.email?.toLowerCase().includes(search)
        );
    });

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
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-2xl)',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-md)'
                }}>
                    <div>
                        <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>Gestión de Usuarios</h1>
                        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                            {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button onClick={handleCreate} className="btn btn-primary">
                        + Crear Usuario
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Buscar por nombre, apellido o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: '400px' }}
                    />
                </div>

                {/* Users Table */}
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            No se encontraron usuarios
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.nombre} {user.apellido}</td>
                                        <td>{user.email}</td>
                                        <td>{user.telefono || '-'}</td>
                                        <td>
                                            <span className={`badge ${user.activo ? 'badge-success' : 'badge-danger'}`}>
                                                {user.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default Users;
