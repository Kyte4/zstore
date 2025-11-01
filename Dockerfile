# Этап 1: сборка клиента
FROM node:20 AS client-build

WORKDIR /client

# копируем зависимости клиента
COPY server/client/package*.json ./

# Попробовать npm ci, fallback на npm install при ошибке
RUN npm ci || (echo "⚠️ npm ci failed, falling back to npm install..." && npm install)


# копируем конфигурационные файлы ESLint и Prettier
COPY .eslintrc.json .prettierrc.json ./

# копируем исходники и билдим
COPY server/client/ ./
RUN npm run build


# Этап 2: сервер с готовым билдом клиента
FROM node:20 AS server

WORKDIR /app

# копируем зависимости сервера
COPY server/app/package*.json ./

# Попробовать npm ci, fallback на npm install при ошибке
RUN npm ci || (echo "⚠️ npm ci failed, falling back to npm install..." && npm install)

# копируем конфигурационные файлы ESLint и Prettier
COPY .eslintrc.json .prettierrc.json ./

# копируем код сервера
COPY server/app/ ./

# копируем билд клиента
COPY --from=client-build /client/build ./client/build

EXPOSE 5000

CMD ["node", "server.js"]
