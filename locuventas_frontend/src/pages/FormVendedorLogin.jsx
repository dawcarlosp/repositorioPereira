import { apiRequest } from "../services/api";
import { useAuth } from "../context/auth.context"; // Asegúrate de importar desde la ubicación correcta
import Boton from "../components/common/Boton";
import InputFieldset from "../components/common/InputFieldset";
import Enlace from "../components/common/Enlace"; 
import { UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function FormVendedorLogin({ setIsOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setToken } = useAuth(); // Obtén la función para actualizar el token
      //Para la redirección
    const navigate = useNavigate();
    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const result = await apiRequest("auth/login", { email, password });
        console.log("Login exitoso:", result);
        
        if (result.token) {  // Asegúrate de que la API devuelve el token
          setToken(result.token);  // Guarda el token en el contexto
          console.log("Token guardado:", result.token);
          navigate('/dashboard');
      } else {
          setError("No se recibió un token");
      }
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  return (
    <form onSubmit={handleLogin} className="flex flex-col items-center justify-center p-10 rounded-xl mt-5 shadow-2xl bg-gray-900">
        <h2 className="text-4xl text-white">Iniciar sesión</h2>
        <UserRound size={100} className="border-2 border-orange-400 rounded-full text-orange-400 my-2"/>
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
        {error && <p className="text-orange-600">{error}</p>}
          {/* Usamos el componente Boton aquí */}
          <Boton disabled={loading}>
        {loading ? "Cargando..." : "Iniciar Sesión"}
      </Boton>
        <div className="flex items-center justify-center">
            <p className="me-5 text-white">¿No tienes cuenta?</p>
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