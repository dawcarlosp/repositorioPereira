# Session State

> ⚠️ **LEER PRIMERO.** Este archivo es la fuente única de verdad del estado actual.
> Contiene dónde estamos, qué se hizo y qué toca ahora.
> La IA debe leerlo al inicio de cada sesión y actualizarlo al final.

---

## Estado actual

| Campo | Valor |
|-------|-------|
| **Iteración** | 2 |
| **Rama activa** | `docs/infinite-loop` |
| **Último commit** | `9331970` — feat: implementa usePaginatedFetch<T> hook genérico y completa Fase 3 |
| **Branch base** | `develop` |
| **Estado del build** | 🟢 Build exitoso |
| **PR abierto** | `docs/infinite-loop` → `develop` |

---

## Qué se hizo en la iteración anterior

**Iteración 2 — Bugs y mejoras**

- [x] B.1: Eliminar `AlertSimple` (redundante con `ModalConfirmacion`)
- [x] B.2: Eliminar `breakpoint` duplicado de `useHeaderManager` (usaba su propio `getBreakpoint` en vez de `useBreakpoint`)
- [x] Eliminar `AlertSimple.tsx` y actualizar `FormVendedorLogin.tsx` para usar `ModalConfirmacion`
- [x] Simplificar `ModalConfirmacion`: el botón cancelar es opcional (modo single-button)
- [x] Build verificado: `npm run build` exitoso

---

## Siguientes tareas

1. **Fase 4 — Integración Gemini AI** (ver `TASKS.md`)
2. **Bugs y mejoras**: B.3 `ComponentType<any>` en `PANEL_MAP`, B.4 Unificar skeletons
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
