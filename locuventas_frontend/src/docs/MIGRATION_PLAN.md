# Migration Plan

> Hoja de ruta de evolución del frontend de LocuVentas.
> Para la arquitectura actual ver [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Estado actual

```
✅ Fase 1 — TypeScript (en curso)
⬜ Fase 2 — Feature-Based Architecture
⬜ Fase 3 — Integración Gemini AI
```

---

## Fase 1 — Migración a TypeScript

Migración incremental. Los archivos `.jsx` y `.tsx` coexisten gracias a
`allowJs: true` en `tsconfig.json`. No hay una fecha límite — cada archivo
se migra cuando se toca por otro motivo.

### Completado

| Archivo                            | Notas                                      |
|------------------------------------|--------------------------------------------|
| `services/api.ts`                  | `apiRequest<T>()` genérico                 |
| `context/AuthContext.tsx`          | Tipos `Auth`, `Role`                       |
| `context/HeaderContext.tsx`        | Interfaz `HeaderContextValue`              |
| `context/useAuth.ts`               | Tipado completo                            |
| `hooks/useBuscador.ts`             | `RefObject<HTMLInputElement \| null>`      |
| `hooks/useBreakpoint.ts`           | `Breakpoint` como unión de strings         |
| `hooks/useResponsiveLayout.ts`     | `ResponsiveLayout` interface               |
| `hooks/useFiltrosProducto.ts`      | `PaisRaw`, `CategoriaRaw` interfaces       |
| `hooks/useGestionProductos.ts`     | `FormState`, `ModalState` interfaces       |
| `hooks/useHeaderManager.ts`        | `UseHeaderManagerReturn` interface         |
| `components/common/InputFieldset.tsx`   | Props tipadas                         |
| `components/common/SelectFieldset.tsx`  | `SelectOption` de `domain/ui.types`   |
| `components/common/UploadComponent.tsx` | Bug de imagen en edición corregido    |
| `components/products/ModalProductoForm.tsx` | `categoriaIds: number[]` unificado |
| `hooks/useProductos.ts`            | `UseProductosOptions`, `UseProductosReturn`   |
| `hooks/useVentasManager.ts`        | `VentaDetalle`, `VentaPageDTO`, modales       |
| `hooks/useVendedoresPendientes.ts` | `UsuarioPendiente`, acciones tipadas         |
| `utils/user.validator.ts`          | `UserData`, `ValidateOptions`, `Errors`      |
| `utils/imageUtils.ts`              | `resolveProductImage`, `resolveCountryImage` |
| `app/config/api.ts`                | `API_BASE_URL` tipado                        |
| `services/venta.service.ts`        | Solo `descargarTicketPDF` (código muerto eliminado) |
| `constants/breakpoints.ts`         | Eliminado `2XL`/`2xl` (dead code), tipado con `Breakpoint` |
| `constants/states.ts`              | `PAYMENT_STATES` tipado con `EstadoPago`     |
| `constants/index.ts`               | Barrel export                              |
| `layout/Header/config/adminMenuConfig.ts` | Menú admin tipado con `MenuItem`       |
| `layout/Header/config/userMenuConfig.ts`  | Menú usuario tipado con `UserMenuItem`  |
| `domain/api.types.ts`              | `ApiResponse<T>`, `PageDTO<T>`             |
| `domain/auth.types.ts`             | `Auth`, `Role`, `ConfirmacionGlobal`       |
| `domain/producto.types.ts`         | `Producto`, `ProductoDTO`                  |
| `domain/ui.types.ts`               | `SelectOption`, `Breakpoint`, `MenuItem`   |
| `domain/venta.types.ts`            | `Venta`, `LineaVenta`, `EstadoPago`        |

### Pendiente

Orden recomendado — de menos a más dependencias:

```

components/common/
  ├── BuscadorInput.jsx       → .tsx
  ├── Paginacion.jsx          → .tsx
  ├── ModalConfirmacion.jsx   → .tsx
  ├── DropdownContainer.jsx   → .tsx
  ├── RecursiveMenu.jsx       → .tsx
  ├── SelectFiltro.jsx        → .tsx
  ├── TablaLayout.jsx         → .tsx
  └── FAB.jsx                 → .tsx

components/products/
  ├── TablaProductos.jsx      → .tsx
  ├── ProductoCard.jsx        → .tsx
  ├── ProductoGestionCard.jsx → .tsx
  ├── CatalogoProductos.jsx   → .tsx
  └── GestionProductos.jsx    → .tsx

components/ventas/
  ├── VentaCard.jsx           → .tsx
  ├── ContenedorVentas.jsx    → .tsx
  ├── TablaVentas.jsx         → .tsx
  └── CarritoVentas.jsx       → .tsx

components/vendedor/
  ├── TarjetaVendedor.jsx     → .tsx
  └── PendientesList.jsx      → .tsx

layout/Header/                → todos los componentes del header

pages/                        → al final, dependen de todo lo anterior
```

### Reglas durante la migración

- Nunca usar `any` — usar `unknown` con cast explícito cuando sea necesario
- `import type` para imports de solo tipos (`verbatimModuleSyntax: true`)
- Tipos nuevos siempre en `src/domain/` — nunca inline en componentes
- `Record<string, unknown>` para datos crudos de la API antes de mapear
- Al migrar un hook, añadir el tipo de retorno explícito como interfaz

---

## Fase 2 — Feature-Based Architecture

**Prerequisito:** Fase 1 completada al 100%.

Reorganizar el código por dominio de negocio en lugar de por tipo técnico.
La migración es **movimiento de archivos** — la lógica no cambia.

### Estructura objetivo

```
src/
├── app/                    # Sin cambios
│
├── features/               # NUEVO
│   ├── auth/
│   │   ├── index.ts        # Barrel file — API pública del feature
│   │   ├── AuthContext.tsx ← mover desde context/
│   │   ├── useAuth.ts      ← mover desde context/
│   │   ├── FormLogin.tsx   ← mover desde components/vendedor/Form/
│   │   └── FormRegister.tsx
│   │
│   ├── productos/
│   │   ├── index.ts
│   │   ├── hooks/
│   │   │   ├── useProductos.ts
│   │   │   └── useGestionProductos.ts
│   │   ├── components/
│   │   │   ├── CatalogoProductos.tsx
│   │   │   ├── GestionProductos.tsx
│   │   │   ├── ModalProductoForm.tsx
│   │   │   ├── ProductoCard.tsx
│   │   │   ├── TablaProductos.tsx
│   │   │   └── SkeletonProductoFila.tsx
│   │   └── pages/
│   │       └── GestionProductosPagina.tsx
│   │
│   ├── ventas/
│   │   ├── index.ts
│   │   ├── hooks/
│   │   │   ├── useVentasManager.ts
│   │   │   └── useCarrito.ts
│   │   ├── components/
│   │   │   ├── CarritoVentas.tsx
│   │   │   ├── ContenedorVentas.tsx
│   │   │   ├── TablaVentas.tsx
│   │   │   ├── VentaCard.tsx
│   │   │   ├── ModalPago.tsx
│   │   │   └── DrawerCarrito.tsx
│   │   └── pages/
│   │       ├── Dashboard.tsx
│   │       ├── VentasPagina.tsx
│   │       └── VentasPendientesPagina.tsx
│   │
│   └── vendedores/
│       ├── index.ts
│       ├── hooks/
│       │   └── useVendedoresPendientes.ts
│       ├── components/
│       │   ├── PendientesList.tsx
│       │   └── TarjetaVendedor.tsx
│       └── pages/
│           └── VendedoresPendientes.tsx
│
├── shared/                 # NUEVO — lo que antes era common/ + hooks/ globales
│   ├── components/
│   │   ├── ui/             # Boton, BotonClaro, InputFieldset, SelectFieldset...
│   │   ├── layout/         # TablaLayout, Paginacion, FAB...
│   │   └── feedback/       # ModalConfirmacion, skeletons...
│   ├── hooks/              # useBreakpoint, useResponsiveLayout, useBuscador
│   └── domain/             ← mover desde src/domain/
│
├── layout/                 # Sin cambios
└── assets/                 # Sin cambios
```

### Barrel files

Cada feature expone solo su API pública. Los componentes internos
no se exportan — solo lo que otras partes de la app necesitan.

```ts
// src/features/productos/index.ts
export { default as CatalogoProductos } from "./components/CatalogoProductos";
export { default as GestionProductos }  from "./components/GestionProductos";
export { default as useProductos }      from "./hooks/useProductos";
export { default as useGestionProductos } from "./hooks/useGestionProductos";
// TablaProductos, ProductoCard, etc. NO se exportan — son internos
```

### Path aliases tras la reorganización

```ts
// vite.config.ts — simplificado
alias: {
  "@":        path.resolve(__dirname, "src"),
  "@features": path.resolve(__dirname, "src/features"),
  "@shared":  path.resolve(__dirname, "src/shared"),
  "@app":     path.resolve(__dirname, "src/app"),
  "@layout":  path.resolve(__dirname, "src/layout"),
  "@assets":  path.resolve(__dirname, "src/assets"),
}
```

### Imports antes y después

```ts
// Antes
import CatalogoProductos from "@components/products/CatalogoProductos";
import useProductos from "@hooks/useProductos";

// Después
import { CatalogoProductos, useProductos } from "@features/productos";
```

### Orden de migración de features

Empezar por el feature con menos dependencias externas:

```
1. auth/      ← solo depende de shared/
2. vendedores/ ← solo depende de shared/ y auth/
3. productos/ ← depende de shared/ y auth/
4. ventas/    ← depende de shared/, auth/ y productos/
```

---

## Fase 3 — Integración Gemini AI

**Prerequisito:** Fase 2 completada.

### Casos de uso identificados

```
1. Búsqueda semántica de productos
   — El vendedor describe el producto con lenguaje natural
   — Gemini devuelve los productos más relevantes

2. Resumen de ventas
   — El admin pide un resumen del día/semana
   — Gemini genera un informe en lenguaje natural

3. Sugerencias de categorización
   — Al crear un producto, Gemini sugiere categorías basadas en el nombre
```

### Ubicación en la arquitectura

```
src/
└── shared/
    └── ai/                     # NUEVO en Fase 3
        ├── gemini.client.ts    # Cliente Gemini (API key, configuración)
        ├── useGemini.ts        # Hook genérico para llamadas a Gemini
        └── prompts/            # Prompts organizados por caso de uso
            ├── productos.prompts.ts
            └── ventas.prompts.ts
```

El cliente de Gemini vive en `shared/` porque puede ser usado por
múltiples features. Los prompts específicos de cada feature pueden
vivir dentro del feature correspondiente.

### Variables de entorno necesarias

```env
VITE_API_URL=http://localhost:8080
VITE_GEMINI_API_KEY=...         # NUEVO en Fase 3
```

> ⚠️ La API key de Gemini no debe exponerse en el cliente en producción.
> Considerar proxy a través del backend en Spring Boot.

---

## Decisiones técnicas descartadas

### ❌ Renombrado masivo español → inglés
Rompe el historial de Git y todos los imports existentes sin aportar valor
funcional. Se mantiene español en archivos ya existentes y se usa inglés
solo en archivos nuevos de las fases 2 y 3.

### ❌ Migrar a Zustand o Redux
Context API es suficiente para la escala actual. Si en el futuro el estado
global crece significativamente, Zustand sería la opción — pero no antes
de que haya un problema real de rendimiento o complejidad.

### ❌ Migrar todo a TypeScript de golpe
La migración incremental con `allowJs: true` permite avanzar sin riesgo.
Forzar la migración completa introduciría demasiados errores a la vez.
