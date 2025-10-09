FROM node:20

# Сервер
WORKDIR /server/app
COPY server/app/package*.json ./
RUN npm install
COPY server/app ./

# Клиент
WORKDIR /server/client
COPY server/client/package*.json ./
RUN npm install
COPY server/client/ ./
RUN npm run build

# Возвращаемся к серверу
WORKDIR /server/app

EXPOSE 5000

CMD ["node", "server.js"]k
