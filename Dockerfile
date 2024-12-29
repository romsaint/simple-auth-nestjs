# Используем базовый образ Node.js
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем остальные файлы проекта
COPY . .

# Устанавливаем переменную окружения (опционально)
ENV ENVIRONMENT="prod"

# Открываем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["yarn", "start:prod"]