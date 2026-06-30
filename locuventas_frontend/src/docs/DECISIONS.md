# Architecture Decision Records

> Registro de decisiones importantes de arquitectura y diseño.
> Cada entrada documenta: contexto, opciones consideradas, decisión y consecuencia.
> La IA debe consultar este archivo antes de proponer cambios arquitectónicos.

---

## ADR-001: Feature-based structure

**Fecha:** Mayo 2026

**Contexto:** El código estaba organizado por tipo técnico (components/, pages/, hooks/)
mezclando dominios de negocio distintos en las mismas carpetas.

**Opciones consideradas:**
- Feature-based (`features/{domain}/{components,domain,hooks,pages}/`)
- Layer-based (mantener estructura plana actual)
- Module-based (módulos NPM internos)

**Decisión:** Feature-based.

**Consecuencia:** Cada dominio es autocontenido. Para añadir una nueva feature
solo se crea una carpeta en `features/`. Los componentes compartidos siguen en
`components/common/`.

---

## ADR-002: TypeScript sobre JavaScript

**Fecha:** Mayo 2026

**Contexto:** El proyecto original estaba en JavaScript. Se decidió migrar a
TypeScript para mejorar la mantenibilidad y la DX.

**Reglas aplicadas:**
- Cero tolerancia a `any` — usar `unknown` con cast explícito
- Tipos nuevos siempre en `features/*/domain/` o `src/domain/` — nunca inline
- `Record<string, unknown>` para datos crudos de la API antes de mapear

**Consecuencia:** 0 archivos `.jsx`/`.js` en `src/`. Todos los hooks tienen
tipos de retorno explícitos.

---

## ADR-003: Español en archivos existentes, inglés en archivos nuevos

**Fecha:** Mayo 2026

**Contexto:** El proyecto tenía nombres de componentes, archivos y variables en
español. Se consideró un renombrado masivo a inglés.

**Opciones consideradas:**
- Renombrar todo a inglés (rompe historial de Git y todos los imports)
- Mantener español en todo
- Mantener español en existente, usar inglés en nuevo

**Decisión:** Mantener español en archivos existentes. Usar inglés solo en
archivos nuevos de fases posteriores.

**Consecuencia:** Conviven ambos idiomas en el código. El historial de Git se
mantiene intacto. No hay necesidad de migrar imports.

---

## ADR-004: Context API sobre Zustand/Redux

**Fecha:** Mayo 2026

**Contexto:** Se evaluó migrar el estado global a una solución más potente.

**Opciones consideradas:**
- Redux (excesivo para la escala actual)
- Zustand (ligero, pero overhead innecesario)
- Context API (ya implementado, suficiente)

**Decisión:** Mantener Context API. Si en el futuro el estado global crece
significativamente, Zustand sería la opción — pero no antes de que haya un
problema real de rendimiento o complejidad.

**Consecuencia:** `AuthContext` y `HeaderContext` siguen con Context API.
No hay dependencias externas de estado global.

---

## ADR-005: SelectForm y SelectFilter no unificados

**Fecha:** Junio 2026

**Contexto:** `SelectFieldset` (formulario) y `SelectFiltro` (filtro/búsqueda)
tenían lógica superpuesta pero props muy divergentes.

**Opciones consideradas:**
- Unificar en un solo componente con muchas props condicionales
- Extraer lógica compartida en `SelectBase` y mantener dos componentes separados

**Decisión:** Extraer lógica compartida en `SelectBase`. Mantener `SelectForm`
y `SelectFilter` como componentes separados. Renombrar para claridad.

**Consecuencia:** `SelectBase` contiene la lógica común (estilo, layout, label,
error). `SelectForm` añade `required`, validación. `SelectFilter` añade
`multiple`, búsqueda, limpiar.

---

## ADR-006: Button unificado con variant

**Fecha:** Junio 2026

**Contexto:** Existían 4 componentes de botón distintos: `Boton`, `BotonClaro`,
`BotonCerrar`, `Enlace`. Mantenimiento redundante.

**Decisión:** Unificar en `Button` con prop `variant`:
- `primary` — botón principal (reemplaza `Boton`)
- `secondary` — botón secundario (reemplaza `BotonClaro`)
- `link` — texto sin fondo (reemplaza `Enlace`)
- `close` — icono X (reemplaza `BotonCerrar`)

**Consecuencia:** Un solo componente de botón. 22 archivos actualizados.
Build verificado.

---

## ADR-007: ImageUpload unificado con shape

**Fecha:** Junio 2026

**Contexto:** `UploadComponent` (para productos,方形) y `UploadAvatar` (circular)
eran casi idénticos.

**Decisión:** Unificar en `ImageUpload` con prop `shape="square" | "circle"`.

**Consecuencia:** Archivos eliminados: `UploadComponent.tsx`, `UploadAvatar.tsx`.
3 imports actualizados.

---

## ADR-008: Sistema de documentación para bucle infinito de IA

**Fecha:** Junio 2026

**Contexto:** El contexto limitado de las IAs hace que cada nueva sesión pierda
el estado anterior, llevando a alucinaciones, decisiones contradictorias y
pérdida de tiempo.

**Opciones consideradas:**
- Confiar solo en el historial de Git (no captura decisiones, tareas ni estado)
- Usar un solo archivo monolítico (se vuelve inmanejable)
- Sistema de archivos MD especializados con responsabilidades separadas

**Decisión:** Crear un sistema de 5 archivos MD con responsabilidades separadas:
- `SESSION.md` — handoff entre sesiones (qué hacer ahora)
- `CHANGELOG.md` — registro histórico (qué se ha hecho)
- `TASKS.md` — cola de tareas (qué toca hacer)
- `DECISIONS.md` — ADR (por qué se hizo así)
- `KNOWN_ISSUES.md` — bugs activos (qué está roto)

Regla fundamental: **Actualizar `SESSION.md` al final de cada sesión.**
La próxima IA lo lee primero.

**Consecuencia:** Cada sesión de IA empieza con contexto completo del estado
actual. Se eliminan las alucinaciones sobre el estado del proyecto.
