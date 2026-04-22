// src/layout/Main.jsx
import React, { useState, useEffect, useRef } from "react";

export default function Main({ children }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling)  setIsScrolling(true);

      // Limpiamos el timeout anterior para que no se quite la clase antes de tiempo
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Quitamos la clase después de 1 segundo de inactividad
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (element) element.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <main
      ref={scrollRef}
      className={`flex-1 overflow-y-auto items-center p-4 w-full h-full custom-scrollbar ${
        isScrolling ? "scrolling" : ""
      }`}
    >
        {children}
    </main>
  );
}