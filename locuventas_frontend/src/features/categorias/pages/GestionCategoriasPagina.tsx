import AppLayout from "@layout/AppLayout";
import Main from "@layout/Main";
import GestionCategorias from "../components/GestionCategorias";

export default function GestionCategoriasPagina() {
  return (
    <AppLayout>
      <Main>
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Gestión de Categorías
          </h1>
          <p className="text-zinc-400 mt-1">
            Administra las categorías del catálogo de productos.
          </p>
        </header>
        <GestionCategorias />
      </Main>
    </AppLayout>
  );
}
