# Session State

> ⚠️ **LEER PRIMERO.** Este archivo es la fuente única de verdad del estado actual.
> Contiene dónde estamos, qué se hizo y qué toca ahora.
> La IA debe leerlo al inicio de cada sesión y actualizarlo al final.

---

## Estado actual

| Campo | Valor |
|-------|-------|
| **Iteración** | 1 |
| **Rama activa** | `docs/infinite-loop` |
| **Último commit** | `8a8b7f6` — docs: implementa sistema de documentación para bucle infinito de IA |
| **Branch base** | `develop` |
| **Estado del build** | 🟢 Build exitoso |
| **PR abierto** | `docs/infinite-loop` → `develop` |

---

## Qué se hizo en la iteración anterior

**Iteración 1 — Fase 3: Refactor arquitectura**

- [x] Crear `usePaginatedFetch<T>` hook genérico en `src/hooks/usePaginatedFetch.ts`
- [x] Refactorizar `useProductos` para usar `usePaginatedFetch`
- [x] Refactorizar `useVentasManager` para usar `usePaginatedFetch`
- [x] Refactorizar `useVendedoresPendientes` para usar `usePaginatedFetch`
- [x] Mover `PrivateRoute` → `src/app/PrivateRoute.tsx` (actualizar import en `routes.tsx`)
- [x] Mover `FooterLogin` → `src/components/common/FooterLogin.tsx` (actualizar imports en `LoginPage.tsx`, `SobreMiPage.tsx`)
- [x] Build verificado: `npm run build` exitoso
- [x] Actualizar `ARCHITECTURE.md` con nuevas ubicaciones

---

## Siguientes tareas

1. **Fase 4 — Integración Gemini AI** (ver `TASKS.md`)
2. **Bugs y mejoras**: B.1 Eliminar `AlertSimple`, B.2 Refactor `useHeaderManager`, B.4 Unificar skeletons
3. **Tests**: T.1 Tests unitarios a hooks, T.2 Tests de integración

---

## Bloqueadores

- Ninguno

---

## Notas para la próxima IA

- Leer `CLAUDE.md` para convenciones, stack, comandos
- Leer `ARCHITECTURE.md` para entender la estructura
- Leer `PATTERNS.md` para conocer los patrones del proyecto
- Leer `DONT_DO.md` para evitar errores ya corregidos
- Leer `DECISIONS.md` para no re-debatir decisiones tomadas
- **Nunca usar `any`** — usar `unknown` con cast explícito
- **No renombrar español → inglés** en archivos existentes (solo en nuevos)
- **Branch desde `develop`**, PR a `develop`, merge a `master` solo en hitos
- Actualizar `SESSION.md` al final de cada sesión
