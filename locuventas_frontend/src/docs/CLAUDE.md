# LocuVentas — Frontend

Sistema de gestión de ventas para comercios. Permite a vendedores gestionar
productos, registrar ventas y cobrar pagos. Los administradores gestionan el
personal y el catálogo.

## Stack

- **React 19** + **Vite** — framework y bundler
- **TypeScript** — migración incremental en curso (`.jsx` y `.tsx` coexisten)
- **Tailwind CSS v4** — estilos
- **React Router v6** — navegación
- **React Toastify** — notificaciones
- **Lucide React** — iconos

## Estructura del proyecto

```
src/
├── app/                    # Punto de entrada: App, providers, routes
│   ├── App.tsx
│   ├── providers.tsx       # AuthProvider + HeaderProvider
│   ├── routes.tsx          # Todas las rutas declaradas
│   └── config/
│       └── api.ts          # API_BASE_URL desde VITE_API_URL
├── components/
│   ├── common/             # Componentes reutilizables genéricos
│   │   ├── buttons/        # Boton.jsx, BotonClaro.tsx, BotonCerrar.jsx
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
│   ├── products/           # Componentes de productos
│   │   ├── CatalogoProductos.jsx
│   │   ├── GestionProductos.jsx
│   │   ├── ModalProductoForm.tsx
│   │   ├── ProductoCard.jsx
│   │   ├── ProductoGestionCard.jsx
│   │   ├── SkeletonProductoFila.jsx
│   │   └── TablaProductos.jsx
│   ├── vendedor/           # Componentes de vendedores
│   │   ├── Form/
│   │   │   ├── FormEditarPerfil.jsx
│   │   │   ├── FormVendedorLogin.jsx
│   │   │   └── FormVendedorRegister.jsx
│   │   ├── PendientesList.jsx
│   │   ├── TarjetaVendedor.jsx
│   │   └── UploadAvatar.jsx
│   ├── ventas/             # Componentes de ventas
│   │   ├── CarritoVentas.jsx
│   │   ├── ContenedorVentas.jsx
│   │   ├── DrawerCarrito.jsx
│   │   ├── ModalDetalleVenta.jsx
│   │   ├── ModalPago.jsx
│   │   ├── TablaVentas.jsx
│   │   └── VentaCard.jsx
│   └── dev/
│       └── SobreMi.jsx     # Página de perfil del desarrollador
├── constants/
│   ├── breakpoints.ts      # isMobile(), isBreakpoint() helpers
│   ├── states.ts
│   └── index.ts            # re-exporta todo
├── context/
│   ├── AuthContext.tsx     # Auth global: token, roles, setAuth, logout
│   ├── HeaderContext.tsx   # Estado del header: menús, dropdowns, modales
│   └── useAuth.ts          # Hook para consumir AuthContext
├── domain/                 # Tipos TypeScript (fuente de verdad de tipos)
│   ├── api.types.ts        # ApiResponse<T>, PageDTO<T>
│   ├── auth.types.ts       # Auth, Role, ConfirmacionGlobal
│   ├── producto.types.ts   # Producto, ProductoDTO, FiltrosProducto
│   ├── ui.types.ts         # SelectOption, Breakpoint, MenuItem
│   └── venta.types.ts      # Venta, LineaVenta, EstadoPago
├── hooks/
│   ├── useBuscador.ts      # Buscador con debounce, ref de input
│   ├── useBreakpoint.ts    # Breakpoint actual según window.innerWidth
│   ├── useCarrito.js       # Lógica del carrito: base, iva, total
│   ├── useFiltrosProducto.ts # Carga países y categorías (catálogos maestros)
│   ├── useGestionProductos.ts # CRUD productos: form, modales, submit
│   ├── useHeaderManager.ts # Estado completo del header + logout + confirmación global
│   ├── useProductos.ts     # Fetch paginado de productos con filtros
│   ├── useResponsiveLayout.ts # isSmall, isMedium, isLarge desde useBreakpoint
│   ├── useVendedoresPendientes.ts # Fetch y acciones sobre vendedores sin rol
│   └── useVentasManager.ts # Fetch ventas, pago, cancelación, detalle
├── layout/
│   ├── AppLayout.jsx       # Layout principal: aside + main
│   ├── Aside.jsx
│   ├── Footer.jsx
│   ├── Main.jsx
│   └── Header/
│       ├── Header.jsx      # Header sticky con modales globales
│       ├── NavDesktop.jsx
│       ├── NavMobile.jsx
│       ├── components/
│       │   ├── AdminMenu.jsx         # Menú admin usando RecursiveMenu
│       │   ├── GestionDropdown.jsx
│       │   ├── MenuUsuarioDropdown.jsx
│       │   └── VendedoresDropdown.jsx
│       └── config/
│           ├── adminMenuConfig.ts    # Árbol de menú admin (datos)
│           └── userMenuConfig.ts     # Árbol de menú usuario (datos)
├── pages/
│   ├── Dashboard.jsx           # Vista principal de ventas + carrito
│   ├── GestionProductosPagina.jsx
│   ├── LoginPage.jsx
│   ├── SobreMiPage.jsx
│   ├── VendedoresPendientes.jsx
│   ├── VentasPagina.jsx
│   └── VentasPendientesPagina.jsx
├── services/
│   ├── api.ts              # apiRequest<T>() — cliente HTTP centralizado
│   └── venta.service.ts    # descargarTicketPDF
└── utils/
    ├── imageUtils.ts       # resolveProductImage, resolveCountryImage
    ├── normalizaMultiValor.ts
    └── user.validator.ts
```

