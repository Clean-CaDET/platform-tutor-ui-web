# syntax=docker/dockerfile:1

FROM node:18.20.4-alpine3.19 AS frontBuild
WORKDIR /src
COPY . .
RUN apk --update --no-cache add gettext && \
    npm install
ARG SMART_TUTOR_API_URL
RUN ./docker/scripts/build-app.sh ${SMART_TUTOR_API_URL}

FROM nginx:1.21.6-alpine AS gatewayWithFront
COPY --from=frontBuild /app /usr/share/nginx/html/app
COPY ./docker/config/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/config/api_gateway.conf /etc/nginx/api_gateway.conf

FROM nginx:1.21.6-alpine AS gateway
COPY ./docker/config/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/config/api_gateway.conf /etc/nginx/api_gateway.conf
