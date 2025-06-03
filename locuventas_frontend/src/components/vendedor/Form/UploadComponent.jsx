import React, { useRef, useState } from "react";
import { UserRound } from "lucide-react";

const UploadComponent = ({ setFile }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [justSelected, setJustSelected] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setJustSelected(true);
      setTimeout(() => setJustSelected(false), 500);
    }
  };

  const borderColor = preview ? "ring-purple-500" : "ring-orange-400";
  const shadowColor = preview
    ? "shadow-[0_0_20px_6px_rgba(168,85,247,0.6)]"
    : "shadow-[0_0_12px_4px_rgba(251,146,60,0.4)]";

  return (
    <div className="flex flex-col items-center mt-6 mb-4">
      <div
        onClick={handleClick}
        className={`relative w-28 h-28 rounded-full overflow-hidden cursor-pointer ring-4 transition-all duration-500 
        ${borderColor} ${shadowColor} 
        hover:ring-purple-500 hover:shadow-[0_0_20px_6px_rgba(168,85,247,0.6)]`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Foto de perfil"
            className={`absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ${
              justSelected ? "scale-[1.6]" : "scale-100"
            }`}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-white/10 text-orange-400 hover:text-purple-500 transition-colors duration-300">
            <UserRound size={64} /> {/* Icono más grande */}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />

      <p className="text-xs text-gray-500 mt-2">Haz clic para subir una foto</p>
    </div>
  );
};

export default UploadComponent;
