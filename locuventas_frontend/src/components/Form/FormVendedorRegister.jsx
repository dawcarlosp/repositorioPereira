import React, { useEffect, useRef } from "react";
function FormVendedorRegister({ isOpen, setIsOpen }) {
    const dialogRef = useRef(null);

    // Maneja la visibilidad del modal con useEffect
    useEffect(() => {
      if (isOpen) {
        dialogRef.current?.showModal(); // Muestra el modal
      } else {
        dialogRef.current?.close(); // Cierra el modal
      }
    }, [isOpen]);
  
  return (
    <dialog ref={dialogRef} className="flex flex-col items-center justify-center border p-5 rounded-xl">
            <button class="border bg-purple-500 text-white hover:bg-orange-400 p-1 rounded-xl cursor-pointer hover:scale-105 self-end" onClick={() => setIsOpen(false)} >X</button>
        <h2 className="text-2xl">Regístrate y sacale el máximo provecho a la app</h2>
        <fieldset className="flex flex-col  items-center justify-center">
            <label htmlFor="nombre">¿Cómo te llamas?</label>
            <input type="text" id="nombre" className="border rounded-xl"/>
        </fieldset>
        <fieldset className="flex flex-col  items-center justify-center">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" className="border rounded-xl"/>
        </fieldset>
        <fieldset className="flex flex-col  items-center justify-center">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" className="border rounded-xl"/>
        </fieldset>
        <button className="border my-4 p-2 rounded-xl bg-purple-500 text-white hover:bg-orange-400 cursor-pointer hover:scale-105" id="registrarse">Regístrarse</button>
    </dialog>
  )
}

export default FormVendedorRegister