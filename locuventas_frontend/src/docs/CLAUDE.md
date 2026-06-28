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
│   └── FooterLogin.tsx
├── constants/
│   ├── breakpoints.ts
│   ├── states.ts
│   └── index.ts
├── context/
│   ├── AuthContext.tsx
│   ├── HeaderContext.tsx
│   └── useAuth.ts
├── domain/                 # Tipos compartidos entre features
│   ├── api.types.ts        # ApiResponse<T>, PageDTO<T>
│   └── ui.types.ts         # SelectOption, Breakpoint, MenuItem
├── features/               # Código organizado por dominio de negocio
│   ├── auth/               # Autenticación y gestión de vendedores
│   │   ├── components/     # PendientesList, TarjetaVendedor, FormLogin...
│   │   ├── domain/         # auth.types.ts, vendedor.types.ts
│   │   ├── hooks/          # useLogin, useRegister, useEditarPerfil
│   │   └── pages/          # LoginPage, VendedoresPendientesPagina
│   ├── dev/                # Perfil del desarrollador
│   │   ├── components/     # SobreMi.tsx
│   │   └── pages/          # SobreMiPage.tsx
│   ├── productos/          # Catálogo y gestión de productos
│   │   ├── components/     # CatalogoProductos, GestionProductos, ...
│   │   ├── domain/         # producto.types.ts
│   │   ├── hooks/          # useProductos, useGestionProductos, useFiltrosProducto
│   │   └── pages/          # GestionProductosPagina.tsx
│   └── ventas/             # Ventas, carrito y cobros
│       ├── components/     # CarritoVentas, ContenedorVentas, ModalPago...
│       ├── domain/         # venta.types.ts
│       ├── hooks/          # useCarrito, useVentasManager
│       └── pages/          # Dashboard, VentasPagina, VentasPendientesPagina
├── hooks/                  # Hooks globales y compartidos
│   ├── useBuscador.ts      # Buscador con debounce, ref de input
│   ├── useBreakpoint.ts    # Breakpoint actual según window.innerWidth
│   ├── useHeaderManager.ts # Estado completo del header + logout + confirmación global
│   ├── useResponsiveLayout.ts # isSmall, isMedium, isLarge desde useBreakpoint
│   └── useVendedoresPendientes.ts # Fetch y acciones sobre vendedores sin rol
├── services/
│   ├── api.ts
│   └── venta.service.ts
└── utils/
    ├── imageUtils.ts
    └── user.validator.ts
```

## Arquitectura y patrones

### Separación de responsabilidades
- **`features/*/pages/`** — solo orquesta: instancia hooks, pasa props, renderiza modales
- **`features/*/components/`** — solo presentación: recibe props, no llama a la API directamente
- **`features/*/hooks/`** — toda la lógica de negocio y estado del feature
- **`features/*/domain/`** — tipos específicos del feature
- **`hooks/`** (raíz) — hooks compartidos entre features (useBreakpoint, useBuscador, etc.)
- **`components/common/`** — componentes UI reutilizables (botones, modales, inputs)
- **`services/api.ts`** — única puerta de entrada al backend
- **`domain/`** (raíz) — tipos compartidos entre features (api.types, ui.types)

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
