import React from "react";

const SobreMi = () => (
  <div className="min-h-screen bg-[#0B132B] text-white py-10 px-4 sm:px-8 md:px-16">
    <div className="max-w-4xl mx-auto">

      {/* Encabezado SVG */}
      <a
        href="https://github.com/dawcarlosp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://raw.githubusercontent.com/dawcarlosp/dawcarlosp/main/assets-perfil/headerPerfil.svg"
          alt="Header Carlos Pereira"
          className="w-full h-auto mx-auto mb-6"
        />
      </a>

      {/* Subtítulo */}
      <p className="text-center italic text-lg mb-6">
        🧠 Siempre aprendiendo | 💻 Apasionado por el desarrollo web moderno
      </p>

      <hr className="border-[#1B263B] my-8" />

      {/* Sobre mí */}
      <h2 className="text-2xl font-bold mb-4">🎓 Sobre mí</h2>
      <ul className="list-disc list-inside space-y-2 text-lg mb-8">
        <li>📍 Desarrollador Web Full Stack Jr.</li>
        <li>🛠️ Me apasiona crear soluciones reales con tecnologías modernas</li>
        <li>🚀 Actualmente enfocado en el back-end con <strong>Java + Spring Boot</strong> y explorando <strong>React</strong></li>
        <li>🧩 Curioso, autodidacta y con muchas ganas de aprender y aportar</li>
      </ul>

      <hr className="border-[#1B263B] my-8" />

      {/* Stack actual */}
      <h2 className="text-2xl font-bold mb-4">💡 Stack actual</h2>

      {/* Backend */}
      <h3 className="text-xl font-semibold mb-2">🔧 Backend</h3>
      <img
        src="https://skillicons.dev/icons?i=java,spring,php,laravel"
        alt="Backend stack"
        className="h-10 mb-4"
      />

      {/* Frontend */}
      <h3 className="text-xl font-semibold mb-2">🎨 Frontend</h3>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <img src="https://skillicons.dev/icons?i=html" alt="HTML" className="h-10 w-auto" />
        <img src="https://raw.githubusercontent.com/dawcarlosp/dawcarlosp/main/assets-perfil/css_new_logo.png" alt="CSS" className="h-10 w-auto" />
        <img src="https://skillicons.dev/icons?i=js,react,tailwind,bootstrap,vite" alt="Frontend stack" className="h-10 w-auto" />
      </div>

      {/* Base de datos */}
      <h3 className="text-xl font-semibold mb-2">🗃️ Base de Datos</h3>
      <img
        src="https://skillicons.dev/icons?i=mysql,mongodb"
        alt="Bases de datos"
        className="h-10 mb-4"
      />

      {/* Cloud & DevOps */}
      <h3 className="text-xl font-semibold mb-2">☁️ Cloud & DevOps</h3>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <img src="https://skillicons.dev/icons?i=docker,gcp,git" alt="DevOps stack" className="h-10 w-auto" />
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" alt="Linux" className="h-10 w-auto object-contain" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Linux_Mint_logo_without_wordmark.svg" alt="Linux Mint" className="h-10 w-auto object-contain" />
      </div>

      <hr className="border-[#1B263B] my-8" />

      {/* Herramientas favoritas */}
      <h2 className="text-2xl font-bold mb-4">🧰 Herramientas favoritas</h2>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <img src="https://skillicons.dev/icons?i=vscode,postman,mysql" alt="Herramientas" className="h-10 w-auto" />
        <img src="https://raw.githubusercontent.com/dawcarlosp/dawcarlosp/main/assets-perfil/intell-ij.png" alt="IntelliJ IDEA" className="h-10 w-auto object-contain" />
        <img src="https://raw.githubusercontent.com/dawcarlosp/dawcarlosp/main/assets-perfil/netbeans.png" alt="NetBeans" className="h-10 w-auto object-contain" />
      </div>

      <hr className="border-[#1B263B] my-8" />

      {/* Lenguajes más usados */}
      <h2 className="text-2xl font-bold mb-4">📈 Lenguajes más usados</h2>
      <img
        src="https://github-readme-stats.vercel.app/api/top-langs/?username=dawcarlosp&layout=compact&theme=github_dark&langs_count=8"
        alt="Top Languages"
        className="mb-8 w-full"
      />

      <hr className="border-[#1B263B] my-8" />

      {/* Estadísticas GitHub */}
      <h2 className="text-2xl font-bold mb-4">📊 Estadísticas de GitHub</h2>
      <img
        src="https://github-readme-stats.vercel.app/api?username=dawcarlosp&show_icons=true&theme=github_dark"
        alt="GitHub Stats"
        className="mb-4 w-full"
      />
      <img
        src="https://streak-stats.demolab.com?user=dawcarlosp&theme=github-dark&hide_border=true"
        alt="GitHub Streak"
        className="mb-8 w-full"
      />

      <hr className="border-[#1B263B] my-8" />

      {/* Actividad reciente */}
      <h2 className="text-2xl font-bold mb-4">📈 Actividad reciente</h2>
      <img
        src="https://github-readme-activity-graph.vercel.app/graph?username=dawcarlosp&theme=github-dark&hide_border=true"
        alt="Actividad reciente"
        className="mb-8 w-full"
      />

      <hr className="border-[#1B263B] my-8" />

      {/* Contacto */}
      <h2 className="text-2xl font-bold mb-4">📬 Contacto & redes</h2>
      <div className="flex flex-wrap gap-4 items-center mb-8">
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

      {/* Footer SVG */}
      <img
        src="https://raw.githubusercontent.com/dawcarlosp/dawcarlosp/main/assets-perfil/footerPerfil.svg"
        alt="Footer"
        className="w-full h-auto mt-12"
      />
    </div>
  </div>
);

export default SobreMi;
