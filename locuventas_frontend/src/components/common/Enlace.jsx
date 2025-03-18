function Boton({ children, disabled, onClick }) {
    return (
      <button
        className={`text-blue-500 hover:scale-105 cursor-pointer font-bold ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  
  export default Boton;
  