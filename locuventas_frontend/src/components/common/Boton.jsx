
function Boton({ children, disabled, onClick }) {
  return (
    <button
      className={`w-full p-2 rounded-xl bg-purple-500 text-white hover:bg-orange-400 hover:scale-105 cursor-pointer m-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Boton;
