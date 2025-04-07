# ======================
#      Build Stage
# ======================
FROM maven:3.9.9-amazoncorretto-17-alpine AS build

ARG MAVEN_ARGS=""

# Copy Source Code
COPY . .
# Build war file
RUN mvn clean package $MAVEN_ARGS

# ======================
#       Run Stage
# ======================
FROM open-liberty:kernel-slim-java17-openj9 AS run

# Enable features
COPY --chown=1001:0 src/main/liberty/config/ /config/
RUN features.sh
# Copy build from build machine
COPY --from=build --chown=1001:0 target/*.war /config/apps/

RUN configure.sh