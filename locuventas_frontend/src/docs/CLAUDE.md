# LocuVentas — Frontend

Sistema de gestión de ventas para comercios. Permite a vendedores gestionar
productos, registrar ventas y cobrar pagos. Los administradores gestionan el
personal y el catálogo.

## Stack

- **React 19** + **Vite 6** — framework y bundler
- **TypeScript** — migración completa (100% `.tsx`/`.ts`)
- **Tailwind CSS v4** + **@tailwindcss/vite** — estilos
- **React Router v7** — navegación
- **React Toastify** — notificaciones
- **Lucide React** — iconos
- **FontAwesome** — iconos adicionales
- **date-fns** — manipulación de fechas
- **html-to-image** — captura de DOM a imagen

## Estructura del proyecto

```
src/
├── app/                    # Punto de entrada: App, providers, routes
│   ├── main.tsx            # Entry point (Vite)
│   ├── App.tsx
│   ├── providers.tsx       # AuthProvider + HeaderProvider
│   ├── routes.tsx          # Todas las rutas declaradas
│   └── config/
│       └── api.ts          # API_BASE_URL desde VITE_API_URL
├── components/
│   ├── common/             # Componentes reutilizables genéricos
│   │   ├── buttons/        # Boton.tsx, BotonClaro.tsx, BotonCerrar.tsx, MenuButton.tsx
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
│   ├── products/           # Componentes de productos
│   │   ├── CatalogoProductos.tsx
│   │   ├── GestionProductos.tsx
│   │   ├── ModalProductoForm.tsx
│   │   ├── ProductoCard.tsx
│   │   ├── ProductoGestionCard.tsx
│   │   └── TablaProductos.tsx
│   ├── vendedor/           # Componentes de vendedores
│   │   ├── Form/
│   │   │   ├── FormEditarPerfil.tsx
│   │   │   ├── FormVendedorLogin.tsx
│   │   │   └── FormVendedorRegister.tsx
│   │   ├── PendientesList.tsx
│   │   ├── TarjetaVendedor.tsx
│   │   └── UploadAvatar.tsx
│   ├── ventas/             # Componentes de ventas
│   │   ├── CarritoVentas.tsx
│   │   ├── ContenedorVentas.tsx
│   │   ├── DrawerCarrito.tsx
│   │   ├── MenuVentas.tsx
│   │   ├── ModalDetalleVenta.tsx
│   │   ├── ModalPago.tsx
│   │   ├── TablaVentas.tsx
│   │   └── VentaCard.tsx
│   ├── dev/
│   │   └── SobreMi.tsx     # Página de perfil del desarrollador
│   └── FooterLogin.tsx
├── constants/
│   ├── breakpoints.ts
│   ├── states.ts
│   └── index.ts
├── context/
│   ├── AuthContext.tsx
│   ├── HeaderContext.tsx
│   └── useAuth.ts
├── domain/
│   ├── api.types.ts        # ApiResponse<T>, PageDTO<T>
│   ├── auth.types.ts       # Auth, Role, ConfirmacionGlobal
│   ├── producto.types.ts   # Producto, ProductoDTO
│   ├── ui.types.ts         # SelectOption, Breakpoint, MenuItem
│   └── venta.types.ts      # Venta, LineaVenta, EstadoPago
├── hooks/
│   ├── useBuscador.ts      # Buscador con debounce, ref de input
│   ├── useBreakpoint.ts    # Breakpoint actual según window.innerWidth
│   ├── useCarrito.ts       # Lógica del carrito: base, iva, total
│   ├── useFiltrosProducto.ts # Carga países y categorías (catálogos maestros)
│   ├── useGestionProductos.ts # CRUD productos: form, modales, submit
│   ├── useHeaderManager.ts # Estado completo del header + logout + confirmación global
│   ├── useProductos.ts     # Fetch paginado de productos con filtros
│   ├── useResponsiveLayout.ts # isSmall, isMedium, isLarge desde useBreakpoint
│   ├── useVendedoresPendientes.ts # Fetch y acciones sobre vendedores sin rol
│   └── useVentasManager.ts # Fetch ventas, pago, cancelación, detalle
├── layout/
│   ├── AppLayout.tsx       # Layout principal: aside + main
│   ├── Aside.tsx
│   ├── Footer.tsx
│   ├── Main.tsx
│   └── Header/
│       ├── Header.tsx      # Header sticky con modales globales
│       ├── NavDesktop.tsx
│       ├── NavMobile.tsx
│       ├── components/
│       │   ├── AdminMenu.tsx         # Menú admin usando RecursiveMenu
│       │   ├── GestionDropdown.tsx
│       │   └── MenuUsuarioDropdown.tsx
│       └── config/
│           ├── adminMenuConfig.ts
│           └── userMenuConfig.ts
├── pages/
│   ├── Dashboard.tsx           # Vista principal de ventas + carrito
│   ├── GestionProductosPagina.tsx
│   ├── LoginPage.tsx
│   ├── SobreMiPage.tsx
│   ├── VendedoresPendientes.tsx
│   ├── VentasPagina.tsx
│   └── VentasPendientesPagina.tsx
├── services/
│   ├── api.ts
│   └── venta.service.ts
└── utils/
    ├── imageUtils.ts
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
El menú de administración usa un árbol de datos en `adminMenuConfig.ts`
renderizado por `RecursiveMenu.tsx`. Para añadir una opción nueva solo hay
que tocar el archivo de configuración — no los componentes.

```ts
// adminMenuConfig.ts — añadir una entrada es suficiente
{ label: "Nueva opción", action: () => navigate("/nueva-ruta") }
```

### Paginación
Todos los listados paginados siguen el mismo patrón:
- El hook gestiona `page`, `size`, `totalPages`
- El componente recibe estas props y renderiza `<Paginacion />`
- Al buscar o filtrar, siempre se resetea a `page = 0`

### Skeleton loading
Cada listado tiene su skeleton que replica la forma visual del item real:
- `SkeletonProductoCard` → `ProductoCard`
- `SkeletonTarjetaVendedor` → `TarjetaVendedor`
- `SkeletonVentaCard` → inline en `ContenedorVentas`

**PENDIENTE:** Unificar en un solo `Skeleton` con `variant="card|row|circle"`.

### DropdownContainer
Componente genérico que calcula automáticamente la posición de la flecha
apuntando al trigger. Acepta `side="top|bottom|left|right"`.

```jsx
<DropdownContainer isOpen={isOpen} triggerRef={btnRef} side="right" width="w-56">
  {children}
</DropdownContainer>
```

## Convenciones TypeScript

**Estado:** migración completada — 0 archivos `.jsx`/`.js` en `src/`.

**Convenciones:**
- Nunca usar `any` — usar `unknown` y hacer cast explícito
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
