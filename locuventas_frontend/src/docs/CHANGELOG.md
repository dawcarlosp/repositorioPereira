# Changelog

> Registro cronológico de cambios por iteración.
> Cada entrada corresponde a una iteración del bucle de desarrollo IA.
> Formato: `#{iteración} — {rama} — {fecha}`

---

## #2 — `docs/infinite-loop`

**Objetivo:** Bugs y mejoras (AlertSimple, useHeaderManager).

### Cambios realizados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/components/common/ModalConfirmacion.tsx` | ♻️ Mejora | Botón cancelar opcional: si no se pasa `onCancelar`, renderiza un solo botón full-width |
| `src/components/common/AlertSimple.tsx` | 🗑️ Eliminado | Reemplazado por `ModalConfirmacion` con `confirmText="Entendido"` |
| `src/features/auth/components/Form/FormVendedorLogin.tsx` | ♻️ Refactor | Cambia `AlertSimple` por `ModalConfirmacion` |
| `src/hooks/useHeaderManager.ts` | ♻️ Refactor | Elimina `getBreakpoint()` duplicado, estado `breakpoint` y resize listener. Elimina `breakpoint` del return y de `UseHeaderManagerReturn`. Reduce 109 → 85 líneas |
| `src/docs/ARCHITECTURE.md` | ♻️ Actualizado | Elimina `AlertSimple` del árbol |
| `src/docs/CLAUDE.md` | ♻️ Actualizado | Elimina `AlertSimple` del árbol |
| `src/docs/SESSION.md` | ♻️ Actualizado | Iteración 2 |
| `src/docs/CHANGELOG.md` | ♻️ Actualizado | Esta entrada |
| `src/docs/TASKS.md` | ♻️ Actualizado | B.1 y B.2 marcadas como done |
| `src/docs/KNOWN_ISSUES.md` | ♻️ Actualizado | B.1 eliminada de issues |

### Commits

```
refactor: elimina AlertSimple (redundante con ModalConfirmacion)
refactor: elimina breakpoint duplicado de useHeaderManager
docs: actualiza SESSION, CHANGELOG, TASKS, ARCHITECTURE, CLAUDE, KNOWN_ISSUES
```

### Notas

- `AlertSimple` era un wrapper de `BaseModal` con un solo botón "Entendido". `ModalConfirmacion` ahora soporta ese mismo caso sin `onCancelar`
- `useHeaderManager` tenía su propia lógica de breakpoints (`getBreakpoint`) que duplicaba a `useBreakpoint`. Como ningún consumidor usaba `breakpoint` del hook, se eliminó por completo. Si en el futuro se necesita el breakpoint en el header, se usa `useBreakpoint()` directamente
