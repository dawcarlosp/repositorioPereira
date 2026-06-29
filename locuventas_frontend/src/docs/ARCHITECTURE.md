# Frontend Architecture

> Documento de referencia de la arquitectura **actual** del frontend de LocuVentas.
> Para el plan de migración ver [MIGRATION_PLAN.md](./MIGRATION_PLAN.md).

---

## Stack tecnológico

| Tecnología        | Versión  | Uso                              |
|-------------------|----------|----------------------------------|
| React             | 19       | Framework UI                     |
| TypeScript        | 6.x      | Tipado estático (100% migrado)   |
| Vite              | 6.x      | Bundler y dev server             |
| Tailwind CSS      | 4.x      | Estilos utility-first            |
| @tailwindcss/vite | 4.x      | Plugin Vite para Tailwind v4     |
| React Router      | 7        | Navegación SPA                   |
| React Toastify    | —        | Notificaciones                   |
| Lucide React      | —        | Iconos                           |
| FontAwesome       | —        | Iconos adicionales               |
| date-fns          | —        | Manipulación de fechas           |
| html-to-image     | —        | Captura de DOM a imagen          |

---

## Organización actual

La estructura está organizada por **dominio de negocio** usando carpetas
`features/`, con componentes UI compartidos en `components/common/`.

```
src/
├── app/                        # Punto de entrada de la aplicación
│   ├── main.tsx                # Entry point (Vite)
│   ├── App.tsx                 # Componente raíz
│   ├── providers.tsx           # Composición de providers globales
│   ├── routes.tsx              # Declaración de rutas
│   └── config/
│       └── api.ts              # API_BASE_URL desde VITE_API_URL
│
├── components/
│   ├── common/                 # Componentes reutilizables sin dominio
│   │   ├── buttons/            # Button.tsx, MenuButton.tsx
│   │   ├── AlertSimple.tsx
│   │   ├── Avatar.tsx
│   │   ├── BaseModal.tsx
│   │   ├── BuscadorInput.tsx
│   │   ├── DataTable.tsx
│   │   ├── DropdownContainer.tsx
│   │   ├── Enlace.tsx
│   │   ├── Error.tsx
│   │   ├── FAB.tsx
│   │   ├── FormDialog.tsx
│   │   ├── InputFieldset.tsx
│   │   ├── InputFieldsetValidaciones.tsx
│   │   ├── LogoNegocio.tsx
│   │   ├── ModalConfirmacion.tsx
│   │   ├── Paginacion.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── RecursiveMenu.tsx
│   │   ├── SelectBase.tsx
│   │   ├── SelectForm.tsx
│   │   ├── SelectFilter.tsx
│   │   ├── SkeletonProductoCard.tsx
│   │   ├── SkeletonTarjetaVendedor.tsx
│   │   └── UploadComponent.tsx
│   └── FooterLogin.tsx
│
├── constants/
│   ├── breakpoints.ts          # Breakpoint helpers
│   ├── states.ts
│   └── index.ts                # Re-exporta todo
│
├── context/
│   ├── AuthContext.tsx         # Auth global: token, roles, setAuth, logout
│   ├── HeaderContext.tsx       # Estado del header: menús, dropdowns, modales
│   └── useAuth.ts              # Hook para consumir AuthContext
│
├── domain/                     # Tipos compartidos entre features
│   ├── api.types.ts            # ApiResponse<T>, PageDTO<T>
│   └── ui.types.ts             # SelectOption, Breakpoint, MenuItem
│
├── features/                   # Código organizado por dominio de negocio
│   ├── auth/                   # Autenticación y gestión de vendedores
│   │   ├── components/         # PendientesList, TarjetaVendedor, FormLogin...
│   │   ├── domain/             # auth.types.ts, vendedor.types.ts
│   │   ├── hooks/              # useLogin, useRegister, useEditarPerfil
│   │   └── pages/              # LoginPage, VendedoresPendientesPagina
│   │
│   ├── dev/                    # Perfil del desarrollador
│   │   ├── components/         # SobreMi.tsx
│   │   └── pages/              # SobreMiPage.tsx
│   │
│   ├── productos/              # Catálogo y gestión de productos
│   │   ├── components/         # CatalogoProductos, GestionProductos, ...
│   │   ├── domain/             # producto.types.ts
│   │   ├── hooks/              # useProductos, useGestionProductos, useFiltrosProducto
│   │   └── pages/              # GestionProductosPagina.tsx
│   │
│   └── ventas/                 # Ventas, carrito y cobros
│       ├── components/         # CarritoVentas, ContenedorVentas, ModalPago...
│       ├── domain/             # venta.types.ts
│       ├── hooks/              # useCarrito, useVentasManager
│       └── pages/              # Dashboard, VentasPagina, VentasPendientesPagina
│
├── hooks/                      # Hooks globales y compartidos
│   ├── useBuscador.ts          # Buscador con debounce
│   ├── useBreakpoint.ts        # Breakpoint actual
│   ├── useHeaderManager.ts     # Estado completo del header
│   ├── useResponsiveLayout.ts  # isSmall, isMedium, isLarge
│   └── useVendedoresPendientes.ts
│
├── layout/
│   ├── AppLayout.tsx           # Layout principal: aside + main
│   ├── Aside.tsx
│   ├── Footer.tsx
│   ├── Main.tsx
│   └── Header/
│       ├── Header.tsx          # Header sticky con modales globales
│       ├── NavDesktop.tsx
│       ├── NavMobile.tsx
│       ├── components/
│       │   ├── AdminMenu.tsx
│       │   ├── GestionDropdown.tsx
│       │   └── MenuUsuarioDropdown.tsx
│       └── config/
│           ├── adminMenuConfig.ts   # Árbol de menú admin (datos)
│           └── userMenuConfig.ts    # Árbol de menú usuario (datos)
│
├── services/
│   ├── api.ts                  # apiRequest<T>() — cliente HTTP centralizado
│   └── venta.service.ts        # descargarTicketPDF
│
└── utils/
    ├── imageUtils.ts           # resolveProductImage, resolveCountryImage
    └── user.validator.ts
```

