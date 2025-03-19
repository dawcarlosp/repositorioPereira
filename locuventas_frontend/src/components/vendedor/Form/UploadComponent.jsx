import React, { useRef } from "react";
import {UserRound } from "lucide-react";
const UploadComponent = ({ setFile }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Archivo seleccionado en UploadComponent:", file.name);
      setFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <UserRound
          size={100}
          className="border-2 border-purple-500 rounded-full text-purple-500 hover:border-orange-400 hover:text-orange-400 hover:border-3 cursor-pointer hover:scale-105"
          onClick={handleClick}/>   
      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadComponent;

