import { useEffect, useState } from "react";
import { apiRequest } from "@services/api";
import FormDialog from "@components/common/FormDialog";
import InputFieldsetValidaciones from "@components/common/InputFieldsetValidaciones";
import UploadAvatar from "@/features/auth/components/UploadAvatar";
import { validateUser } from "@/utils/user.validator";
import { toast } from "react-toastify";
import { useAuth } from "@context/useAuth";

interface Props {
  isOpen:   boolean;
  setIsOpen: (v: boolean) => void;
  usuario:  { nombre?: string; email?: string; foto?: string | null } | null;
}

function FormEditarPerfil({ isOpen, setIsOpen, usuario }: Props) {
  const [foto, setFoto] = useState<File | null>(null);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setNombre(usuario?.nombre || "");
      setEmail(usuario?.email || "");
      setPassword("");
      setFoto(null);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, usuario]);

  useEffect(() => {
    setErrors(validateUser({ nombre, email, password, foto }, { validarFoto: false }));
  }, [nombre, email, password, foto]);

  const handleEditar = async () => {
    const validationErrors = validateUser(
      { nombre, email, password, foto },
      { validarFoto: false }
    );
    setErrors(validationErrors);
    setTouched({ nombre: true, email: true, password: true });

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Revisa los campos marcados.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    const userDTO: Record<string, string> = { nombre, email };
    if (password.trim()) userDTO.password = password;
    formData.append("user", new Blob([JSON.stringify(userDTO)], { type: "application/json" }));
    if (foto) formData.append("foto", foto);

    try {
      const result = await apiRequest<{ foto?: string }>("usuarios/editar-perfil", formData, {
        isFormData: true,
        method: "PUT",
      });

      toast.success("Perfil actualizado");
      setAuth((prev) => ({
        ...prev,
        nombre,
        email,
        foto: result.foto || prev.foto,
      }));
      setIsOpen(false);
    } catch (err) {
      const errorObj = err as Record<string, string>;
      setErrors(errorObj);
      toast.error(errorObj.message || "Error al editar");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FormDialog
      visible={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleEditar}
      titulo="Editar Perfil"
      botonTexto={loading ? "Actualizando..." : "Actualizar"}
      botonDisabled={loading}
    >
      <UploadAvatar
        setFile={setFoto}
        file={foto}
        fotoActualUrl={
          usuario?.foto
            ? `${import.meta.env.VITE_API_URL}/imagenes/vendedores/${usuario.foto}`
            : null
        }
      />

      {errors.foto && touched.foto && (
        <p className="text-red-400 text-xs text-center -mt-2 mb-1">{errors.foto}</p>
      )}

      <InputFieldsetValidaciones
        type="text"
        id="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
        placeholder="Tu nombre"
        error={errors.nombre}
        touched={touched.nombre}
      />

      <InputFieldsetValidaciones
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        placeholder="Correo electrónico"
        error={errors.email}
        touched={touched.email}
      />

      <InputFieldsetValidaciones
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        placeholder="Nueva contraseña (opcional)"
        autoComplete="new-password"
        error={errors.password}
        touched={touched.password}
      />
    </FormDialog>
  );
}

export default FormEditarPerfil;
