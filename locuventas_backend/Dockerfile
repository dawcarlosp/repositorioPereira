# ---------- BUILD STAGE ----------
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Instalar Maven
RUN apk add --no-cache maven

# Copiar proyecto y precargados
COPY pom.xml .
COPY src ./src
COPY uploads/productosprecargados ./uploads_precargados_base

# Compilar sin tests
RUN mvn clean package -DskipTests -B
RUN test -f target/locuventas_backend-0.0.1-SNAPSHOT.jar

# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear carpetas de uploads
RUN mkdir -p /app/uploads/productos /app/uploads/vendedores /app/uploads/productosprecargados

# Copiar app y precargados temporales
COPY --from=builder /app/target/locuventas_backend-0.0.1-SNAPSHOT.jar app.jar
COPY --from=builder /app/uploads_precargados_base /app/uploads_precargados_base

# Copiar entrypoint y dar permisos
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Crear usuario no-root
RUN addgroup -S spring && adduser -S spring -G spring && \
    chown -R spring:spring /app

USER spring

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
