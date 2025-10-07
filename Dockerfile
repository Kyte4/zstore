FROM node:20

# Рабочая директория для сервера
WORKDIR /app

# Копируем package.json и package-lock.json сервера
COPY package*.json ./

# Устанавливаем зависимости сервера
RUN npm install

# Копируем весь код сервера
COPY . .

# Переходим в папку клиента, собираем фронтенд
WORKDIR /app/client

# Копируем package.json и package-lock.json клиента
COPY client/package*.json ./

# Устанавливаем зависимости клиента
RUN npm install

# Копируем клиентский код
COPY client/ ./

# Собираем клиент
RUN npm run build

# Возвращаемся к серверу
WORKDIR /app

# Устанавливаем nodemon глобально (например, для dev)
RUN npm install -g nodemon

# Устанавливаем переменную среды
ENV NODE_ENV=production

# Открываем порт
EXPOSE 5000

# Запускаем сервер (при разработке лучше запускать через nodemon)
CMD ["nodemon", "server.js"]