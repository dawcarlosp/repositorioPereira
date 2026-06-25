# LocuVentas — Frontend

Sistema de gestión de ventas para comercios. Permite a vendedores gestionar
productos, registrar ventas y cobrar pagos. Los administradores gestionan el
personal y el catálogo.

## Stack

- **React 19** + **Vite** — framework y bundler
- **TypeScript** — migración completa al 100%
- **Tailwind CSS v4** — estilos
- **React Router v6** — navegación
- **React Toastify** — notificaciones
- **Lucide React** — iconos

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
│   │   ├── buttons/        # Boton, BotonClaro, BotonCerrar (PENDIENTE: unificar en Button)
│   │   ├── BuscadorInput.tsx
│   │   ├── DropdownContainer.tsx
│   │   ├── InputFieldset.tsx
│   │   ├── ModalConfirmacion.tsx
│   │   ├── Paginacion.tsx
│   │   ├── RecursiveMenu.tsx
│   │   ├── SelectFieldset.tsx
│   │   ├── SelectFiltro.tsx
│   │   ├── SkeletonProductoCard.tsx
│   │   ├── SkeletonTarjetaVendedor.tsx
│   │   ├── TablaLayout.tsx
│   │   └── UploadComponent.tsx
│   ├── products/
│   │   ├── CatalogoProductos.tsx
│   │   ├── GestionProductos.tsx
│   │   ├── ModalProductoForm.tsx
│   │   ├── ProductoCard.tsx
│   │   ├── ProductoGestionCard.tsx
│   │   └── TablaProductos.tsx
│   ├── vendedor/
│   │   ├── Form/
│   │   │   ├── FormEditarPerfil.tsx
│   │   │   ├── FormVendedorLogin.tsx
│   │   │   └── FormVendedorRegister.tsx
│   │   ├── PendientesList.tsx
│   │   ├── TarjetaVendedor.tsx
│   │   └── UploadAvatar.tsx
│   ├── ventas/
│   │   ├── CarritoVentas.tsx
│   │   ├── ContenedorVentas.tsx
│   │   ├── DrawerCarrito.tsx
│   │   ├── ModalDetalleVenta.tsx
│   │   ├── ModalPago.tsx
│   │   ├── TablaVentas.tsx
│   │   └── VentaCard.tsx
│   └── dev/
│       └── SobreMi.tsx
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
│   ├── producto.types.ts   # Producto, ProductoDTO, FiltrosProducto
│   ├── ui.types.ts         # SelectOption, Breakpoint, MenuItem
│   └── venta.types.ts      # Venta, LineaVenta, EstadoPago
├── hooks/
│   ├── useBuscador.ts
│   ├── useBreakpoint.ts
│   ├── useCarrito.ts
│   ├── useFiltrosProducto.ts
│   ├── useGestionProductos.ts
│   ├── useHeaderManager.ts
│   ├── useProductos.ts
│   ├── useResponsiveLayout.ts
│   ├── useVendedoresPendientes.ts
│   └── useVentasManager.ts
├── layout/
│   ├── AppLayout.tsx
│   ├── Aside.tsx
│   ├── Footer.tsx
│   ├── Main.tsx
│   └── Header/
│       ├── Header.tsx
│       ├── NavDesktop.tsx
│       ├── NavMobile.tsx
│       ├── components/
│       │   ├── AdminMenu.tsx
│       │   ├── GestionDropdown.tsx
│       │   └── MenuUsuarioDropdown.tsx
│       └── config/
│           ├── adminMenuConfig.ts
│           └── userMenuConfig.ts
├── pages/
│   ├── Dashboard.tsx
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

- Nunca usar `any` — usar `unknown` y hacer cast explícito
- `import type` para imports de solo tipos (requerido por `verbatimModuleSyntax`)
- Interfaces en `src/domain/` para tipos compartidos, tipos inline para props locales
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

---

## Roadmap de mejora arquitectónica

Resumen de fases planificadas tras la migración TS. Cada fase se trabaja en una rama independiente desde `develop` y se mergea vía PR.

### Fase 1 ✅ — Bugs + dead code (PR #27)
- Corregir imports rotos (`useGestionProductos`)
- Corregir `auth.id` inexistente en `CarritoVentas`
- Eliminar archivos muertos: `normalizaMultiValor.ts`, `SkeletonProductoFila.tsx`, `VendedoresDropdown.tsx`, `PRODUCT_STATES`, `SELLER_STATES`
- Unificar `MenuItem` en `@domain/ui.types`

### Fase 2 🔲 — Unificar componentes duplicados
| Rama | Qué hace |
|------|----------|
| `refactor/phase2-button` | Unificar `Boton`, `BotonClaro`, `Enlace` → `Button` con `variant` |
| `refactor/phase2-select` | Unificar `SelectFieldset` + `SelectFiltro` → `Select` con `theme` |
| `refactor/phase2-upload` | Unificar `UploadComponent` + `UploadAvatar` → `ImageUpload` con `shape` |
| `refactor/phase2-skeleton` | Unificar `SkeletonProductoCard`, `SkeletonTarjetaVendedor` e inlines → `Skeleton` con `variant` |

### Fase 3 🔲 — Refactor arquitectura
- Extraer API calls de formularios (`FormVendedorLogin`, `FormEditarPerfil`) a hooks dedicados
- Crear `usePaginatedFetch<T>` genérico para eliminar el patrón repetido en `useProductos`, `useVentasManager`, `useVendedoresPendientes`
- Estandarizar detección mobile con `useResponsiveLayout`

### Fase 4 🔲 — Reorganización de directorios
- Mover `PrivateRoute` → `app/`
- Mover `FooterLogin` → `common/`
- Mover `MenuVentas` → `common/` o `layout/`
- Mover formularios de login/register → `components/auth/`

### Notas
- `ModalConfirmacion.onConfirmar` acepta `() => void` pero se usa como `() => Promise<void>` en `useVentasManager` → ya corregido
- `AlertSimple` es redundante (es `ModalConfirmacion` sin botón cancelar) → pendiente de eliminar
- `useHeaderManager.ts` duplica lógica de breakpoint de `useBreakpoint.ts` → pendiente de refactor

---

## Última sesión (25 Jun 2026)

Para retomar el trabajo, abrir el chat y empezar con: **"Continúa con el roadmap del CLAUDE.md"**

### Contexto de la sesión anterior
- Migración TypeScript completada al 100%
- PR #27 (`refactor/phase1-bugs-deadcode`) pendiente de mergear en `develop`
- Se estaba evaluando por dónde empezar en **Fase 2** (unificar componentes)
- Ramas activas: `refactor/phase1-bugs-deadcode` (sin mergear)

### Flujo de trabajo
- Ramas creadas desde `develop` con nombre `refactor/phaseN-descripcion`
- Trabajar, commit, push, PR a `develop`
- Mergear PR en GitHub, luego borrar rama remota
- `develop` se mergea a `master` solo al completar un hito