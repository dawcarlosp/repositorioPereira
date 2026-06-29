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
│   │   ├── buttons/        # Button.tsx, MenuButton.tsx
│   │   ├── AlertSimple.tsx
│   │   ├── Avatar.tsx
│   │   ├── BaseModal.tsx
│   │   ├── BuscadorInput.tsx
│   │   ├── DataTable.tsx
│   │   ├── DropdownContainer.tsx

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

### Button (variant pattern)
Componente unificado que reemplaza `Boton`, `BotonClaro`, `BotonCerrar` y `Enlace`.
Usa una prop `variant` para cambiar de estilo:

```tsx
type ButtonVariant = "primary" | "secondary" | "link" | "close";
```

| Variant | Reemplaza | Uso típico |
|---------|-----------|------------|
| `primary` (default) | `Boton` | Botón principal con ring púrpura y fondo oscuro |
| `secondary` | `BotonClaro` | Botón secundario, fondo zinc-800 |
| `link` | `Enlace` | Texto azul sin fondo, para acciones tipo link |
| `close` | `BotonCerrar` | Icono X para cerrar modales |

```jsx
<Button>Enviar</Button>                                          {/* primary */}
<Button variant="secondary">Cancelar</Button>                    {/* secondary */}
<Button variant="link" onClick={handleClick}>Regístrate</Button> {/* link */}
<Button variant="close" onClick={handleClose} />                 {/* close */}
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

---

## Roadmap de mejora arquitectónica

Resumen de fases planificadas tras la migración TS. Cada fase se trabaja en una rama independiente desde `develop` y se mergea vía PR.

### Fase 1 ✅ — Bugs + dead code
- Corregir imports rotos (`useGestionProductos`)
- Corregir `auth.id` inexistente en `CarritoVentas`
- Eliminar archivos muertos: `normalizaMultiValor.ts`, `SkeletonProductoFila.tsx`, `VendedoresDropdown.tsx`, `PRODUCT_STATES`, `SELLER_STATES`
- Unificar `MenuItem` en `@domain/ui.types`

### Reorganización feature-based ✅
Se migraron todos los dominios a `src/features/` siguiendo la estructura `{domain}/{components,domain,hooks,pages}/`:
- `auth/` — login, registro, aprobación de vendedores
- `productos/` — catálogo, gestión CRUD
- `ventas/` — carrito, ventas, cobros
- `dev/` — perfil del desarrollador

### Fase 2 🔲 — Refactor de componentes duplicados

> **Nota:** `SelectFieldset` + `SelectFiltro` no se unificaron porque tienen props muy divergentes (`multiple`, `required`, firma de `onChange`, etc.). Se extrajo lógica compartida en `SelectBase` y se renombraron.
| Rama | Qué hace | Estado |
|------|----------|--------|
| `refactor/phase2-button` | Unificar `Boton`, `BotonClaro`, `BotonCerrar`, `Enlace` → `Button` con `variant` | ✅ Mergeado |
| `refactor/phase2-select` | Extraer lógica compartida en `SelectBase` + renombrar `SelectFieldset` → `SelectForm`, `SelectFiltro` → `SelectFilter` | ✅ Mergeado |
| `refactor/phase2-upload` | Unificar `UploadComponent` + `UploadAvatar` → `ImageUpload` con `shape` | 🔲 |
| `refactor/phase2-skeleton` | Unificar `SkeletonProductoCard`, `SkeletonTarjetaVendedor` e inlines → `Skeleton` con `variant` | 🔲 |

### Fase 3 🔲 — Refactor arquitectura
- Crear `usePaginatedFetch<T>` genérico para eliminar el patrón repetido en hooks de fetch paginado
- Mover `PrivateRoute` → `app/`
- Mover `FooterLogin` → `common/`

### Notas
- `ModalConfirmacion.onConfirmar` acepta `() => void` pero se usa como `() => Promise<void>` en `useVentasManager` → ya corregido
- `AlertSimple` es redundante (es `ModalConfirmacion` sin botón cancelar) → pendiente de eliminar
- `useHeaderManager.ts` duplica lógica de breakpoint de `useBreakpoint.ts` → pendiente de refactor

---

## Última sesión (28 Jun 2026)

Para retomar el trabajo, abrir el chat y empezar con: **"Continúa con el roadmap del CLAUDE.md"**

### Contexto de la sesión anterior
- **Phase 2: Button unificado** — mergeado ✅
  - Creado `Button.tsx` con variants `primary|secondary|link|close`
  - Refactorizado `MenuButton.tsx` para usar `Button variant="secondary"`
  - Eliminados: `Boton.tsx`, `BotonClaro.tsx`, `BotonCerrar.tsx`, `Enlace.tsx`
  - 22 archivos actualizados, build verificado
- **Phase 2: Select** — extraído `SelectBase` con lógica compartida, renombrados `SelectFieldset` → `SelectForm`, `SelectFiltro` → `SelectFilter` ✅
- Siguiente paso: **Phase 2 — Upload** (unificar `UploadComponent` + `UploadAvatar`)

### Convención de nombres de ramas

```
{tipo}/{descripcion-corta-con-guiones}
```

| Tipo      | Uso                          | Ejemplos |
|-----------|------------------------------|----------|
| `refactor`| Refactor de código existente | `refactor/phase2-button`, `refactor/rename-selects` |
| `feature` | Nueva funcionalidad          | `feature-backend`, `feature-frontend` |
| `fix`     | Corrección de bugs           | `fix/react19-deprecations` |
| `docs`    | Documentación                | `docs/update-claude-md`, `docs/update-documentation` |
| `hotfix`  | Parche urgente a master      | `hotfix-fronted` |

### Flujo de trabajo
1. Crear rama desde `develop` con el nombre adecuado
2. Trabajar, commit, push
3. Crear PR a `develop`
4. Mergear PR en GitHub, luego borrar rama remota
5. `develop` se mergea a `master` solo al completar un hito
