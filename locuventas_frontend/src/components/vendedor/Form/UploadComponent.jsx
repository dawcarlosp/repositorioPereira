import React, { useRef, useState } from "react";
import { UserRound } from "lucide-react";

const UploadComponent = ({ setFile }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null); // Estado para la imagen seleccionada

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Archivo seleccionado en UploadComponent:", file.name);
      setFile(file);

      // Crear una URL temporal para mostrar la imagen
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Si hay una imagen seleccionada, mostrarla; si no, mostrar el icono */}
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 object-cover border-2 border-purple-500 rounded-full cursor-pointer hover:scale-105"
          onClick={handleClick}
        />
      ) : (
        <UserRound
          size={100}
          className="border-2 border-purple-500 rounded-full text-purple-500 group-hover:text-orange-400  group-hover:border-orange-400 hover:border-purple-500 hover:text-purple-500 hover:border-3 cursor-pointer hover:scale-105"
          onClick={handleClick}
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*" // Solo permitir imágenes
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadComponent;
