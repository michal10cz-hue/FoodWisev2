# syntax=docker/dockerfile:1.7

# ---------- build ----------
FROM node:24-alpine AS build
WORKDIR /app

ENV CI=true \
    GENERATE_SOURCEMAP=false \
    NODE_OPTIONS=--openssl-legacy-provider

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . ./
RUN npm run build

# ---------- runtime ----------
FROM nginx:1.27-alpine AS runtime

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
