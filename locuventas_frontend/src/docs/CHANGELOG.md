# Changelog

> Registro cronológico de cambios por iteración.
> Cada entrada corresponde a una iteración del bucle de desarrollo IA.
> Formato: `#{iteración} — {rama} — {fecha}`

---

## #1 — `docs/infinite-loop`

**Objetivo:** Fase 3 — Refactor arquitectura (usePaginatedFetch, mover componentes).

### Cambios realizados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/hooks/usePaginatedFetch.ts` | ✨ Creación | Hook genérico de fetch paginado con AbortController y refresh. Extrae el patrón repetido de useProductos, useVentasManager, useVendedoresPendientes |
| `src/features/productos/hooks/useProductos.ts` | ♻️ Refactor | Simplificado: ahora usa `usePaginatedFetch` + `useMemo` para la URL. Misma interfaz externa |
| `src/features/ventas/hooks/useVentasManager.ts` | ♻️ Refactor | Simplificado: reemplaza `fetchVentas` manual por `usePaginatedFetch`. Usa `refresh()` tras pago/cancelación |
| `src/hooks/useVendedoresPendientes.ts` | ♻️ Refactor | Simplificado: ahora usa `usePaginatedFetch`. Eliminado `useEffect` redundante. Misma interfaz externa |
| `src/app/PrivateRoute.tsx` | ✨ Movido | Desde `components/common/PrivateRoute.tsx`. Import actualizado en `routes.tsx` |
| `src/components/common/FooterLogin.tsx` | ✨ Movido | Desde `components/FooterLogin.tsx`. Imports actualizados en `LoginPage.tsx` y `SobreMiPage.tsx` |
| `src/components/common/PrivateRoute.tsx` | 🗑️ Eliminado | Reemplazado por `src/app/PrivateRoute.tsx` |
| `src/components/FooterLogin.tsx` | 🗑️ Eliminado | Reemplazado por `src/components/common/FooterLogin.tsx` |
| `src/docs/SESSION.md` | ♻️ Actualizado | Iteración 1: trabajos completados, estado actual |
| `src/docs/CHANGELOG.md` | ♻️ Actualizado | Esta entrada |
| `src/docs/TASKS.md` | ♻️ Actualizado | Tareas 3.1-3.6 marcadas como done |
| `src/docs/ARCHITECTURE.md` | ♻️ Actualizado | Nuevas ubicaciones de PrivateRoute y FooterLogin |

### Commits

```
feat: implementa usePaginatedFetch<T> hook genérico
refactor: simplifica useProductos, useVentasManager, useVendedoresPendientes con usePaginatedFetch
refactor: mueve PrivateRoute a app/ y FooterLogin a components/common/
docs: actualiza SESSION, CHANGELOG, TASKS, ARCHITECTURE
```

### Notas

- `usePaginatedFetch` expone `refresh()` para recarga manual tras mutaciones
- Las interfaces externas de los 3 hooks refactorizados no cambiaron
- `extractData` se pasa como callback para manejar diferentes formas de respuesta (`ApiResponse<PageDTO<T>>` vs `VentaPageDTO`)
- Build verificado con `npm run build` (0 errores, 0 warnings)
