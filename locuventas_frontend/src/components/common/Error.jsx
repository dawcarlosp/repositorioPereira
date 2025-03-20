function Error({ children, className = "", onClick }) {
    if (!children) return null; // No renderiza nada si no hay error
  
    return (
      <span
        className={`text-orange-500 text-sm mt-1 block animate-fadeIn ${className}`}
        onClick={onClick}
      >
        {children}
      </span>
    );
  }
  
  export default Error;
  