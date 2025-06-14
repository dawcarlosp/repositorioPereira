# Build stage  
FROM node:18-alpine as build  
  
WORKDIR /app  
  
COPY package*.json ./  
RUN npm ci  
  
COPY . .  
  
# Build argument (Vite env variable)  
ARG VITE_API_URL  

# Pass it to Vite via environment variable  
ENV VITE_API_URL=$VITE_API_URL  

#  Important: pass it inline to the build step explicitly  
RUN VITE_API_URL=$VITE_API_URL npm run build  
  
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
