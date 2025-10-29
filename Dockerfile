FROM node:24.11.0-alpine AS builder

ARG APP

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

COPY apps/${APP} ./apps/${APP}
COPY libs/ ./libs/

RUN npm install
RUN npm run build:${APP}

FROM node:24.11.0-alpine AS runtime

ARG APP
ENV APP=${APP}
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["sh", "-c", "node dist/apps/${APP}/src/app.js"]

