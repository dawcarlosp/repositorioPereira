# Lo que NO hay que hacer

Catálogo de patrones deprecados y malas prácticas detectadas y corregidas en el
proyecto.

---

## React 19

### `FormEvent` en onSubmit de formularios

`FormEvent` está deprecado en React 19 para el evento `onSubmit` de formularios.
El tipo correcto es `React.SubmitEvent` (o importado desde `"react"`).

```tsx
// ❌ MAL — FormEvent está deprecado en React 19 para onSubmit
import type { FormEvent } from "react";
<form onSubmit={(e: React.FormEvent) => { ... }}>
onSubmit: (e: FormEvent) => void;

// ✅ BIEN — SubmitEvent de React
import type { SubmitEvent } from "react";
<form onSubmit={(e: React.SubmitEvent) => { ... }}>
onSubmit: (e: SubmitEvent) => void;
// o con generic explícito:
onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
```

> ⚠️ No confundir con el tipo nativo DOM `SubmitEvent` (sin import). Ese es
> otro tipo incompatible. Siempre importar desde `"react"`.

**Archivos corregidos:**
- `src/components/common/FormDialog.tsx`
- `src/features/productos/components/ModalProductoForm.tsx`
- `src/features/productos/hooks/useGestionProductos.ts`

---

## TypeScript

### `any` en catch

```tsx
// ❌ MAL
catch (err: any) {
  toast.error(err?.error);
}
```

```tsx
// ✅ BIEN — usar unknown y castear explícitamente
catch (err: unknown) {
  const e = err as Record<string, string | undefined>;
  toast.error(e?.error ?? "Error");
}
```

**Archivos corregidos:**
- `src/features/productos/hooks/useGestionProductos.ts`

---

### `any` en estado o parámetros

```tsx
// ❌ MAL
const [editando, setEditando] = useState<any | null>(null);
const abrirEditar = (prod: any, ...) => { ... };
```

```tsx
// ✅ BIEN — importar y usar el tipo de dominio correspondiente
import type { Producto } from "@features/productos/domain/producto.types";
const [editando, setEditando] = useState<Producto | null>(null);
const abrirEditar = (prod: Producto, ...) => { ... };
```

**Archivos corregidos:**
- `src/features/productos/hooks/useGestionProductos.ts`

---

### `React.ComponentType<any>` en mapas dinámicos

No se encontró una alternativa limpia — el `any` sigue siendo necesario mientras
los componentes del mapa tengan firmas de props distintas. Pendiente de resolver
en un refactor futuro.

```tsx
// ⚠️ CASO ESPECIAL — workaround documentado
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PANEL_MAP: Record<string, React.ComponentType<any>> = { PendientesList };
```

**Archivo:**
- `src/components/common/RecursiveMenu.tsx`

---

## Recordatorio general

| Patrón | Estado |
|--------|--------|
| `FormEvent` → `React.SubmitEvent` | ✅ Corregido |
| `catch (err: any)` → `unknown` + cast | ✅ Corregido |
| `useState<any>` → tipo concreto (`Producto`) | ✅ Corregido |
| `ComponentType<any>` en `PANEL_MAP` | ⏳ Pendiente |
