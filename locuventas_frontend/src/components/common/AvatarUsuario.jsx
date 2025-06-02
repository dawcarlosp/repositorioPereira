import { useState } from "react";
import defaultAvatar from "../../assets/default-avatar.png"; // Asegúrate de tener una imagen por defecto

export default function AvatarUsuario({ foto, nombre }) {
  const [imgError, setImgError] = useState(false);

  // Si tu backend tiene un dominio/base, usa VITE_API_URL:
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const url = `${baseUrl}/imagenes/vendedores/${foto}`;

  return (
    <div className="flex items-center gap-3">
      <img
        src={imgError || !foto ? defaultAvatar : url}
        alt={`Foto de ${nombre || "usuario"}`}
        onError={() => setImgError(true)}
        className="w-15 h-15 rounded-full border-2 border-white shadow-md object-cover"
      />
      {nombre && (
        <span className="hidden md:inline text-white font-semibold">{nombre}</span>
      )}
    </div>
  );
}
