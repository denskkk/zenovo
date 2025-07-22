#!/bin/bash

echo "🚀 Запуск ZENOVO Payment Server..."
echo

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
    echo
fi

if [ ! -f ".env" ]; then
    echo "⚠️  Файл .env не найден!"
    echo "Скопируйте .env.example в .env и настройте ваши Stripe ключи"
    exit 1
fi

echo "💳 Проверка Stripe конфигурации..."
if ! grep -q "sk_live" .env; then
    echo "❌ STRIPE_SECRET_KEY не настроен в .env файле"
    echo "Пожалуйста, добавьте ваши реальные Stripe ключи"
    exit 1
fi

echo "✅ Конфигурация корректна"
echo "🌐 Запуск сервера на порту 3001..."
echo
echo "Для остановки нажмите Ctrl+C"
echo

npm start
