import { apiRequest } from "../../../services/api";
import Boton from "../../common/Boton";
import InputFieldset from "../../common/InputFieldset";
import Enlace from "../../common/Enlace"; 
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
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  return (
    <form onSubmit={handleLogin} className="flex flex-col items-center justify-center border p-10 rounded-xl mt-5 group">
        <h2 className="text-4xl">Iniciar sesión</h2>
        <UserRound size={100} className="border-2 border-purple-500 rounded-full text-purple-500"/>
              {/* Usamos el nuevo componente InputFieldset */}
      <InputFieldset 
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={"Correo electrónico"}
      />
      <InputFieldset 
        label="Contraseña"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={"Contraseña"}
      />
        {error && <p className="text-orange-400">{error}</p>}
          {/* Usamos el componente Boton aquí */}
          <Boton disabled={loading}>
        {loading ? "Cargando..." : "Iniciar Sesión"}
      </Boton>
        <div className="flex items-center justify-center">
            <p className="me-5">¿No tienes cuenta?</p>
            {/* También usamos Boton para el botón de registro */}
        <Enlace onClick={(e) => {
          e.preventDefault(); // Previene que el formulario se recargue
          setIsOpen(true);
        }}>Regístrate</Enlace>
        </div>
    </form>
  )
}

export default FormVendedorLogin