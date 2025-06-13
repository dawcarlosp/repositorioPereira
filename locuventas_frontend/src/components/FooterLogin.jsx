import React from "react";
import { Link} from "react-router-dom";
import Boton from "@components/common/Boton";

export default function Footer({hacia, texto}) {


  return (
    <footer
      className="
        w-full
        bg-zinc-900 flex flex-col md:flex-row justify-center items-center
        gap-2 md:gap-8
        px-4 py-4
        border-t border-zinc-800
        shadow-xl
        mt-auto
        rounded-xl
      "
      style={{
        position: "sticky",
        bottom: 0,
        left: 0,
        zIndex: 30,
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
      <div className="w-full md:max-w-xs">
        <Link to={hacia}>
            <Boton>{texto}</Boton>
        </Link>
      </div>
    </footer>
  );
}
