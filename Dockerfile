# Этап 1: сборка клиента
FROM node:20 AS client-build

WORKDIR /client

# копируем зависимости клиента
COPY server/client/package*.json ./
RUN npm ci

# копируем исходники и билдим
COPY server/client/ ./
RUN npm run build


# Этап 2: сервер с готовым билдом клиента
FROM node:20 AS server

WORKDIR /app

# копируем зависимости сервера
COPY server/app/package*.json ./
RUN npm ci

# копируем код сервера
COPY server/app/ ./

# копируем билд клиента
COPY --from=client-build /client/build ./client/build

EXPOSE 5000

CMD ["node", "server.js"]
