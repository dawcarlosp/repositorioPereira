import { useRef, useState } from "react";
import plusIcon from "@assets/plus.png";
import avatarDefault from "@assets/default-avatar.png";

type Shape = "square" | "circle";

interface ImageUploadProps {
  setFile:       (file: File | null) => void;
  file:          File | null;
  fotoActualUrl: string | null;
  shape?:        Shape;
  disabled?:     boolean;
  className?:    string;
}

const SHAPE_STYLES: Record<Shape, string> = {
  square: "rounded-xl",
  circle: "rounded-full",
};

export default function ImageUpload({
  setFile,
  file,
  fotoActualUrl,
  shape = "square",
  disabled = false,
  className = "",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [justChanged, setJustChanged] = useState(false);
  const defaultImage = shape === "circle" ? avatarDefault : plusIcon;

  const imgSrc = (() => {
    if (file) return URL.createObjectURL(file);
    if (fotoActualUrl) return fotoActualUrl;
    return defaultImage;
  })();

  const shapeClass = SHAPE_STYLES[shape];

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
          w-28 h-28 ${shapeClass} border-4 border-purple-400
          flex items-center justify-center relative overflow-hidden
          shadow-lg transition-transform duration-500
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
          ${justChanged ? "ring-4 ring-purple-500 scale-110" : ""}
        `}
      >
        <img
          src={imgSrc}
          alt={shape === "circle" ? "Avatar" : "Foto producto"}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = defaultImage; }}
          className={`w-full h-full object-cover ${shapeClass}`}
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
