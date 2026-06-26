// src/features/auth/components/Form/FormVendedorLogin.tsx
import Boton from "@buttons/Boton";
import InputFieldset from "@components/common/InputFieldset";
import Enlace from "@components/common/Enlace";
import AlertSimple from "@components/common/AlertSimple";
import LogoNegocio from "@components/common/LogoNegocio";
import useLogin from "@features/auth/hooks/useLogin";

interface Props {
  setIsOpen: (v: boolean) => void;
}

export default function FormVendedorLogin({ setIsOpen }: Props) {
  const {
    email,        setEmail,
    password,     setPassword,
    loading,
    error,
    mostrarAlerta,
    mensajeAlerta,
    cerrarAlerta,
    handleLogin,
  } = useLogin();

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-stretch justify-center gap-5
          w-full max-w-[400px] mx-auto
          p-5 sm:p-10 rounded-xl my-2
          bg-zinc-900 transition-all duration-300
          ring-2 ring-purple-400 shadow-[0_0_12px_2px_rgba(251,146,60,0.4)]
          hover:ring-purple-500 hover:shadow-[0_0_18px_4px_rgba(168,85,247,0.6)]"
      >
        <div className="flex justify-center mb-1">
          <LogoNegocio />
        </div>

        {/* placeholder hace el trabajo de label en InputFieldset */}
        <InputFieldset
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />

        <InputFieldset
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />

        {error && (
          <p className="text-orange-600 text-sm text-center font-medium break-words">
            {error}
          </p>
        )}

        <Boton disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Boton>

        <div className="flex flex-col xs:flex-row items-center justify-center gap-2 mt-2 text-sm text-center">
          <p className="text-white">¿No tienes cuenta?</p>
          <Enlace onClick={(e) => { e.preventDefault(); setIsOpen(true); }}>
            Regístrate
          </Enlace>
        </div>
      </form>

      {mostrarAlerta && (
        <AlertSimple mensaje={mensajeAlerta} onClose={cerrarAlerta} />
      )}
    </>
  );
}