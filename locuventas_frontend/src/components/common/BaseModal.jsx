import React from "react";
import ReactDOM from "react-dom";

export default function BaseModal({
  title,
  children,
  footer,
  onClose,
  className = "",
  contentClassName = "flex-1 overflow-y-auto",
  closeOnOverlayClick = true,
}) {
  const handleBackdropClick = (event) => {
    if (!closeOnOverlayClick) return;
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[1000000] bg-black/70 backdrop-blur-[2px] flex items-center justify-center px-2 sm:px-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-zinc-900 text-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-5 sm:p-8 border border-zinc-700 flex flex-col ${className}`}
        style={{ minWidth: 0 }}
      >
        {title && (
          <div className="flex-shrink-0 mb-4">
            <h2 className="text-lg sm:text-2xl font-bold tracking-wide">{title}</h2>
          </div>
        )}

        <div className={contentClassName}>{children}</div>

        {footer && (
          <div className="flex flex-col gap-3 mt-5">{footer}</div>
        )}
      </div>
    </div>,
    document.getElementById("portal-root"),
  );
}
