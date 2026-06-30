import { useNavigate, Link } from "react-router-dom";
import Button from "@buttons/Button";

interface Props {
  modo?: "perfil" | "volver";
}

export default function FooterLogin({ modo = "perfil" }: Props) {
  const navigate = useNavigate();

  if (modo === "volver") {
    return (
      <div className="w-full mt-auto rounded-t-2xl shadow-2xl">
        <footer className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 px-4 py-6 rounded-t-2xl">
          <Button onClick={() => navigate(-1)}>← Volver</Button>
        </footer>
      </div>
    );
  }

  return (
    <div className="w-full mt-auto rounded-t-2xl shadow-2xl">
      <footer className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 px-4 py-6 rounded-t-2xl">
        <Link to="/aboutme">
          <Button>Perfil del desarrollador</Button>
        </Link>
      </footer>
    </div>
  );
}
