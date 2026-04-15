import React from "react";
import defaultAvatar from "@/assets/default-avatar.png";
import BotonClaro from "@components/common/BotonClaro";
import Boton from "@components/common/Boton";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function TarjetaVendedor({ usuario, onAprobar, onDenegar }) {
  const fotoUrl = usuario.foto
    ? `${import.meta.env.VITE_API_URL}/imagenes/${usuario.foto}`
    : defaultAvatar;

  return (
    <li className="flex items-center justify-between bg-zinc-800/60 backdrop-blur-sm rounded-xl px-3 py-4 space-x-4 border border-white/5">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <img
          src={fotoUrl}
          alt={usuario.nombre}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-orange-500/50 shrink-0"
          onError={(e) => (e.currentTarget.src = defaultAvatar)}
        />
        <div className="flex flex-col min-w-0">
          <span className="text-white font-medium text-sm truncate">{usuario.nombre}</span>
          <span className="text-gray-400 text-[10px] sm:text-xs truncate">{usuario.email}</span>
          <span className="text-zinc-500 text-[10px] italic">
             {formatDistanceToNow(new Date(usuario.createdAt), { addSuffix: true, locale: es })}
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <BotonClaro onClick={() => onAprobar(usuario)} className="text-[10px] py-1 px-2 uppercase">Aprobar</BotonClaro>
        <Boton onClick={() => onDenegar(usuario)} className="text-[10px] py-1 px-2 uppercase bg-rose-600 border-none hover:bg-rose-500">Eliminar</Boton>
      </div>
    </li>
  );
}