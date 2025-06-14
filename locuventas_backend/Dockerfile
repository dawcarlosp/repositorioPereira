# Multi-stage build for better optimization
FROM eclipse-temurin:17-jdk-alpine as builder

WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy project files
COPY pom.xml .
COPY src src

# Copy the productosprecargados images directly into build
COPY uploads/productosprecargados uploads/productosprecargados/

# Build the application
RUN mvn clean package -DskipTests -B

# Verify JAR was created
RUN ls -la target/ && \
    test -f target/locuventas_backend-0.0.1-SNAPSHOT.jar || \
    (echo "JAR file not found!" && exit 1)

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR file from builder stage
COPY --from=builder /app/target/locuventas_backend-0.0.1-SNAPSHOT.jar app.jar

# Copy the productosprecargados images from builder
COPY --from=builder /app/uploads/productosprecargados uploads/productosprecargados/

# Create directories for volume mounts (productos and vendedores)
RUN mkdir -p uploads/productos uploads/vendedores

# Add non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
RUN chown -R spring:spring /app
USER spring

EXPOSE 8080

# Health check for container monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]