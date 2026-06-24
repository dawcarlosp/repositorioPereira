// src/components/common/UploadComponent.tsx
import { useEffect, useRef, useState } from "react";
import avatarDefault from "@assets/plus.png";

interface UploadComponentProps {
  setFile:       (file: File) => void;
  file:          File | null;
  fotoActualUrl: string | null;
  disabled?:     boolean;
  className?:    string;
}

export default function UploadComponent({
  setFile,
  file,
  fotoActualUrl,
  disabled = false,
  className = "",
}: UploadComponentProps) {
  const inputRef     = useRef<HTMLInputElement>(null);
  const [justChanged, setJustChanged] = useState(false);

  // Derivar imgSrc en cada render — sin useState para evitar el bug
  // de imagen no actualizada al cambiar de producto en edición
  const imgSrc = (() => {
    if (file) return URL.createObjectURL(file);
    if (fotoActualUrl) return fotoActualUrl;
    return avatarDefault;
  })();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setJustChanged(true);
    setTimeout(() => setJustChanged(false), 500);
  };

  return (
    <div className={`flex flex-col items-center mb-4 ${className}`}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          w-28 h-28 rounded-xl border-4 border-purple-400
          flex items-center justify-center relative overflow-hidden
          shadow-lg transition-transform duration-500
          ${disabled  ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
          ${justChanged ? "ring-4 ring-purple-500 scale-110" : ""}
        `}
      >
        <img
          src={imgSrc}
          alt="Foto producto"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatarDefault; }}
          className="w-full h-full object-cover rounded-xl"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}