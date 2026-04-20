// src/layout/Main.jsx
import React from "react";

export default function Main({ children }) {
  return (
    <main className="flex-1 overflow-y-auto items-center p-4 w-full h-full custom-scrollbar">
        {children}
    </main>
  );
}