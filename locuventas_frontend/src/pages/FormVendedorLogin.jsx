import { apiRequest } from "../services/api";
import { useAuth } from "../context/useAuth";
import Boton from "../components/common/Boton";
import InputFieldset from "../components/common/InputFieldset";
import Enlace from "../components/common/Enlace";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
        setAuth({
          token: result.token,
          nombre: result.nombre,
          foto: result.foto,
          email: result.email,
          roles,
        });
        navigate("/dashboard");
      } else if (result.message) {
        setMensajeAlerta(result.message);
        setMostrarAlerta(true);
      } else {
        setError("No se recibió un token");
      }
    } catch (err) {
      console.log("Login error:", err);
      if (err.message && err.path && err.timestamp) {
        setMensajeAlerta(err.message);
        setMostrarAlerta(true);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error en la autenticación");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center
          p-10 rounded-xl mt-5
          bg-zinc-900
          transition-all duration-300
          ring-2 ring-orange-400 shadow-[0_0_12px_2px_rgba(251,146,60,0.4)]
          hover:ring-purple-500 hover:shadow-[0_0_18px_4px_rgba(168,85,247,0.6)]"
      >
        <Link
          to="/dashboard"
          className="
            text-4xl font-extrabold text-white tracking-wide hover:scale-105
            transition-transform duration-200 drop-shadow-sm
            bg-zinc-900 px-8 py-4 rounded-2xl mb-7 flex items-center justify-center
            border-4 border-orange-400 shadow-[0_0_16px_0_rgba(251,146,60,0.5)]
          "
          style={{ minWidth: "250px", minHeight: "70px" }}
        >
          Locu<span className="text-orange-400">Ventas</span>
        </Link>

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
