// src/components/common/UploadComponent.jsx
import React, { useRef } from "react";

function UploadComponent({ setFile, file, fotoActualUrl }) {
  const inputRef = useRef();

  // Para mostrar la previsualización:
  const showPreview = file
    ? URL.createObjectURL(file)
    : fotoActualUrl
    ? fotoActualUrl
    : null;

  return (
    <div className="flex flex-col items-center mb-4">
      <div
        className="w-28 h-28 rounded-full border-4 border-orange-400 flex items-center justify-center cursor-pointer relative overflow-hidden bg-white shadow-lg"
        onClick={() => inputRef.current.click()}
      >
        {showPreview ? (
          <img
            src={showPreview}
            alt="Previsualización"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-purple-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </div>
      <span className="text-xs text-gray-600 underline mt-1 cursor-pointer" onClick={() => inputRef.current.click()}>
        Haz clic para subir una foto
      </span>
    </div>
  );
}

export default UploadComponent;
