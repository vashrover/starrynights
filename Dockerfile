FROM openjdk:17-jdk-slim

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY src src
RUN ./mvnw clean package -DskipTests

EXPOSE 8080
CMD ["java", "-jar", "target/starrynight-0.0.1-SNAPSHOT.jar"]
