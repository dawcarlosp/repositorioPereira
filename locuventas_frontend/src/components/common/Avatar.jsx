// src/components/common/Avatar.jsx
import defaultAvatar from "@/assets/default-avatar.png";

export default function Avatar({ src, alt, size = "w-15 h-15", className = "" }) {
  const displayUrl = src || defaultAvatar;

  return (
    <div className={`${size} rounded-full overflow-hidden border-2 transition-all duration-300 cursor-pointer ${className}`}>
      <img
        src={displayUrl}
        alt={alt || "Avatar"}
        onError={(e) => (e.currentTarget.src = defaultAvatar)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}