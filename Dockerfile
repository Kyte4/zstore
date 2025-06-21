FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Собираем клиент
WORKDIR /app/client
RUN npm install && npm run build

# Возвращаемся к серверу
WORKDIR /app

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]