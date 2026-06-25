import { useNavigate, Link } from "react-router-dom";
import Boton from "@buttons/Boton";

interface Props {
  modo?: "perfil" | "volver";
}

export default function FooterLogin({ modo = "perfil" }: Props) {
  const navigate = useNavigate();

  if (modo === "volver") {
    return (
      <div className="w-full mt-auto rounded-t-2xl shadow-2xl">
        <footer className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 px-4 py-6 rounded-t-2xl">
          <Boton onClick={() => navigate(-1)}>← Volver</Boton>
        </footer>
      </div>
    );
  }

  return (
    <div className="w-full mt-auto rounded-t-2xl shadow-2xl">
      <footer className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 px-4 py-6 rounded-t-2xl">
        <Link to="/aboutme">
          <Boton>Perfil del desarrollador</Boton>
        </Link>
      </footer>
    </div>
  );
}
