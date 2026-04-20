# Longevus Frontend - Especificación Técnica

> **"Porque en cada vida hay un legado que cuidar."**

**Longevus** es una plataforma web integral para la gestión de residencias de adultos mayores. Esta interfaz frontend está construida con **React** y **TypeScript**, con enfoque en modularidad, seguridad basada en permisos y una experiencia de usuario fluida mediante componentes reutilizables y validaciones robustas.

> 📡 Requiere el [backend de Longevus](https://github.com/tu-usuario/longevus-back) ejecutándose en `http://localhost:8080`

---

## 🚀 Funcionalidades por Módulo

### 👴 Residentes y Contactos
- Visualización detallada del perfil del residente (estado de salud, habitación, datos personales).
- Gestión dinámica de contactos de emergencia (CRUD) mediante ventanas modales.
- Carga y visualización de fotografías para identificación rápida.

### 🏠 Habitaciones
- Control de ocupación y tipos de habitación (Individual / Grupal).
- Validación de capacidad de camas y numeración única.
- Seguimiento del estado de disponibilidad en tiempo real.

### 🧑‍💼 Personal
- Registro y listado de cuidadores y administradores.
- Visualización de horarios de turno asignados.
- Carga de fotografía e información de contacto por empleado.

### 🗓️ Visitas
- Registro de visitantes con parentesco, fecha y residente a visitar.
- Historial de visitas por residente.
- Carga de fotografía del visitante para identificación.

### 📅 Actividades
- Agenda de actividades recreativas, médicas y de capacitación.
- Solo los administradores pueden crear o modificar actividades.
- Visualización de estado (Por realizar / Finalizada) para todos los usuarios.

### 📦 Inventario y Productos
- Catálogo de productos con filtrado por búsqueda y categoría (Salud, Limpieza, Alimento, etc.).
- Gestión de unidades de medida.
- Alertas de vencimiento y relación directa con proveedores.

### 🚚 Proveedores
- Mantenimiento completo de proveedores con soporte para carga de archivos multimedia (`FormData`).
- Validación de estados activos e inactivos.
- Sincronización de eliminación lógica para productos asociados.

### 🛒 Compras
- Registro de compras asociadas a un proveedor.
- Impacto automático en el inventario al registrar una compra.

### 🧾 Facturación
- Emisión y listado de facturas asociadas a residentes y sus familiares.
- Registro de método de pago, monto, periodo facturado y consecutivo.
- Acceso exclusivo para administradores.

### 📝 Tareas
- Asignación de tareas a cuidadores.
- Edición *in-place* dentro de modales para optimizar el flujo de trabajo.
- Control de actualización y eliminación según permisos del usuario.

---

## 🎨 Identidad Visual

El sistema sigue una paleta de colores definida para transmitir calma y confianza:

| Rol | Color | Hex |
| :--- | :--- | :--- |
| **Primario** | Verde | `#A8C3A0` |
| **Secundario** | Azul oscuro | `#202042` |
| **Terciario** | Café | `#422C20` |

Los estilos globales deben respetar esta paleta. Se utiliza Bootstrap 5 como base, con clases personalizadas para los colores de marca.

---

## 🛠️ Stack Tecnológico

| Herramienta | Uso |
| :--- | :--- |
| **React 18 + TypeScript** | Core de la aplicación con tipado estático |
| **Bootstrap 5** | Diseño responsivo y componentes base |
| **React Router Dom** | Navegación SPA entre módulos |
| **Axios** | Comunicación con la API REST del backend |
| **Context API (AuthContext)** | Manejo de sesión y control de permisos globales |
| **SweetAlert2** | Notificaciones y diálogos de confirmación |
| **Bootstrap Icons** | Iconografía consistente en toda la UI |

---

## 🏗️ Estructura del Proyecto

```text
src/
├── components/
│   ├── common/          # Componentes reutilizables (Tabla general, Header, Footer)
│   ├── modals/          # Modales de creación, edición y detalle por módulo
│   └── ui/              # Elementos de UI menores (botones, badges, alertas)
├── context/
│   └── AuthContext.tsx  # Sesión del usuario, roles y permisos globales
├── js/
│   └── alerts.js        # Utilidades de SweetAlert2 y helpers globales
├── pages/
│   ├── Login/           # Vista de autenticación
│   ├── Home/            # Página de inicio del sistema
│   ├── Residents/       # Módulo de residentes y contactos
│   ├── Rooms/           # Módulo de habitaciones
│   ├── Staff/           # Módulo de personal y horarios
│   ├── Visits/          # Módulo de registro de visitas
│   ├── Activities/      # Módulo de agenda y actividades
│   ├── Inventory/       # Módulo de inventario
│   ├── Products/        # Módulo de catálogo de productos
│   ├── Suppliers/       # Módulo de proveedores
│   ├── Purchases/       # Módulo de compras
│   ├── Billing/         # Módulo de facturación
│   └── Tasks/           # Módulo de tareas para cuidadores
├── services/            # Capa de abstracción Axios por módulo (residentService, roomService, etc.)
└── types/               # Interfaces TypeScript de dominio (Resident, Room, Supplier, etc.)
```

---

## ⚙️ Configuración y Ejecución

### Requisitos Previos

- Node.js v16 o superior
- Backend de Longevus ejecutándose en `http://localhost:8080`

### Instalación

1. Clonar el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/longevus-front.git
    ```
2. Instalar dependencias:
    ```bash
    npm install
    ```
3. Iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🔒 Seguridad y Permisos

El frontend implementa renderizado condicional basado en permisos específicos obtenidos del backend al iniciar sesión. Cada acción sensible en la UI (botones de crear, editar, eliminar) se muestra únicamente si el usuario posee el permiso correspondiente.

**Ejemplos de permisos integrados:**

| Permiso | Acción protegida |
| :--- | :--- |
| `PERMISSION_RESIDENTES_CREATE` | Botón "Agregar Residente" |
| `PERMISSION_PRODUCTOS_CREATE` | Botón "Agregar Producto" |
| `PERMISSION_TAREAS_UPDATE` | Edición de tareas asignadas |
| `PERMISSION_CONTACTOS_VIEW` | Vista de contactos de emergencia |
| `PERMISSION_FACTURACION_CREATE` | Emisión de facturas (solo Admin) |
| `PERMISSION_ACTIVIDADES_CREATE` | Crear actividades en agenda (solo Admin) |

---

## 📝 Notas de Implementación Técnica

- **Manejo de Archivos:** Se utiliza `FormData` para creación y actualización de entidades con imágenes (Proveedores, Productos, Residentes, Visitas), asegurando compatibilidad con el endpoint `multipart/form-data` del backend.
- **Validaciones:** Se implementó lógica de `touched` y `errors` en los formularios para proporcionar feedback instantáneo antes del envío de datos.
- **Tipado:** Todas las respuestas de la API están tipadas mediante `Interfaces` TypeScript para evitar errores en tiempo de ejecución y mejorar el autocompletado durante el desarrollo.
- **Interceptores Axios:** Cada servicio incluye la configuración del token JWT en el header `Authorization` para proteger las peticiones autenticadas.

---

## 👨‍💻 Equipo de Desarrollo

| Nombre | Módulos Frontend |
| :--- | :--- |
| Gabriel Moya Caravaca | Componente tabla general, Login, Personal, Tareas |
| Joshua Céspedes Gómez | Header (Admin), Residentes, Contactos |
| Pablo Ramírez Ugalde | Proveedores, Roles y Permisos |
| Britany Villalobos Salazar | HomePage, Inventario, Compras |

---

© 2025 Proyecto Longevus — Curso IF-4101 Lenguajes de Aplicaciones Comerciales.
