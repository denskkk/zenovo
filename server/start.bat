@echo off
echo 🚀 Запуск ZENOVO Payment Server...
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo 📦 Установка зависимостей...
    npm install
    echo.
)

if not exist ".env" (
    echo ⚠️  Файл .env не найден!
    echo Скопируйте .env.example в .env и настройте ваши Stripe ключи
    pause
    exit /b 1
)

echo 💳 Проверка Stripe конфигурации...
findstr "sk_live" .env >nul
if errorlevel 1 (
    echo ❌ STRIPE_SECRET_KEY не настроен в .env файле
    echo Пожалуйста, добавьте ваши реальные Stripe ключи
    pause
    exit /b 1
)

echo ✅ Конфигурация корректна
echo 🌐 Запуск сервера на порту 3001...
echo.
echo Для остановки нажмите Ctrl+C
echo.

npm start
