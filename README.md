<a align="center" href="https://github.com/dawcarlosp/repositorioPereira.git">
  <img src="https://github.com/dawcarlosp/dawcarlosp/blob/main/logoAnimadoLocuVentas.svg" width="350"/>
</a>

---
> Probar en linea: [Pincha aquí](https://tfg.dawcarlosp.com/)
---

# 🐳 Guía de instalación de LocuVentas con Docker

¡Bienvenido/a! Aquí encontrarás los pasos necesarios para levantar **LocuVentas** (backend + frontend + base de datos) usando `docker-compose`.

---

## 🧱 Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- 🐋 [Docker](https://docs.docker.com/get-docker/)
- ⚙️ [Docker Compose](https://docs.docker.com/compose/install/)

> ℹ️ En algunas versiones de Docker, el comando es `docker-compose` (con guion), en otras es `docker compose` (sin guion). Ambos funcionan si Docker está correctamente instalado.

---

## 📁 Paso 1. Clonar el repositorio

---

```bash
git clone https://github.com/dawcarlosp/repositorioPereira.git
cd repositorioPereira
```

---

## 📁 Paso 2. Configurar el entorno

---

```bash
cp .env.example .env
```

---

> Nota: tienes la posibilidad de editar ".env" con tus propios valores(recomendado)
> Para funcionamiento inmediato y evitar conclictos, se recomienda:

```bash
APP_ADMIN_EMAIL, APP_ADMIN_PASSWORD, APP_ADMIN_NOMBRE
```
---

> La foto ya te la pones una vez estés dentro de la app😉​

---

## Paso 3. Levantar el proyecto

```bash
# Con Docker Compose V2 (Docker moderno)
docker compose --env-file .env up -d

# O con Docker Compose clásico
docker-compose --env-file .env up -d
```
---

### Esto hará lo siguiente

- 🛠️ Crear una red interna locuventas_network
- 🐬 Iniciar MySQL y esperar que esté saludable
- 🔧 Levantar el backend desde la imagen [dawcarlosp/backend:1.0](https://hub.docker.com/repository/docker/dawcarlosp/locuventas-frontend/tags/1.0/sha256-20b8ff2ddc07779d835d7969466b3df5aeb083ed532d7cc2a4ccbe1c686feb59)
- 🎨 Levantar el frontend desde [dawcarlosp/frontend:1.0](https://hub.docker.com/repository/docker/dawcarlosp/locuventas-backend/tags/1.0/sha256-242ea3b9c02d3a5b32e36cb5253648581dac0b7bc5452f1c74b16add29ccf0b1)
- 📁 Mapear los volúmenes de imágenes (uploads/)

--- 

### Verificar

- Accede al frontend: http://localhost:3000
- Revisa el backend (si lo necesitas): http://localhost:8080

--- 

> Recuerda, que si registras una nueva cuenta, tienes que aprobarla a través del administrador

###  Detener y limpiar

- Para los servicios:

```bash
docker compose down
```

- Para eliminar también volúmenes (base de datos incluida):

```bash
docker compose down -v
```
---

##### Proyecto educativo para DAW – IES Juan Bosco

