# Known Issues

> Bugs activos, deuda técnica, warnings y cosas pendientes.
> Revisar antes de empezar a trabajar para no ignorar problemas existentes.

---

## Deuda técnica

| # | Issue | Prioridad | Iteración | Notas |
|---|-------|-----------|-----------|-------|
| 1 | `AlertSimple` es redundante | `media` | — | Es `ModalConfirmacion` sin botón cancelar. Pendiente de eliminar y sustituir usos |
| 2 | `useHeaderManager` duplica lógica de `useBreakpoint` | `baja` | — | Tiene su propia lógica de breakpoints en lugar de reutilizar el hook existente |
| 3 | `ComponentType<any>` en `PANEL_MAP` de `RecursiveMenu` | `baja` | — | No se encontró alternativa limpia; los componentes del mapa tienen firmas de props distintas |
| 4 | Skeletons no unificados | `baja` | — | `SkeletonProductoCard`, `SkeletonTarjetaVendedor`, `SkeletonVentaCard` son casi idénticos. Pendiente unificar en un solo `Skeleton` con `variant` |

---

## Errores de tipo (TypeScript)

| # | Issue | Archivo | Estado | Notas |
|---|-------|---------|--------|-------|
| 1 | `ComponentType<any>` en `PANEL_MAP` | `RecursiveMenu.tsx` | `aceptado` | Documentado en DONT_DO.md como caso especial pendiente de resolver |

---

## Warnings de compilación

*(No se han detectado warnings en el último build exitoso)*

---

## Pendientes de migración

| # | Archivo | Acción | Notas |
|---|---------|--------|-------|
| 1 | `FooterLogin.tsx` | Mover a `components/common/` | Está suelto en `components/` raíz |
| 2 | `PrivateRoute.tsx` | Mover a `app/` | Está en `components/common/`, debe vivir en `app/` |