---

## Capas y responsabilidades

```
┌─────────────────────────────────────┐
│        features/*/pages/             │  Orquesta: instancia hooks,
│                                      │  pasa props, renderiza modales
├─────────────────────────────────────┤
│      features/*/components/          │  Presentación: recibe props,
│                                      │  no llama a la API directamente
├─────────────────────────────────────┤
│        features/*/hooks/             │  Lógica de negocio y estado del feature
├─────────────────────────────────────┤
│     hooks/ (raíz) + common/          │  Hooks y componentes compartidos
├─────────────────────────────────────┤
│            services/api.ts           │  Única puerta de entrada al backend
├─────────────────────────────────────┤
│     domain/ (raíz) + features/*/d…   │  Tipos TypeScript compartidos y de feature
└─────────────────────────────────────┘
```

**Regla fundamental:** los componentes no llaman a `apiRequest` directamente.
Toda llamada al backend pasa por un hook.

---

## Patrones aplicados

### Provider Pattern
Global state mediante React Context API.

```tsx
// app/providers.tsx
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <HeaderProvider>{children}</HeaderProvider>
    </AuthProvider>
  );
}
```

Contextos existentes:
- `AuthContext` — token JWT, roles, `setAuth`, `logout`
- `HeaderContext` — estado de menús, dropdowns y modales del header

### Custom Hooks Pattern
Toda la lógica de negocio vive en hooks, no en componentes.

```
useVentasManager      → fetch, pago, cancelación, detalle de ventas (features/ventas/)
useGestionProductos   → CRUD completo de productos con form y modales (features/productos/)
useCarrito            → cálculos: base imponible, IVA, total (features/ventas/)
useFiltrosProducto    → carga países y categorías (features/productos/)
useHeaderManager      → estado global del header + confirmación global (hooks/)
```

### Container / Presentational Pattern
`ContenedorVentas` decide qué vista renderizar según el breakpoint:

