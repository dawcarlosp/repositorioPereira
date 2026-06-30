# Known Issues

> Bugs activos, deuda técnica, warnings y cosas pendientes.
> Revisar antes de empezar a trabajar para no ignorar problemas existentes.

---

## Deuda técnica

| # | Issue | Prioridad | Iteración | Notas |
|---|-------|-----------|-----------|-------|
| 1 | `ComponentType<any>` en `PANEL_MAP` de `RecursiveMenu` | `baja` | — | No se encontró alternativa limpia; los componentes del mapa tienen firmas de props distintas |
| 2 | Skeletons no unificados | `baja` | — | `SkeletonProductoCard`, `SkeletonTarjetaVendedor`, `SkeletonVentaCard` son casi idénticos. Pendiente unificar en un solo `Skeleton` con `variant` |

---

## Errores de tipo (TypeScript)

| # | Issue | Archivo | Estado | Notas |
|---|-------|---------|--------|-------|
| 1 | `ComponentType<any>` en `PANEL_MAP` | `RecursiveMenu.tsx` | `aceptado` | Documentado en DONT_DO.md como caso especial pendiente de resolver |
