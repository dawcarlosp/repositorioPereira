// src/features/auth/components/Form/FormVendedorRegister.tsx
import FormDialog from "@components/common/FormDialog";
import InputFieldsetValidaciones from "@components/common/InputFieldsetValidaciones";
import UploadAvatar from "@features/auth/components/UploadAvatar";
import useRegister from "@features/auth/hooks/useRegister";

interface Props {
  isOpen:    boolean;
  setIsOpen: (v: boolean) => void;
}

export default function FormVendedorRegister({ isOpen, setIsOpen }: Props) {
  const {
    foto,        setFoto,
    nombre,      setNombre,
    email,       setEmail,
    password,    setPassword,
    loading,
    errors,
    touched,
    showReminder,
    handleBlur,
    handleRegister,
  } = useRegister(isOpen, () => setIsOpen(false));

  if (!isOpen) return null;

  return (
    <FormDialog
      visible={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleRegister}
      titulo="Crear Cuenta de Vendedor"
      botonTexto={loading ? "Registrando..." : "Registrarse"}
      botonDisabled={loading}
    >
      {showReminder && (
        <div className="w-full bg-purple-600/20 border border-purple-500/30 text-purple-200 text-xs py-2 px-3 rounded-lg text-center font-medium animate-pulse mb-2">
          👉 ¡No olvides subir una foto de perfil clara para tu usuario!
        </div>
      )}

      <UploadAvatar setFile={setFoto} file={foto} fotoActualUrl={null} />

      <InputFieldsetValidaciones
        type="text"
        id="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        onBlur={() => handleBlur("nombre")}
        placeholder="Dinos cómo te llamas"
        error={errors.nombre}
        touched={touched.nombre}
      />
      <InputFieldsetValidaciones
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur("email")}
        placeholder="Correo electrónico"
        error={errors.email}
        touched={touched.email}
      />
      <InputFieldsetValidaciones
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur("password")}
        placeholder="Contraseña"
        error={errors.password}
        touched={touched.password}
      />
    </FormDialog>
  );
}