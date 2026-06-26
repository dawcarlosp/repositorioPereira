import { useRef, useState } from "react";
import avatarDefault from "@assets/default-avatar.png";

interface Props {
  setFile:       (f: File | null) => void;
  file:          File | null;
  fotoActualUrl: string | null;
}

function UploadAvatar({ setFile, file, fotoActualUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState(() => {
    if (file) return URL.createObjectURL(file);
    if (fotoActualUrl) return fotoActualUrl;
    return avatarDefault;
  });
  const [justChanged, setJustChanged] = useState(false);

  const handleImageError = () => {
    setImgSrc(avatarDefault);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setImgSrc(URL.createObjectURL(selected));
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div
        className={`
          w-28 h-28 rounded-full border-4 border-purple-400 
          flex items-center justify-center cursor-pointer relative overflow-hidden 
          shadow-lg transition-transform duration-500
          hover:scale-105
          ${justChanged ? "ring-4 ring-purple-500 scale-125" : ""}
        `}
        onClick={() => inputRef.current?.click()}
      >
        <img
          src={imgSrc}
          alt="Avatar"
          onError={handleImageError}
          className="w-full h-full object-cover rounded-full"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default UploadAvatar;
