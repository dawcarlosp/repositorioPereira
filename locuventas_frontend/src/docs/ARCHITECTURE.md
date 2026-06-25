# Frontend Architecture

> Documento de referencia de la arquitectura **actual** del frontend de LocuVentas.
> Para el plan de migración ver [MIGRATION_PLAN.md](./MIGRATION_PLAN.md).

---

## Stack tecnológico

| Tecnología        | Versión  | Uso                              |
|-------------------|----------|----------------------------------|
| React             | 19       | Framework UI                     |
| TypeScript        | 5.x      | Tipado estático (migración en curso) |
| Vite              | 6.x      | Bundler y dev server             |
| Tailwind CSS      | 4.x      | Estilos utility-first            |
| React Router      | 6        | Navegación SPA                   |
| React Toastify    | —        | Notificaciones                   |
| Lucide React      | —        | Iconos                           |

---

## Organización actual

La estructura actual organiza el código por **tipo técnico** — todos los hooks
juntos, todos los componentes juntos, etc. Es el punto de partida antes de la
migración a arquitectura por features.

```
src/
├── app/                        # Punto de entrada de la aplicación
│   ├── App.tsx                 # Componente raíz
│   ├── providers.tsx           # Composición de providers globales
│   ├── routes.tsx              # Declaración de rutas
│   └── config/
│       └── api.ts              # API_BASE_URL desde VITE_API_URL
│
├── components/
│   ├── common/                 # Componentes reutilizables sin dominio
│   │   ├── buttons/            # Boton, BotonClaro, BotonCerrar
│   │   ├── BuscadorInput.jsx
│   │   ├── DropdownContainer.jsx
│   │   ├── InputFieldset.tsx
│   │   ├── ModalConfirmacion.jsx
│   │   ├── Paginacion.jsx
│   │   ├── RecursiveMenu.jsx
│   │   ├── SelectFieldset.tsx
│   │   ├── SelectFiltro.jsx
│   │   ├── SkeletonProductoCard.jsx
│   │   ├── SkeletonTarjetaVendedor.jsx
│   │   ├── TablaLayout.jsx
│   │   └── UploadComponent.tsx
│   ├── dev/
│   │   └── SobreMi.jsx         # Perfil del desarrollador
│   ├── products/               # Componentes del dominio productos
│   │   ├── CatalogoProductos.jsx
│   │   ├── GestionProductos.jsx
│   │   ├── ModalProductoForm.tsx
│   │   ├── ProductoCard.jsx
│   │   ├── ProductoGestionCard.jsx
│   │   ├── SkeletonProductoFila.jsx
│   │   └── TablaProductos.jsx
│   ├── vendedor/               # Componentes del dominio vendedores
│   │   ├── Form/
│   │   │   ├── FormEditarPerfil.jsx
│   │   │   ├── FormVendedorLogin.jsx
│   │   │   └── FormVendedorRegister.jsx
│   │   ├── PendientesList.jsx
│   │   ├── TarjetaVendedor.jsx
│   │   └── UploadAvatar.jsx
│   └── ventas/                 # Componentes del dominio ventas
│       ├── CarritoVentas.jsx
│       ├── ContenedorVentas.jsx
│       ├── DrawerCarrito.jsx
│       ├── ModalDetalleVenta.jsx
│       ├── ModalPago.jsx
│       ├── TablaVentas.jsx
│       └── VentaCard.jsx
│
├── constants/
│   ├── breakpoints.ts          # isMobile(), isBreakpoint() helpers
│   └── index.ts                # Re-exporta todo
│
├── context/
│   ├── AuthContext.tsx         # Auth global: token, roles, setAuth, logout
│   ├── HeaderContext.tsx       # Estado del header: menús, dropdowns, modales
│   └── useAuth.ts              # Hook para consumir AuthContext
│
├── domain/                     # Tipos TypeScript — fuente de verdad
│   ├── api.types.ts            # ApiResponse<T>, PageDTO<T>
│   ├── auth.types.ts           # Auth, Role, ConfirmacionGlobal
│   ├── producto.types.ts       # Producto, ProductoDTO, FiltrosProducto
│   ├── ui.types.ts             # SelectOption, Breakpoint, MenuItem
│   └── venta.types.ts          # Venta, LineaVenta, EstadoPago
│
├── hooks/
│   ├── useBuscador.ts          # Buscador con debounce
│   ├── useBreakpoint.ts        # Breakpoint actual
│   ├── useCarrito.js           # Cálculos del carrito: base, iva, total
│   ├── useFiltrosProducto.ts   # Carga países y categorías
│   ├── useGestionProductos.ts  # CRUD productos
│   ├── useHeaderManager.ts     # Estado completo del header
│   ├── useProductos.ts         # Fetch paginado con filtros
│   ├── useResponsiveLayout.ts  # isSmall, isMedium, isLarge
│   ├── useVendedoresPendientes.ts
│   └── useVentasManager.ts     # Fetch ventas, pago, cancelación
│
├── layout/
│   ├── AppLayout.jsx           # Layout principal: aside + main
│   ├── Aside.jsx
│   ├── Footer.jsx
│   ├── Main.jsx
│   └── Header/
│       ├── Header.jsx          # Header sticky con modales globales
│       ├── NavDesktop.jsx
│       ├── NavMobile.jsx
│       ├── components/
│       │   ├── AdminMenu.jsx
│       │   ├── GestionDropdown.jsx
│       │   ├── MenuUsuarioDropdown.jsx
│       │   └── VendedoresDropdown.jsx
│       └── config/
│           ├── adminMenuConfig.ts   # Árbol de menú admin (datos)
│           └── userMenuConfig.ts    # Árbol de menú usuario (datos)
│
├── pages/
│   ├── Dashboard.jsx
│   ├── GestionProductosPagina.jsx
│   ├── LoginPage.jsx
│   ├── SobreMiPage.jsx
│   ├── VendedoresPendientes.jsx
│   ├── VentasPagina.jsx
│   └── VentasPendientesPagina.jsx
│
├── services/
│   └── api.ts                  # apiRequest<T>() — cliente HTTP centralizado
│
└── utils/
    ├── imageUtils.ts           # resolveProductImage, resolveCountryImage
    ├── normalizaMultiValor.ts
    └── user.validator.ts
```

