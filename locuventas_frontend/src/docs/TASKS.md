# Tasks

> Cola de tareas priorizada. Cada tarea tiene un estado y una iteración asignada.
> La IA debe consultar este archivo al inicio de cada sesión para saber qué hacer.
>
> Estados: `pending` | `in_progress` | `done` | `cancelled` | `blocked`

---

## Fase 3 — Refactor arquitectura ✅

| # | Tarea | Estado | Iteración | Notas |
|---|-------|--------|-----------|-------|
| 3.1 | Crear `usePaginatedFetch<T>` hook genérico | `done` | 1 | En `src/hooks/usePaginatedFetch.ts`. Soporta extractData personalizado, AbortController, refresh() |
| 3.2 | Refactorizar `useProductos` para usar `usePaginatedFetch` | `done` | 1 | Misma interfaz externa. Build verificado |
| 3.3 | Refactorizar `useVentasManager` para usar `usePaginatedFetch` | `done` | 1 | Misma interfaz externa. Usa `refresh()` tras pago/cancelación |
| 3.4 | Refactorizar `useVendedoresPendientes` para usar `usePaginatedFetch` | `done` | 1 | Misma interfaz externa. Eliminado `useEffect` redundante |
| 3.5 | Mover `PrivateRoute` → `app/` | `done` | 1 | Ahora en `src/app/PrivateRoute.tsx`. Import actualizado en `routes.tsx` |
| 3.6 | Mover `FooterLogin` → `components/common/` | `done` | 1 | Ahora en `src/components/common/FooterLogin.tsx`. Imports actualizados |

## Fase 4 — Integración Gemini AI (requiere Fase 3)

| # | Tarea | Estado | Iteración | Notas |
|---|-------|--------|-----------|-------|
| 4.1 | Crear `shared/ai/gemini.client.ts` | `pending` | — | Cliente Gemini con API key |
| 4.2 | Crear `shared/ai/useGemini.ts` | `pending` | — | Hook genérico para llamadas a Gemini |
| 4.3 | Implementar búsqueda semántica de productos | `pending` | — | Vendedor describe producto en lenguaje natural |
| 4.4 | Implementar resumen de ventas con IA | `pending` | — | Admin pide resumen del día/semana |
| 4.5 | Implementar sugerencias de categorización | `pending` | — | Al crear producto, Gemini sugiere categorías |

## Bugs y mejoras

| # | Tarea | Estado | Iteración | Notas |
|---|-------|--------|-----------|-------|
| B.1 | Eliminar `AlertSimple` (redundante con `ModalConfirmacion`) | `pending` | — | Es `ModalConfirmacion` sin botón cancelar |
| B.2 | Refactorizar `useHeaderManager` para no duplicar lógica de `useBreakpoint` | `pending` | — | Duplica lógica de breakpoints |
| B.3 | Eliminar `ComponentType<any>` en `PANEL_MAP` de `RecursiveMenu` | `pending` | — | Pendiente de encontrar alternativa limpia |
| B.4 | Unificar skeletons en un solo `Skeleton` con `variant` | `pending` | — | Propuesto: `variant="card\|row\|circle"` |

## Tests

| # | Tarea | Estado | Iteración | Notas |
|---|-------|--------|-----------|-------|
| T.1 | Añadir tests unitarios a hooks principales | `pending` | — | useCarrito, useProductos, useGestionProductos |
| T.2 | Añadir tests de integración a páginas críticas | `pending` | — | LoginPage, VentasPagina, GestionProductosPagina |
