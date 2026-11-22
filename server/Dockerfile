# 1단계: 빌드 환경 (Gradle 8.5 & JDK 17)
FROM gradle:8.5-jdk17-alpine AS builder
WORKDIR /app

# 의존성 캐싱을 위해 빌드 스크립트 먼저 복사
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon || true

# 소스 코드 복사 및 실행 가능한 JAR 빌드 (테스트 제외)
COPY src ./src
RUN gradle bootJar --no-daemon -x test

# 2단계: 런타임 환경 (초경량 JRE 17)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 빌드 산출물 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 타임존 설정 및 포트 노출
ENV TZ=Asia/Seoul
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
