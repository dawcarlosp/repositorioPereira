<p align="center">
  <img src="https://github.com/dawcarlosp/dawcarlosp/blob/main/logoAnimadoLocuVentas.svg" width="350"/>
</p>

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

> Nota, tienes la posibilidad de editar ".env" con tus propios valores(recomendado)
> Para funcionamiento inmedianto, se recomienda:

```bash
APP_ADMIN_EMAIL, APP_ADMIN_PASSWORD, APP_ADMIN_NOMBRE
```
---

> La foto ya te la pones una vez estes dentro de la app😉​

---

## Paso 3. Levantar el proyecto

```bash
# Con Docker Compose V2 (Docker moderno)
docker compose up -d

# O con Docker Compose clásico
docker-compose up -d
```
---

### Esto hará lo siguiente

- 🛠️ Crear una red interna locuventas_network
- 🐬 Iniciar MySQL y esperar que esté saludable
- 🔧 Levantar el backend desde la imagen ${DOCKER_HUB_USER}/locuventas-backend
- 🎨 Levantar el frontend desde ${DOCKER_HUB_USER}/locuventas-frontend
- 📁 Mapear los volúmenes de imágenes (uploads/)

--- 

### Verificar

- Accede al frontend: http://localhost:3000
- Revisa el backend (si lo necesitas): http://localhost:8080

--- 

###  Detener y limpiar

- Para los servicios:

```bash
docker compose down

- Para eliminar también volúmenes (base de datos incluida):

```bash
docker compose down -v
```
---

#####Proyecto educativo para DAW – IES Juan Bosco

