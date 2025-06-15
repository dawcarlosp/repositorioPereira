# ---------- BUILD STAGE ----------
FROM node:18-alpine AS build

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm ci

# Copia el resto del código
COPY . .

# Variable de entorno recibida como argumento
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compila con la API configurada
RUN VITE_API_URL=$VITE_API_URL npm run build

# ---------- PRODUCTION STAGE ----------
FROM nginx:alpine

# Copia los archivos generados
COPY --from=build /app/dist /usr/share/nginx/html

# Configura Nginx para SPA sin redirecciones
RUN rm /etc/nginx/conf.d/default.conf && \
    printf 'server {\n\
        listen 80;\n\
        server_name localhost;\n\
        root /usr/share/nginx/html;\n\
\n\
        location / {\n\
            try_files $uri $uri/ /index.html;\n\
        }\n\
    }\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

