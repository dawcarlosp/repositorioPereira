// src/components/productos/FabAgregarProducto.jsx
export default function FabAgregarProducto({ onClick, title = "Agregar producto" }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 22,
        right: 22,
        zIndex: 10000000,
        background: "#FF7F50",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        width: 62,
        height: 62,
        fontSize: 42,
        fontWeight: "bold",
        boxShadow: "0 6px 24px #0006",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
        transition: "background .2s",
      }}
      title={title}
      aria-label={title}
    >
      +
    </button>
  );
}