## Arquitectura y patrones

### Separación de responsabilidades
- **`pages/`** — solo orquesta: instancia hooks, pasa props, renderiza modales
- **`components/`** — solo presentación: recibe props, no llama a la API directamente
- **`hooks/`** — toda la lógica de negocio y estado
- **`services/api.ts`** — única puerta de entrada al backend
- **`domain/`** — única fuente de verdad para los tipos

### Menú recursivo
El menú de administración usa un árbol de datos en `adminMenuConfig.js`
renderizado por `RecursiveMenu.jsx`. Para añadir una opción nueva solo hay
que tocar el archivo de configuración — no los componentes.

```js
// adminMenuConfig.js — añadir una entrada es suficiente
{ label: "Nueva opción", action: () => navigate("/nueva-ruta") }
```

### Paginación
Todos los listados paginados siguen el mismo patrón:
- El hook gestiona `page`, `size`, `totalPages`
- El componente recibe estas props y renderiza `<Paginacion />`
- Al buscar o filtrar, siempre se resetea a `page = 0`

### Skeleton loading
Cada listado tiene su skeleton que replica la forma visual del item real:
- `SkeletonProductoCard` → `ProductoSimpleCard`
- `SkeletonTarjetaVendedor` → `TarjetaVendedor`
- `SkeletonProductoFila` → fila de `TablaProductos`
- `SkeletonVentaCard` → `VentaCard` (inline en `ContenedorVentas`)

### DropdownContainer
Componente genérico que calcula automáticamente la posición de la flecha
apuntando al trigger. Acepta `side="top|bottom|left|right"`.

```jsx
<DropdownContainer isOpen={isOpen} triggerRef={btnRef} side="right" width="w-56">
  {children}
</DropdownContainer>
```

## Migración TypeScript

**Estado actual:** migración incremental — `.jsx` y `.tsx` coexisten.

**Ya migrados:**
- `services/api.ts`
- `context/AuthContext.tsx`, `HeaderContext.tsx`, `useAuth.ts`
- `hooks/useBuscador.ts`, `useBreakpoint.ts`, `useResponsiveLayout.ts`
- `hooks/useFiltrosProducto.ts`, `useGestionProductos.ts`, `useHeaderManager.ts`
- `components/common/InputFieldset.tsx`, `SelectFieldset.tsx`, `UploadComponent.tsx`
- `components/products/ModalProductoForm.tsx`
- `hooks/useProductos.ts`
- `hooks/useVentasManager.ts`
- `hooks/useVendedoresPendientes.ts`
- `utils/imageUtils.ts`
- `utils/user.validator.ts`
- `app/config/api.ts`
- `services/venta.service.ts`
- `constants/breakpoints.ts`, `states.ts`, `index.ts`
- `layout/Header/config/adminMenuConfig.ts`, `userMenuConfig.ts`
- `domain/` — todos los tipos base

**Pendiente (por orden):**
1. Componentes comunes restantes
3. Layout y Header
4. Pages

**Convenciones durante la migración:**
- Nunca usar `any` — usar `unknown` y hacer cast explícito
- `import type` para imports de solo tipos (requerido por `verbatimModuleSyntax`)
- Interfaces en `src/domain/` — nunca definir tipos inline en componentes
- `Record<string, unknown>` para datos crudos de la API antes de mapear

## API y backend

- Base URL: `VITE_API_URL` en `.env`
- Autenticación: JWT en `Authorization: Bearer <token>`
- Token guardado en `localStorage` bajo la clave `"auth"`
- Respuesta estándar: `ApiResponse<T>` con `{ message, status, data }`
- Paginación: `PageDTO<T>` con `{ content, number, totalPages, totalElements }`

```ts
// Ejemplo de llamada tipada
const res = await apiRequest<ApiResponse<PageDTO<Producto>>>(
  `productos?page=${page}&size=${size}`,
  null,
  { method: "GET" }
);
```

## Roles y rutas protegidas

```
ROLE_ADMIN   → acceso total
ROLE_VENDEDOR → dashboard, ventas, perfil
Sin rol      → solo login (pendiente de aprobación)
```

Rutas protegidas con `<PrivateRoute>` en `app/routes.tsx`.

## Variables de entorno

```env
VITE_API_URL=http://localhost:8080
```

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # previsualizar build
```

## Esquema de colores (Tailwind)

| Elemento         | Color                        |
|------------------|------------------------------|
| Fondo principal  | `zinc-900`                   |
| Fondo secundario | `zinc-800`                   |
| Bordes           | `zinc-700` / `purple-500`    |
| Acento principal | `orange-500`                 |
| Acento secundario| `purple-500`                 |
| Texto primario   | `white` / `zinc-100`         |
| Texto secundario | `zinc-400` / `zinc-500`      |
| Éxito            | `emerald-500`                |
| Peligro          | `rose-500`                   |
| Alerta           | `amber-500`                  |
