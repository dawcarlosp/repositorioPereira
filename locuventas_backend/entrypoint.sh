#!/bin/sh

echo "🔧Corrigiendo permisos de /app/uploads..."
mkdir -p /app/uploads/productos /app/uploads/vendedores /app/uploads/productosprecargados

# Solo copiar si está vacío
if [ -z "$(ls -A /app/uploads/productosprecargados)" ]; then
  echo "Copiando imágenes precargadas..."
  cp -r /app/uploads_precargados_base/* /app/uploads/productosprecargados/
else
  echo "Ya existen imágenes precargadas, no se copian."
fi

# Asegura permisos para el usuario spring
chown -R spring:spring /app/uploads

echo "Iniciando aplicación..."
exec java -jar app.jar
