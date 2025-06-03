function BotonClaro({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-zinc-700 text-white text-sm font-semibold 
        hover:bg-zinc-600 transition px-3 py-1.5 rounded-lg cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default BotonClaro;
