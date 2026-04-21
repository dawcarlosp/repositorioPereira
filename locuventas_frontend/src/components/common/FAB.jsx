import Boton from "@components/common/Boton";
// src/components/common/FAB.jsx
export default function FAB({ 
  icon, 
  label = null, // Nueva prop para el texto largo (precio)
  onClick, 
  index = 0, 
  variant = "!bg-zinc-900",
}) {
  const bottomOffset = 1.5 + (index * 4.75);

  return (
    <div 
      className="fixed right-6 z-[9999] animate-in fade-in zoom-in duration-300"
      style={{ bottom: `${bottomOffset}rem` }}
    >
      <Boton
        onClick={onClick}
        className={`
          ${variant} 
          !h-16 !rounded-full !px-4 /* !px-4 permite que se estire */
          min-w-[64px] /* Mantiene forma circular si no hay label */
          flex items-center justify-center gap-2
          shadow-2xl border border-white/10
        `}
      >
        <span className="text-xl text-white">
          {icon}
        </span>

        {/* Si hay precio/label, lo mostramos al lado del icono */}
        {label && (
          <span className="text-lg font-black text-white whitespace-nowrap pr-2">
            {label}
          </span>
        )}
      </Boton>
    </div>
  );
}