---

## Capas y responsabilidades

```
┌─────────────────────────────────────┐
│              pages/                  │  Orquesta: instancia hooks,
│                                      │  pasa props, renderiza modales
├─────────────────────────────────────┤
│            components/               │  Presentación: recibe props,
│                                      │  no llama a la API directamente
├─────────────────────────────────────┤
│              hooks/                  │  Lógica de negocio y estado
├─────────────────────────────────────┤
│            services/api.ts           │  Única puerta de entrada al backend
├─────────────────────────────────────┤
│              domain/                 │  Tipos TypeScript compartidos
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
useVentasManager   → fetch, pago, cancelación, detalle de ventas
useGestionProductos → CRUD completo de productos con form y modales
useCarrito         → cálculos: base imponible, IVA, total
useFiltrosProducto → carga países y categorías (catálogos maestros)
useHeaderManager   → estado global del header + confirmación global
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

```js
// adminMenuConfig.js — añadir una opción nueva
{ label: "Reportes", action: () => navigate("/reportes") }
```

### Skeleton Loading Pattern
Cada listado tiene un skeleton que replica la forma del item real para
evitar saltos visuales durante la carga.

| Skeleton                  | Item real             |
|---------------------------|-----------------------|
| `SkeletonProductoCard`    | `ProductoSimpleCard`  |
| `SkeletonTarjetaVendedor` | `TarjetaVendedor`     |
| `SkeletonProductoFila`    | Fila de `TablaProductos` |
| `SkeletonVentaCard`       | `VentaCard`           |

---

## Convenciones de código

### Componentes
- Nombre en PascalCase: `ProductoCard`, `TablaVentas`
- Un componente por archivo
- Los componentes no llaman a la API directamente

### Hooks
- Prefijo `use`: `useProductos`, `useCarrito`
- Devuelven un objeto con propiedades nombradas, nunca un array (salvo
  convención de React como `useState`)

### Tipos TypeScript
- Definidos en `src/domain/` — nunca inline en componentes
- `import type` para imports de solo tipos
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
