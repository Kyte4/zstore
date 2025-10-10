# Этап 1: client build
FROM node:20 AS client-build

WORKDIR /client

COPY server/client/package*.json ./

RUN npm install

COPY server/client/ ./

RUN npm run build

# Этап 2: server с build-клиентом

FROM node:20 AS server

WORKDIR /server/app

COPY server/app/package*.json ./

RUN npm install

COPY server/app/ ./

COPY --from=client-build /client/build ./client/build

EXPOSE 5000

CMD ["node", "server.js"]