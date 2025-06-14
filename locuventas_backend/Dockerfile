# Multi-stage build
FROM eclipse-temurin:17-jdk-alpine as builder

WORKDIR /app

# Maven wrapper
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

# Dependency caching
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

# Source + static resources
COPY src src
COPY uploads/productosprecargados uploads/productosprecargados/

# Build JAR
RUN ./mvnw clean package -DskipTests -B

# Ensure JAR exists
RUN ls -la target/ && \
    test -f target/locuventas_backend-0.0.1-SNAPSHOT.jar || \
    (echo "JAR file not found!" && exit 1)

# ------------------- Runtime image -------------------

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy JAR
COPY --from=builder /app/target/locuventas_backend-0.0.1-SNAPSHOT.jar app.jar

# Copy only precargados; otros vienen del volumen
COPY --from=builder /app/uploads/productosprecargados uploads/productosprecargados/

# Crear otras carpetas (vienen montadas)
RUN mkdir -p uploads/imagesVendedores uploads/productos

# Añadir usuario no-root
RUN addgroup -S spring && adduser -S spring -G spring
RUN chown -R spring:spring /app
USER spring

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
