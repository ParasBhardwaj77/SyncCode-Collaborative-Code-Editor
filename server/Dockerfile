# Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Set directroy
WORKDIR /app

# Copy pom and fetch dependencies (improves cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Standard port for Spring Boot
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
