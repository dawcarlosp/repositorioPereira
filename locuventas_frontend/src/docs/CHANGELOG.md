# Changelog

> Registro cronológico de cambios por iteración.
> Cada entrada corresponde a una iteración del bucle de desarrollo IA.
> Formato: `#{iteración} — {rama} — {fecha}`

---

## #0 — `docs/infinite-loop`

**Objetivo:** Implementar el sistema de documentación para bucle infinito de IA.

### Cambios realizados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/docs/SESSION.md` | ✨ Creación | Handoff entre sesiones de IA: iteración, branch, último commit, qué se hizo, qué sigue |
| `src/docs/CHANGELOG.md` | ✨ Creación | Este archivo. Registro cronológico de cambios por iteración |
| `src/docs/TASKS.md` | ✨ Creación | Cola de tareas priorizada con estado: pending / in_progress / done / cancelled |
| `src/docs/DECISIONS.md` | ✨ Creación | Registro de Decisiones de Arquitectura (ADR) |
| `src/docs/KNOWN_ISSUES.md` | ✨ Creación | Bugs, deuda técnica y errores conocidos |
| `CLAUDE.md` | ♻️ Reestructuración | Separado contenido estático del dinámico. Eliminadas secciones "Última sesión" y "Roadmap" (migradas a SESSION.md + TASKS.md + CHANGELOG.md). Añadidas instrucciones del bucle y referencias a los nuevos docs |

### Commits

```
docs: implementa sistema de documentación para bucle infinito de IA
```

### Notas

- El contenido de "Última sesión (29 Jun 2026)" de `CLAUDE.md` se migró a `CHANGELOG.md` como contexto histórico (entradas #-2 a #-5)
- El roadmap de fases se migró a `TASKS.md`
- Las decisiones de diseño se migraron a `DECISIONS.md`
