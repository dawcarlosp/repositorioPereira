# Design Patterns

> Catálogo de patrones aplicados en el frontend de LocuVentas con ejemplos
> reales del código. Cada patrón incluye el problema que resuelve, dónde
> está implementado y cuándo añadir uno nuevo.

---

## Índice

1. [Provider Pattern](#1-provider-pattern)
2. [Custom Hook Pattern](#2-custom-hook-pattern)
3. [Container / Presentational Pattern](#3-container--presentational-pattern)
4. [Compound Component Pattern](#4-compound-component-pattern)
5. [Recursive Render Pattern](#5-recursive-render-pattern)
6. [Config-Driven UI Pattern](#6-config-driven-ui-pattern)
7. [Guard Pattern](#7-guard-pattern)
8. [Skeleton Loading Pattern](#8-skeleton-loading-pattern)
9. [Optimistic UI Pattern](#9-optimistic-ui-pattern)
10. [Controlled / Uncontrolled Pattern](#10-controlled--uncontrolled-pattern)
11. [Abort Controller Pattern](#11-abort-controller-pattern)
12. [Debounce Pattern](#12-debounce-pattern)

---

## 1. Provider Pattern

### Problema que resuelve
Evitar **prop drilling** — pasar props a través de múltiples niveles de
componentes que no las necesitan para llegar al que sí las necesita.

### Dónde está implementado
```
src/app/providers.tsx
src/context/AuthContext.tsx
src/context/HeaderContext.tsx
```

### Cómo funciona

```tsx
// providers.tsx — composición de providers en árbol
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HeaderProvider>{children}</HeaderProvider>
    </AuthProvider>
  );
}
```

Cualquier componente de la app puede consumir el contexto sin que sus
padres intermedios sepan nada:

```tsx
// Un componente cualquiera en cualquier nivel del árbol
const { auth } = useAuth();
const { menuOpen } = useHeader();
```

### Cuándo añadir uno nuevo
Cuando un estado necesita ser accesible desde múltiples partes de la app
sin relación directa entre ellas. Ejemplos futuros:

```tsx
// Si se añade un carrito persistente o notificaciones globales
<CartProvider>
  <NotificationsProvider>
    {children}
  </NotificationsProvider>
</CartProvider>
```

> ⚠️ No crear un provider por cada estado pequeño. Si el estado solo
> afecta a un árbol de componentes local, usa `useState` en el padre común.

---

## 2. Custom Hook Pattern

### Problema que resuelve
Separar la lógica de negocio de la presentación. Los componentes solo
renderizan — los hooks gestionan datos, efectos y acciones.

### Dónde está implementado
```
src/features/ventas/hooks/useVentasManager.ts
src/features/productos/hooks/useGestionProductos.ts
src/features/ventas/hooks/useCarrito.ts
src/features/productos/hooks/useProductos.ts
src/hooks/useVendedoresPendientes.ts
src/hooks/useHeaderManager.ts
```

### Cómo funciona

```tsx
// ❌ Sin el patrón — lógica mezclada con presentación
export default function VentasPagina() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/ventas").then(r => r.json()).then(setVentas);
  }, []);

  return <TablaVentas ventas={ventas} loading={loading} />;
}

// ✅ Con el patrón — página limpia, lógica en el hook
export default function VentasPagina() {
  const { ventas, loading, page, totalPages, setPage } = useVentasManager();

  return <ContenedorVentas ventas={ventas} loading={loading} page={page} ... />;
}
```

### Anatomía de un hook del proyecto

```ts
// Patrón que siguen todos los hooks de fetch
export default function useRecurso({ page, size, search } = {}) {
  const [datos,      setDatos]      = useState<Recurso[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const cargar = async () => {
      setLoading(true);
      try {
        const res = await apiRequest<ApiResponse<PageDTO<Recurso>>>(
          `recurso?page=${page}&size=${size}`,
          null,
          { method: "GET", signal: controller.signal }
        );
        setDatos(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        if (err?.name !== "AbortError") toast.error("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    cargar();
    return () => controller.abort();
  }, [page, size, search]);

  return { datos, loading, totalPages };
}
```

### Cuándo añadir un nuevo hook
- Cuando un componente tiene más de 2-3 `useState` relacionados
- Cuando la misma lógica se necesita en más de un componente
- Cuando hay efectos secundarios (fetch, localStorage, eventos)

---

## 3. Container / Presentational Pattern

### Problema que resuelve
Separar **qué datos mostrar** (container) de **cómo mostrarlos**
(presentational). Permite cambiar la presentación sin tocar la lógica.

### Dónde está implementado
```
src/features/ventas/components/ContenedorVentas.tsx   ← container
src/features/ventas/components/TablaVentas.tsx         ← presentational (desktop)
src/features/ventas/components/VentaCard.tsx           ← presentational (móvil)
```

### Cómo funciona

```tsx
// ContenedorVentas — decide QUÉ renderizar según el contexto
export default function ContenedorVentas({ ventas, loading, ...props }) {
  const { isSmall } = useResponsiveLayout();

  const paginacion = !loading && totalPages > 1 && (
    <Paginacion page={page} totalPages={totalPages} ... />
  );

  if (isSmall) {
    return (
      <div>
        {loading
          ? <SkeletonCards />
          : ventas.map(v => <VentaCard key={v.id} venta={v} ... />)
        }
        {paginacion}
      </div>
    );
  }

  return (
    <div>
      <TablaVentas ventas={ventas} loading={loading} ... />
      {paginacion}
    </div>
  );
}
```

```tsx
// TablaVentas — solo sabe renderizar una tabla, no decide cuándo usarse
export default function TablaVentas({ ventas, loading, onVerDetalle, ... }) {
  return (
    <DataTable columnas={columnas} loading={loading}>
      {ventas.map(v => <tr key={v.id}>...</tr>)}
    </DataTable>
  );
}
```

### Cuándo aplicarlo
Cuando un mismo conjunto de datos necesita presentaciones distintas según:
- Breakpoint (desktop vs móvil)
- Rol del usuario (admin vs vendedor)
- Contexto (modal vs página completa)

---

## 4. Compound Component Pattern

### Problema que resuelve
Componer interfaces complejas manteniendo flexibilidad en la estructura
interna sin exponer demasiadas props al padre.

### Dónde está implementado
```
src/components/common/DropdownContainer.tsx
```

### Cómo funciona

```tsx
// DropdownContainer — gestiona posicionamiento, flecha y animación
// El padre solo pasa el trigger y el contenido
<DropdownContainer
  isOpen={isOpen}
  triggerRef={btnRef}
  side="right"
  width="w-56"
>
  <MenuItems />   {/* el padre decide qué va dentro */}
</DropdownContainer>
```

### Cuándo aplicarlo
Cuando un componente necesita gestionar comportamiento complejo
(posicionamiento, animaciones, accesibilidad) pero el contenido
interno debe ser flexible.

---

## 5. Recursive Render Pattern

### Problema que resuelve
Renderizar estructuras de árbol de profundidad arbitraria sin duplicar
código para cada nivel.

### Dónde está implementado
```
src/components/common/RecursiveMenu.tsx
```

### Cómo funciona

```tsx
// RecursiveMenu se llama a sí mismo para renderizar subniveles
export default function RecursiveMenu({ items, depth = 0, ... }) {
  return (
    <div>
      {items.map((item) => {
        if (!item.children) {
          return <BotonClaro onClick={item.action}>{item.label}</BotonClaro>;
        }

        return (
          <Fragment key={item.label}>
            <BotonClaro onClick={() => toggle(i)}>{item.label}</BotonClaro>

            <DropdownContainer isOpen={isOpen} side="right">
              {/* Llamada recursiva con depth + 1 */}
              <RecursiveMenu
                items={item.children}
                depth={depth + 1}
                onClose={onClose}
              />
            </DropdownContainer>
          </Fragment>
        );
      })}
    </div>
  );
}
```

### Cuándo aplicarlo
- Menús anidados de profundidad variable
- Árboles de categorías
- Comentarios anidados
- Cualquier estructura jerárquica donde el número de niveles no es fijo

---

## 6. Config-Driven UI Pattern

### Problema que resuelve
Separar **qué muestra la UI** (datos) de **cómo lo muestra** (componentes).
Añadir o modificar opciones del menú no requiere tocar ningún componente.

### Dónde está implementado
```
src/layout/Header/config/adminMenuConfig.ts   ← datos
src/layout/Header/config/userMenuConfig.ts    ← datos
src/components/common/RecursiveMenu.tsx       ← renderer genérico
src/layout/Header/components/AdminMenu.tsx    ← punto de entrada
```

### Cómo funciona

```ts
// adminMenuConfig.ts — solo datos, sin JSX
export const adminMenuConfig = (navigate, h) => [
  {
    label:  "Catálogo",
    action: () => navigate("/productos/gestion"),
  },
  {
    label: "Personal",
    children: [
      {
        label:      "Solicitudes nuevas",
        action:     () => navigate("/vendedores/pendientes"), // móvil
        panel:      "PendientesList",                         // desktop
        panelWidth: "w-[380px]",
        panelProps: { onConfirmacion: h.abrirConfirmacionGlobal },
      },
      {
        label:  "Lista de personal",
        action: () => navigate("/vendedores/lista"),
      },
    ],
  },
];
```

```tsx
// AdminMenu.tsx — no sabe nada de las opciones concretas
export default function AdminMenu({ h, showTitle = false }) {
  const items = adminMenuConfig(navigate, h);
  return <RecursiveMenu items={items} onClose={h.closeAll} />;
}
```

### Añadir una nueva opción al menú

Solo hay que tocar `adminMenuConfig.ts`:

```ts
// Añadir "Reportes" sin tocar ningún componente
{
  label:  "Reportes",
  action: () => navigate("/reportes"),
}
```

### Cuándo aplicarlo
- Menús y navegación
- Tablas con columnas configurables
- Formularios generados dinámicamente
- Dashboards con widgets configurables

---

## 7. Guard Pattern

### Problema que resuelve
Proteger rutas y recursos según el estado de autenticación y los roles
del usuario, de forma declarativa en la definición de rutas.

### Dónde está implementado
```
src/components/common/PrivateRoute.tsx
src/app/routes.tsx
```

### Cómo funciona

```tsx
// routes.tsx — las rutas protegidas se declaran con PrivateRoute
<Route
  path="/productos/gestion"
  element={
    <PrivateRoute>
      <GestionProductosPagina />
    </PrivateRoute>
  }
/>
```

```tsx
// PrivateRoute — redirige si no hay sesión
export default function PrivateRoute({ children }) {
  const { auth } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### Extensión para roles específicos

```tsx
// Si en el futuro se necesita proteger por rol
<PrivateRoute requiredRole="ROLE_ADMIN">
  <GestionProductosPagina />
</PrivateRoute>
```

```tsx
export default function PrivateRoute({ children, requiredRole }) {
  const { auth } = useAuth();

  if (!auth.token) return <Navigate to="/login" replace />;

  if (requiredRole && !auth.roles.includes(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
```

---

## 8. Skeleton Loading Pattern

### Problema que resuelve
Eliminar el parpadeo visual durante la carga mostrando una silueta
del contenido que va a aparecer, en lugar de un spinner o texto.

### Dónde está implementado
```
src/components/common/SkeletonProductoCard.tsx
src/components/common/SkeletonTarjetaVendedor.tsx
src/features/ventas/components/ContenedorVentas.tsx   (SkeletonVentaCard inline)
```

### Cómo funciona

Cada skeleton replica la **forma exacta** del componente real usando
`animate-pulse` de Tailwind y bloques `bg-zinc-700/50`:

```tsx
// SkeletonTarjetaVendedor — replica TarjetaVendedor
export default function SkeletonTarjetaVendedor() {
  return (
    <li className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-32 rounded-md bg-zinc-700" />
        <div className="h-2 w-48 rounded-md bg-zinc-700/70" />
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <div className="h-7 w-20 rounded-xl bg-zinc-700" />
        <div className="h-7 w-20 rounded-xl bg-zinc-700/70" />
      </div>
    </li>
  );
}
```

```tsx
// Uso en el componente padre
{loading
  ? Array.from({ length: size }).map((_, i) => (
      <SkeletonTarjetaVendedor key={i} />
    ))
  : pendientes.map(u => <TarjetaVendedor key={u.id} usuario={u} />)
}
```

### Regla de nomenclatura
```
Skeleton{NombreDelComponenteReal}
SkeletonProductoCard   → ProductoCard
SkeletonTarjetaVendedor → TarjetaVendedor
```

### Cuándo crear un nuevo skeleton
Siempre que haya un listado o grid que haga fetch. Si el componente
tiene altura fija conocida, el skeleton evita el layout shift (CLS).

---

## 9. Optimistic UI Pattern

### Problema que resuelve
Hacer la interfaz más rápida actualizando el estado local inmediatamente,
antes de que el servidor confirme la operación.

### Dónde está implementado (parcial)
```
src/hooks/useVendedoresPendientes.ts
```

### Estado actual vs optimista

```ts
// Estado actual — espera confirmación del servidor
const aprobar = async (id: number) => {
  await apiRequest(`usuarios/${id}/asignar-rol`, {}, { method: "PUT" });
  toast.success("Vendedor aprobado");
  await cargar(); // recarga desde el servidor
};

// Versión optimista — actualiza inmediatamente, revierte si falla
const aprobar = async (id: number) => {
  const prevPendientes = pendientes; // guardar estado anterior

  // Actualizar UI inmediatamente
  setPendientes(p => p.filter(u => u.id !== id));

  try {
    await apiRequest(`usuarios/${id}/asignar-rol`, {}, { method: "PUT" });
    toast.success("Vendedor aprobado");
  } catch (err) {
    // Revertir si falla
    setPendientes(prevPendientes);
    toast.error("Error al aprobar — operación revertida");
  }
};
```

### Cuándo aplicarlo
Operaciones que el usuario espera que sean rápidas: likes, favoritos,
eliminar items, marcar como leído. No aplicar en operaciones financieras
o donde la confirmación del servidor es crítica.

---

## 10. Controlled / Uncontrolled Pattern

### Problema que resuelve
Decidir quién gestiona el estado de un componente: el padre (controlled)
o el propio componente (uncontrolled). Permite que el mismo componente
sea flexible en distintos contextos.

### Dónde está implementado
```
src/features/auth/components/PendientesList.tsx
```

### Cómo funciona

`PendientesList` funciona en dos modos:

```tsx
// Modo uncontrolled — gestiona su propia paginación (usado en el dropdown)
<PendientesList onConfirmacion={h.abrirConfirmacionGlobal} />

// Modo controlled — el padre controla la paginación (usado en la página)
<PendientesList
  onConfirmacion={setConfirmacion}
  page={page}
  size={size}
  onPageChange={setPage}
  onSizeChange={setSize}
/>
```

```tsx
export default function PendientesList({
  onConfirmacion,
  page: externalPage,       // undefined en modo uncontrolled
  size: externalSize,
  onPageChange,
  onSizeChange,
}) {
  // Estado interno — solo activo en modo uncontrolled
  const [internalPage, setInternalPage] = useState(0);
  const [internalSize, setInternalSize] = useState(4);

  // Si el padre pasa props, se usan las del padre; si no, las internas
  const page = externalPage ?? internalPage;
  const size = externalSize ?? internalSize;
  const handlePageChange = onPageChange ?? setInternalPage;
  const handleSizeChange = onSizeChange ?? (
    (s) => { setInternalSize(s); setInternalPage(0); }
  );
  // ...
}
```

### Cuándo aplicarlo
Componentes reutilizables que en algunos contextos necesitan estado
propio (standalone) y en otros deben ser controlados desde fuera
(integración en páginas o flujos más complejos).

---

## 11. Abort Controller Pattern

### Problema que resuelve
Cancelar peticiones HTTP en vuelo cuando el componente se desmonta o
cuando el usuario cambia de página/filtro antes de que la petición
anterior complete, evitando memory leaks y actualizaciones de estado
en componentes desmontados.

### Dónde está implementado
```
src/features/productos/hooks/useProductos.ts
src/services/api.ts          (acepta signal en las opciones)
```

### Cómo funciona

```ts
// useProductos (features/productos/hooks/)
useEffect(() => {
  const controller = new AbortController();

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const datos = await apiRequest(
        `productos?page=${page}&size=${size}`,
        null,
        { method: "GET", signal: controller.signal }  // ← pasar signal
      );
      setProductos(datos.data?.content ?? []);
    } catch (err) {
      // Ignorar errores de abort — son esperados
      if (err?.name !== "AbortError") {
        toast.error("Error cargando productos");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProductos();

  // Cleanup: cancela la petición si page/size/search cambian
  // antes de que la petición anterior complete
  return () => controller.abort();
}, [page, size, search]);
```

### Cuándo aplicarlo
En todos los hooks de fetch. Es especialmente importante cuando los
parámetros (page, search, filtros) cambian rápidamente — por ejemplo,
al escribir en el buscador con debounce.

---

## 12. Debounce Pattern

### Problema que resuelve
Evitar llamadas excesivas a la API mientras el usuario escribe en un
campo de búsqueda, esperando a que deje de escribir antes de lanzar
la petición.

### Dónde está implementado
```
src/hooks/useBuscador.ts
src/components/common/BuscadorInput.tsx
```

### Cómo funciona

```ts
// useBuscador.ts
export default function useBuscador({ debounceMs = 400, onSearch } = {}) {
  const [query, setQuery] = useState("");
  const timerRef          = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string): void => {
    setQuery(value);          // actualiza la UI inmediatamente
    if (onSearch) {
      if (timerRef.current) clearTimeout(timerRef.current);
      // espera debounceMs ms sin actividad antes de llamar onSearch
      timerRef.current = setTimeout(() => onSearch(value), debounceMs);
    }
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return { query, setQuery, inputRef, handleChange, handleClear };
}
```

```
Usuario escribe "arr"
  keystroke 'a' → timer inicia (400ms)
  keystroke 'r' → timer reinicia (400ms)
  keystroke 'r' → timer reinicia (400ms)
  ... 400ms sin teclas ...
  → onSearch("arr") se ejecuta → 1 sola petición
```

### Valores de debounce recomendados

| Caso de uso              | Debounce  |
|--------------------------|-----------|
| Búsqueda en lista local  | 0 ms      |
| Búsqueda con fetch API   | 300-400 ms|
| Autocompletado           | 200 ms    |
| Validación de formulario | 500 ms    |

### Cuándo aplicarlo
Cualquier input que dispara efectos secundarios costosos (fetch, validación
remota, cálculos pesados) en cada pulsación de tecla.

---

## Resumen

| Patrón                    | Problema principal          | Archivos clave                        |
|---------------------------|-----------------------------|---------------------------------------|
| Provider                  | Prop drilling               | `AuthContext`, `HeaderContext`         |
| Custom Hook               | Lógica en componentes       | `useVentasManager`, `useCarrito`       |
| Container / Presentational| Lógica mezclada con UI      | `ContenedorVentas`                    |
| Compound Component        | Props API rígida            | `DropdownContainer`                    |
| Recursive Render          | Árboles de profundidad variable | `RecursiveMenu`                   |
| Config-Driven UI          | Opciones hardcodeadas en JSX| `adminMenuConfig`, `RecursiveMenu`    |
| Guard                     | Rutas sin protección        | `PrivateRoute`, `routes.tsx`          |
| Skeleton Loading          | Flash de contenido vacío    | `Skeleton*` components                |
| Optimistic UI             | Latencia perceptible        | `useVendedoresPendientes`             |
| Controlled / Uncontrolled | Rigidez de componentes      | `PendientesList`                      |
| Abort Controller          | Memory leaks en fetch       | `useProductos`, `api.ts`              |
| Debounce                  | Exceso de peticiones        | `useBuscador`, `BuscadorInput`        |
