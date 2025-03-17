
function FormVendedorLogin({ setIsOpen }) {
  return (
    <form className="flex flex-col items-center justify-center border p-5 rounded-xl">
        <h2 className="text-4xl">Iniciar sesión</h2>
        <fieldset className="flex flex-col  items-center justify-center">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" className="border rounded-xl"/>
        </fieldset>
        <fieldset className="flex flex-col  items-center justify-center">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" className="border rounded-xl"/>
        </fieldset>
        <button className="border my-4 p-2 rounded-xl bg-purple-500 text-white hover:bg-orange-400 cursor-pointer hover:scale-105" id="registrarse">Iniciar Sesión</button>
        <div className="flex items-center justify-center">
            <p className="text-blue-500 me-5">¿No tienes cuenta?</p>
            <button className="border bg-purple-500 text-white hover:bg-orange-400 p-1 rounded-xl cursor-pointer hover:scale-105"  onClick={(e) => {
            e.preventDefault(); // Previene que el formulario se recargue
            setIsOpen(true);
          }}>Regístrate</button>
        </div>
    </form>
  )
}

export default FormVendedorLogin