# Gestión de Usuarios - React + TypeScript

Sistema de gestión de usuarios desarrollado con **React + TypeScript + Vite** que se conecta a una API Laravel.

## 🚀 Características

- ✅ **Autenticación completa**: Login, registro, logout con tokens JWT
- ✅ **Gestión de usuarios (CRUD)**: Crear, leer, actualizar y eliminar usuarios
- ✅ **Dashboard con estadísticas**: Visualización de métricas de usuarios
- ✅ **Tipado Estricto**: Código robusto con TypeScript
- ✅ **Diseño moderno**: UI con glassmorphism y gradientes
- ✅ **Refresh automático de tokens**: Sesión persistente
- ✅ **Notificaciones toast**: Feedback visual de acciones
- ✅ **Responsive**: Funciona en móviles y desktop

## 📋 Requisitos Previos

- Node.js 16+ instalado
- Backend Laravel corriendo en `http://localhost:8000`

## 🛠️ Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu máquina local:

1. **Clonar el repositorio** (si aplica) o descargar el código.

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**:
   Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`) y define la URL de tu API:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables (.tsx)
│   ├── Navbar.tsx      # Barra de navegación
│   ├── ProtectedRoute.tsx  # Rutas protegidas
│   ├── Toast.tsx       # Notificaciones
│   └── UserModal.tsx   # Modal para crear/editar usuarios
├── context/            # Context API (.tsx)
│   └── AuthContext.tsx # Contexto de autenticación
├── pages/              # Páginas principales (.tsx)
│   ├── Dashboard.tsx   # Dashboard con estadísticas
│   ├── Login.tsx       # Página de login
│   ├── Register.tsx    # Página de registro
│   └── Users.tsx       # Gestión de usuarios
├── services/           # Servicios de API (.ts)
│   └── api.ts         # Cliente HTTP y endpoints
├── types/              # Definiciones de tipos TypeScript (.ts)
│   └── index.ts       # Interfaces compartidas (User, AuthResponse, etc.)
├── App.tsx            # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🔐 Autenticación y Seguridad

El sistema implementa:

- **Login/Registro** con validación de formularios y tipos.
- **Tokens JWT** almacenados en localStorage.
- **Refresh automático** cada 4 minutos (token expira en 5).
- **Protección de rutas** con `ProtectedRoute`.
- **Redirección automática** al expirar sesión.

## 📊 Endpoints Utilizados

El frontend espera que el backend exponga los siguientes endpoints (configurados en `src/services/api.ts`):

### Autenticación (`/api/auth`)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/check` - Verificar token

### Usuarios (`/api/usuarios`)
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Estadísticas (`/api/estadisticas`)
- `GET /api/estadisticas` - Estadísticas generales
- `GET /api/estadisticas/diarias` - Estadísticas diarias
- `GET /api/estadisticas/semanales` - Estadísticas semanales
- `GET /api/estadisticas/mensuales` - Estadísticas mensuales

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Verificar tipos (TypeScript)
npx tsc

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🤝 Contribución


