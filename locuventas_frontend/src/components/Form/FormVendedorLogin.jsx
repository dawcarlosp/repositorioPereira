import { apiRequest } from "../../services/api";
import { UserRound } from "lucide-react";
import { useState } from "react";
function FormVendedorLogin({ setIsOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
          const result = await apiRequest("auth/login", { email, password });
          console.log("Login exitoso:", result);
          // Aquí puedes guardar el token en localStorage o en el estado global
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };
  return (
    <form onSubmit={handleLogin} className="flex flex-col items-center justify-center border p-5 rounded-xl mt-5">
        <h2 className="text-4xl">Iniciar sesión</h2>
        <UserRound size={100} className="border-2 border-purple-500 rounded-full text-purple-500"/>
        <fieldset className="flex flex-col  items-center justify-center">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email"  value={email} onChange={(e) => setEmail(e.target.value)} required className="border rounded-xl w-80 py-2"/>
        </fieldset>
        <fieldset className="flex flex-col  items-center justify-center">
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password"  value={password} onChange={(e) => setPassword(e.target.value)} required className="border rounded-xl w-80 py-2"/>
        </fieldset>
        {error && <p className="text-orange-400">{error}</p>}
        <button className="border my-4 p-2 rounded-xl bg-purple-500 text-white hover:bg-orange-400 cursor-pointer hover:scale-105" disabled={loading}>
        {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
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