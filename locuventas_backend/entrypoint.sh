#!/bin/sh

echo "Corrigiendo permisos de /app/uploads..."
chown -R spring:spring /app/uploads || echo "⚠No se pudieron cambiar los permisos"

exec java -jar app.jar
