function Error({ children, className = "", onClick }) {
    if (!children) return null; // No renderiza nada si no hay error
  
    return (
      <span
        className={`text-orange-600 bg-white p-2 mb-2 rounded-xs text-sm mt-1 block animate-fadeIn ${className}`}
        onClick={onClick}
      >
        {children}
      </span>
    );
  }
  
  export default Error;
  