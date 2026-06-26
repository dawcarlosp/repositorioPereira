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

La estructura actual organiza el código por **tipo técnico** — todos los hooks
juntos, todos los componentes juntos, etc.

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
│   │   ├── buttons/            # Boton.tsx, BotonClaro.tsx, BotonCerrar.tsx, MenuButton.tsx
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
│   │   ├── SelectFieldset.tsx
│   │   ├── SelectFiltro.tsx
│   │   ├── SkeletonProductoCard.tsx
│   │   ├── SkeletonTarjetaVendedor.tsx
│   │   └── UploadComponent.tsx
│   ├── dev/
│   │   └── SobreMi.tsx         # Perfil del desarrollador
│   ├── products/               # Componentes del dominio productos
│   │   ├── CatalogoProductos.tsx
│   │   ├── GestionProductos.tsx
│   │   ├── ModalProductoForm.tsx
│   │   ├── ProductoCard.tsx
│   │   ├── ProductoGestionCard.tsx
│   │   └── TablaProductos.tsx
│   ├── vendedor/               # Componentes del dominio vendedores
│   │   ├── Form/
│   │   │   ├── FormEditarPerfil.tsx
│   │   │   ├── FormVendedorLogin.tsx
│   │   │   └── FormVendedorRegister.tsx
│   │   ├── PendientesList.tsx
│   │   ├── TarjetaVendedor.tsx
│   │   └── UploadAvatar.tsx
│   ├── ventas/                 # Componentes del dominio ventas
│   │   ├── CarritoVentas.tsx
│   │   ├── ContenedorVentas.tsx
│   │   ├── DrawerCarrito.tsx
│   │   ├── MenuVentas.tsx
│   │   ├── ModalDetalleVenta.tsx
│   │   ├── ModalPago.tsx
│   │   ├── TablaVentas.tsx
│   │   └── VentaCard.tsx
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
├── domain/                     # Tipos TypeScript — fuente de verdad
│   ├── api.types.ts            # ApiResponse<T>, PageDTO<T>
│   ├── auth.types.ts           # Auth, Role, ConfirmacionGlobal
│   ├── producto.types.ts       # Producto, ProductoDTO
│   ├── ui.types.ts             # SelectOption, Breakpoint, MenuItem
│   └── venta.types.ts          # Venta, LineaVenta, EstadoPago
│
├── hooks/
│   ├── useBuscador.ts          # Buscador con debounce
│   ├── useBreakpoint.ts        # Breakpoint actual
│   ├── useCarrito.ts           # Cálculos del carrito: base, iva, total
│   ├── useFiltrosProducto.ts   # Carga países y categorías
│   ├── useGestionProductos.ts  # CRUD productos
│   ├── useHeaderManager.ts     # Estado completo del header
│   ├── useProductos.ts         # Fetch paginado con filtros
│   ├── useResponsiveLayout.ts  # isSmall, isMedium, isLarge
│   ├── useVendedoresPendientes.ts
│   └── useVentasManager.ts     # Fetch ventas, pago, cancelación
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
├── pages/
│   ├── Dashboard.tsx
│   ├── GestionProductosPagina.tsx
│   ├── LoginPage.tsx
│   ├── SobreMiPage.tsx
│   ├── VendedoresPendientes.tsx
│   ├── VentasPagina.tsx
│   └── VentasPendientesPagina.tsx
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

```ts
// adminMenuConfig.ts — añadir una opción nueva
{ label: "Reportes", action: () => navigate("/reportes") }
```

### Skeleton Loading Pattern
Cada listado tiene un skeleton que replica la forma del item real para
evitar saltos visuales durante la carga.

| Skeleton                  | Item real             |
|---------------------------|-----------------------|
| `SkeletonProductoCard`    | `ProductoCard`        |
| `SkeletonTarjetaVendedor` | `TarjetaVendedor`     |
| `SkeletonVentaCard`       | `VentaCard` (inline en ContenedorVentas) |

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
