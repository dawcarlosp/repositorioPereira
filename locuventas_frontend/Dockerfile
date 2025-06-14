FROM node:18-alpine as build  
  
WORKDIR /app  
  
# Copy package files  
COPY package*.json ./  
  
# Install dependencies  
RUN npm ci  
  
# Copy source code  
COPY . .  
  
# Accept build argument for API URL  
ARG VITE_API_URL  
ENV VITE_API_URL=$VITE_API_URL  
  
# Build the app  
RUN npm run build  
  
# Production stage  
FROM nginx:alpine  
COPY --from=build /app/dist /usr/share/nginx/html  
  
# Configure nginx for React Router  
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