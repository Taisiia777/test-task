FROM node:18-alpine as development

WORKDIR /usr/src/app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости и добавляем недостающие пакеты
RUN npm install && \
    npm install @nestjs/swagger class-validator uuid --save

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Продакшн-образ
FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Копируем файлы зависимостей (с добавленными новыми зависимостями)
COPY --from=development /usr/src/app/package*.json ./

# Устанавливаем только продакшн-зависимости
RUN npm ci --only=production

# Копируем собранное приложение из development-образа
COPY --from=development /usr/src/app/dist ./dist

# Запускаем приложение
CMD ["node", "dist/main"]