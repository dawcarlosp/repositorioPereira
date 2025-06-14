# Build stage  
FROM node:18-alpine as build  
  
WORKDIR /app  
  
COPY package*.json ./  
RUN npm ci  
  
COPY . .  
  
# Build argument (Vite env variable)  
ARG VITE_API_URL  
ENV VITE_API_URL=$VITE_API_URL  
  
# Build app (Vite will pick up VITE_API_URL from environment)  
RUN npm run build  
  
# Production stage  
FROM nginx:alpine  
  
COPY --from=build /app/dist /usr/share/nginx/html  
  
# Configure Nginx for React Router  
RUN echo 'server { \  
    listen 80; \  
    location / { \  
        root /usr/share/nginx/html; \  
        index index.html index.htm; \  
        try_files $uri $uri/ /index.html; \  
    } \  
}' > /etc/nginx/conf.d/default.conf  
  
EXPOSE 80  
CMD ["nginx", "-g", "daemon off;"]