FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy only Maven wrapper and pom first for caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Now copy the source and build
COPY src src
RUN ./mvnw clean package -DskipTests

# Switch to the target folder (where the JAR actually is)
WORKDIR /app/target

EXPOSE 8080
CMD ["java", "-jar", "starrynight-0.0.1-SNAPSHOT.jar"]