```
ContenedorVentas
├── TablaVentas    (desktop — md+)
└── VentaCard      (móvil — xs, sm)
```

### Guard Pattern
`PrivateRoute` protege rutas según autenticación y rol.

### Recursive Menu Pattern
El menú de administración usa un árbol de datos renderizado por
`RecursiveMenu`. Para añadir opciones solo se toca el archivo de configuración.

```ts
// adminMenuConfig.ts — añadir una opción nueva
{ label: "Reportes", action: () => navigate("/reportes") }
```

### Skeleton Loading Pattern
Cada listado tiene un skeleton que replica la forma del item real para
evitar saltos visuales durante la carga.

| Skeleton                  | Item real                                |
|---------------------------|------------------------------------------|
| `SkeletonProductoCard`    | `ProductoCard` (features/productos/)     |
| `SkeletonTarjetaVendedor` | `TarjetaVendedor` (features/auth/)       |
| `SkeletonVentaCard`       | `VentaCard` (inline en ContenedorVentas) |

---

## Convenciones de código

### Componentes
- Nombre en PascalCase: `ProductoCard`, `TablaVentas`
- Un componente por archivo
- Los componentes no llaman a la API directamente

### Hooks
- Prefijo `use`: `useProductos`, `useCarrito`
- Cada feature tiene sus hooks en `features/X/hooks/`
- Los hooks compartidos viven en `hooks/` raíz
- Devuelven un objeto con propiedades nombradas, nunca un array (salvo
  convención de React como `useState`)

### Tipos TypeScript
- Definidos en `features/*/domain/` para cada dominio
- Tipos compartidos en `src/domain/` (api.types, ui.types)
- Nunca `any` — usar `unknown` con cast explícito

### Paginación
Todos los listados paginados siguen el mismo contrato:

```ts
// El hook gestiona
{ page, size, totalPages, setPage, setSize }

// El componente recibe y renderiza
<Paginacion page={page} totalPages={totalPages} onPageChange={setPage} ... />

// Al buscar o filtrar, siempre resetear
setPage(0);
```

### Estilos
Tailwind CSS con el esquema de colores del proyecto:

| Elemento          | Token Tailwind                  |
|-------------------|---------------------------------|
| Fondo principal   | `bg-zinc-900`                   |
| Fondo secundario  | `bg-zinc-800`                   |
| Bordes            | `border-zinc-700` / `border-purple-500` |
| Acento principal  | `text-orange-500`               |
| Acento secundario | `text-purple-500`               |
| Texto primario    | `text-white` / `text-zinc-100`  |
| Texto secundario  | `text-zinc-400`                 |
| Éxito             | `text-emerald-500`              |
| Peligro           | `text-rose-500`                 |
| Alerta            | `text-amber-500`                |

---

## API y autenticación

- Base URL: variable de entorno `VITE_API_URL`
- Autenticación: JWT en header `Authorization: Bearer <token>`
- Token persistido en `localStorage` bajo la clave `"auth"`
- El token se valida al montar `AuthProvider` — si está expirado se hace
  logout automático

### Formato de respuesta del backend

```ts
// Respuesta estándar
interface ApiResponse<T> {
  message: string;
  status:  number;
  data:    T;
}

// Respuesta paginada
interface PageDTO<T> {
  content:       T[];
  number:        number;
  totalPages:    number;
  totalElements: number;
}
```

### Ejemplo de llamada tipada

```ts
const res = await apiRequest<ApiResponse<PageDTO<Producto>>>(
  `productos?page=${page}&size=${size}`,
  null,
  { method: "GET" }
);
// res.data.content es Producto[] — TypeScript lo verifica
```

---

## Roles y rutas

```
ROLE_ADMIN    → acceso total
ROLE_VENDEDOR → dashboard, ventas, perfil
Sin rol       → solo login (pendiente de aprobación por admin)
```

Rutas protegidas con `<PrivateRoute>` en `app/routes.tsx`.

---

## Variables de entorno

```env
VITE_API_URL=http://localhost:8080
```

---

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```
