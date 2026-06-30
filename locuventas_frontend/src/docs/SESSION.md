# Session State

> ⚠️ **LEER PRIMERO.** Este archivo es la fuente única de verdad del estado actual.
> Contiene dónde estamos, qué se hizo y qué toca ahora.
> La IA debe leerlo al inicio de cada sesión y actualizarlo al final.

---

## Estado actual

| Campo | Valor |
|-------|-------|
| **Iteración** | 0 |
| **Rama activa** | `docs/infinite-loop` |
| **Último commit** | `7f66da0` — Merge pull request #47 |
| **Branch base** | `develop` |
| **Estado del build** | 🟢 Pendiente de verificar |
| **PR abierto** | Ninguno |

---

## Qué se hizo en la iteración anterior

Esta es la **iteración 0** — se creó el sistema de documentación para el bucle infinito:

- [x] Crear `SESSION.md` — handoff entre sesiones de IA
- [x] Crear `CHANGELOG.md` — registro cronológico de cambios
- [x] Crear `TASKS.md` — cola de tareas priorizada
- [x] Crear `DECISIONS.md` — registro de decisiones de arquitectura
- [x] Crear `KNOWN_ISSUES.md` — bugs y deuda técnica conocidos
- [x] Reestructurar `CLAUDE.md` — separar contenido estático del dinámico
- [ ] Verificar `npm run build` tras los cambios
- [ ] Push y PR a `develop`

---

## Siguiente tarea

**Fase 3 — Refactor arquitectura** (ver `TASKS.md` para detalles):
1. Crear `usePaginatedFetch<T>` genérico
2. Mover `PrivateRoute` → `app/`
3. Mover `FooterLogin` → `common/`

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
