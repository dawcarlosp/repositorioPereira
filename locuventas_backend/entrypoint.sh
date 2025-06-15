#!/bin/sh

echo "🚀 Corrigiendo permisos de uploads..."

mkdir -p /app/uploads/productos /app/uploads/vendedores /app/uploads/productosprecargados

if [ -z "$(ls -A /app/uploads/productosprecargados 2>/dev/null)" ]; then
  echo "📦 Copiando imágenes precargadas..."
  cp -r /app/uploads_precargados_base/* /app/uploads/productosprecargados/
else
  echo "ℹ️ Ya existen imágenes precargadas, no se copian."
fi

echo "🔄 Iniciando aplicación..."
exec java -jar app.jar
