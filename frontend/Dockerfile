FROM node:18-alpine as build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости и добавляем недостающие пакеты
RUN npm install && \
    npm install axios react-toastify --save

# Копируем исходный код
COPY . .

# Запускаем сборку
RUN npm run build

# Используем nginx для раздачи статики
FROM nginx:1.23-alpine

# Копируем собранные файлы из build-образа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx в foreground
CMD ["nginx", "-g", "daemon off;"]