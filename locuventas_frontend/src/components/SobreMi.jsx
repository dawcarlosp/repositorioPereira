import React from "react";

const SobreMi = () => (
  <div className="min-h-screen bg-[#0B132B] text-white py-8 px-4 sm:px-8 md:px-16">
    <div className="max-w-3xl mx-auto">

      {/* Header SVG con redirección al GitHub */}
      <a
        href="https://github.com/dawcarlosp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://raw.githubusercontent.com/dawcarlosp/dawcarlosp/main/header_split_animated_fixed.svg"
          width="100%"
          height="250"
          alt="Header animado Carlos P."
          style={{ display: "block", margin: "0 auto" }}
        />
      </a>

      {/* Subtítulo centrado */}
      <div className="text-center mt-2 mb-4 text-lg italic">
        🧠 Siempre aprendiendo | 💻 Estudiante apasionado por el desarrollo web moderno
      </div>

      <hr className="border-[#1B263B] my-8" />

      {/* Sobre mí */}
      <h2 className="text-2xl font-bold mb-4">🎓 Sobre mí</h2>
      <ul className="list-disc list-inside space-y-2 mb-8 text-lg">
        <li>📍 Estudiante de <strong>Desarrollo de Aplicaciones Web</strong></li>
        <li>🛠️ Me apasiona crear soluciones reales con tecnologías modernas</li>
        <li>🚀 Actualmente enfocado en el back-end con <strong>Java + Spring Boot</strong> y explorando <strong>React</strong></li>
        <li>🧩 Curioso, autodidacta y con muchas ganas de aprender y aportar</li>
      </ul>

      <hr className="border-[#1B263B] my-8" />

      {/* Stack actual */}
      <h2 className="text-2xl font-bold mb-4">💡 Stack actual</h2>
      <img
        src="https://skillicons.dev/icons?i=java,spring,php,laravel,react,mysql,docker,html,css,git"
        alt="stack icons"
        className="mb-8"
      />

      <hr className="border-[#1B263B] my-8" />

      {/* Herramientas favoritas */}
      <h2 className="text-2xl font-bold mb-4">🧰 Herramientas favoritas</h2>
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <img
          src="https://skillicons.dev/icons?i=vscode,postman,mysql"
          alt="tools"
          style={{ height: "40px" }}
        />
        <img
          src="https://img.shields.io/badge/IDE-IntelliJ%20IDEA-red?logo=intellijidea&logoColor=white&style=for-the-badge"
          alt="IntelliJ"
          style={{ height: "32px" }}
        />
        <img
          src="https://img.shields.io/badge/IDE-NetBeans-blue?logo=apachenetbeanside&logoColor=white&style=for-the-badge"
          alt="NetBeans"
          style={{ height: "32px" }}
        />
      </div>

      <hr className="border-[#1B263B] my-8" />

      {/* Lenguajes más usados */}
      <h2 className="text-2xl font-bold mb-4">📈 Lenguajes más usados</h2>
      <img
        src="https://github-readme-stats.vercel.app/api/top-langs/?username=dawcarlosp&layout=compact&theme=github_dark&langs_count=8"
        alt="Top Languages"
        className="mb-8"
      />

      <hr className="border-[#1B263B] my-8" />

      {/* Estadísticas de GitHub */}
      <h2 className="text-2xl font-bold mb-4">📊 Estadísticas de GitHub</h2>
      <img
        src="https://github-readme-stats.vercel.app/api?username=dawcarlosp&show_icons=true&theme=github_dark"
        alt="GitHub stats"
        className="mb-4"
      />
      <img
        src="https://streak-stats.demolab.com?user=dawcarlosp&theme=github-dark&hide_border=true"
        alt="GitHub streak"
        className="mb-8"
      />

      <hr className="border-[#1B263B] my-8" />

      {/* Contacto */}
      <h2 className="text-2xl font-bold mb-4">📬 Contacto</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        <a href="mailto:dawcarlospereira@gmail.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://img.shields.io/badge/Email-dawcarlospereira@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white"
            alt="Email"
          />
        </a>
        <a href="https://es.linkedin.com/in/carlos-pereira-285815334" target="_blank" rel="noopener noreferrer">
          <img
            src="https://img.shields.io/badge/LinkedIn-Carlos%20Pereira-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"
            alt="LinkedIn"
          />
        </a>
        <a href="https://hub.docker.com/repositories/dawcarlosp" target="_blank" rel="noopener noreferrer">
          <img
            src="https://img.shields.io/badge/DockerHub-dawcarlosp-2496ED?style=for-the-badge&logo=docker&logoColor=white"
            alt="DockerHub"
          />
        </a>
      </div>

      <hr className="border-[#1B263B] my-8" />

      {/* Actividad reciente */}
      <h2 className="text-2xl font-bold mb-4">📈 Actividad reciente</h2>
      <a
        href="https://github.com/ashutosh00710/github-readme-activity-graph"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://github-readme-activity-graph.vercel.app/graph?username=dawcarlosp&theme=github-dark&hide_border=true"
          alt="Actividad reciente"
        />
      </a>

      <hr className="border-[#1B263B] my-8" />

      {/* Footer SVG */}
      <img
        src="https://raw.githubusercontent.com/dawcarlosp/dawcarlosp/main/footer_waves_dynamic.svg"
        width="100%"
        height="250"
        alt="Footer animado"
        style={{ display: "block", margin: "0 auto", marginTop: "2rem" }}
      />

    </div>
  </div>
);

export default SobreMi;
