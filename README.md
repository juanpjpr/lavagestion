# LavaGestión - SaaS para Tintorerías y Lavaderos

Sistema de gestión de pedidos, clientes y reportes para tintorerías y lavaderos en Latinoamérica.

## Estructura del proyecto

```
lavadero/
├── backend/     → API REST (Node.js + Express + Prisma + PostgreSQL)
├── frontend/    → Dashboard web (React + TypeScript + Vite)
├── android/     → App móvil (Kotlin + Jetpack Compose)
└── landing/     → Landing page de venta (HTML + CSS)
```

## Credenciales demo

| Campo         | Valor                  |
|---------------|------------------------|
| Email         | `admin@demo.com`       |
| Contraseña    | `123456`               |
| Tenant slug   | `lavanderia-demo`      |

## Levantar el proyecto

### 1. PostgreSQL

Con Docker:

```bash
docker run -d --name lavadero-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=lavadero \
  -p 5432:5432 postgres:16
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate    # Crear tablas
npm run db:seed       # Cargar datos demo
npm run dev           # http://localhost:3001
```

### 3. Frontend web

```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

### 4. Android

1. Abrir la carpeta `android/` en Android Studio
2. Sync Gradle
3. Correr en emulador (usa `10.0.2.2:3001` para acceder al backend local)
4. Para dispositivo físico, cambiar la IP en `RetrofitClient.kt`

### 5. Landing page

Abrir `landing/index.html` en el navegador, o:

```bash
cd landing
npx serve .
```

## Endpoints principales

| Método | Ruta                      | Descripción                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/auth/register`      | Crear tenant + usuario          |
| POST   | `/api/auth/login`         | Login                           |
| GET    | `/api/auth/me`            | Usuario actual                  |
| POST   | `/api/orders`             | Crear pedido                    |
| GET    | `/api/orders`             | Listar pedidos (filtros, paginación) |
| PATCH  | `/api/orders/:id/status`  | Cambiar estado del pedido       |
| POST   | `/api/clients`            | Crear cliente                   |
| GET    | `/api/clients`            | Listar clientes                 |
| GET    | `/api/reports/daily`      | Reporte diario                  |
| GET    | `/api/reports/weekly`     | Reporte semanal                 |

## Stack técnico

- **Backend:** Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT, Zod
- **Frontend:** React, TypeScript, Vite, React Router
- **Android:** Kotlin, Jetpack Compose, Material 3, Retrofit, DataStore
- **Arquitectura:** Multi-tenant por columna (row-level), Clean Architecture light
