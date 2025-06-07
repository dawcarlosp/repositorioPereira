import { apiRequest } from "../services/api";
import { useAuth } from "../context/useAuth";
import Boton from "../components/common/Boton";
import InputFieldset from "../components/common/InputFieldset";
import Enlace from "../components/common/Enlace";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertSimple from "../components/common/AlertSimple";

function FormVendedorLogin({ setIsOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await apiRequest("auth/login", { email, password });

      if (result.token) {
        const roles = result.roles || [];
        const esVendedor = roles.includes("ROLE_VENDEDOR");
        const esAdmin = roles.includes("ROLE_ADMIN");

        if (!esVendedor && !esAdmin) {
          setMensajeAlerta(
            "Su cuenta aún no ha sido habilitada como vendedor. Espere a que un administrador le otorgue permisos."
          );
          setMostrarAlerta(true);
          setLoading(false);
          return;
        }

        // GUARDA TODO, incluido token
        setAuth({
          token: result.token,
          nombre: result.nombre,
          foto: result.foto,
          email: result.email,
          roles,
        });

        navigate("/dashboard");
      } else {
        setError("No se recibió un token");
      }
    } catch (err) {
      setError(err.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center p-10 rounded-xl mt-5 shadow-2xl bg-gray-900"
      >
        <h2 className="text-4xl text-white mb-4">Iniciar sesión</h2>
        <UserRound size={100} className="border-2 border-orange-400 rounded-full text-orange-400 my-2" />
        <InputFieldset
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        <InputFieldset
          label="Contraseña"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        {error && <p className="text-orange-600 mt-2">{error}</p>}
        <Boton disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Boton>
        <div className="flex items-center justify-center mt-4">
          <p className="me-5 text-white">¿No tienes cuenta?</p>
          <Enlace
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
          >
            Regístrate
          </Enlace>
        </div>
      </form>
      {mostrarAlerta && (
        <AlertSimple
          mensaje={mensajeAlerta}
          onClose={() => setMostrarAlerta(false)}
        />
      )}
    </>
  );
}

export default FormVendedorLogin;
