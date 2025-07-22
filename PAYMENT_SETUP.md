# ZENOVO - Настройка реальных платежей

## 🚀 Быстрый старт

### 1. Настройка Stripe

1. **Войдите в Stripe Dashboard**: https://dashboard.stripe.com/
2. **Получите ваши API ключи**:
   - Перейдите в Developers → API keys
   - Скопируйте Publishable key (pk_live_...)
   - Скопируйте Secret key (sk_live_...)

3. **Настройте Webhook**:
   - Перейдите в Developers → Webhooks
   - Нажмите "Add endpoint"
   - URL: `https://yourdomain.com/webhook`
   - События для прослушивания:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.created`
   - Скопируйте Webhook secret (whsec_...)

### 2. Настройка сервера

1. **Установите зависимости**:
```bash
cd server
npm install
```

2. **Настройте переменные окружения**:
```bash
# Скопируйте файл примера
cp .env.example .env

# Отредактируйте .env файл
```

3. **Обновите .env файл**:
```env
# Ваши реальные Stripe ключи
STRIPE_PUBLISHABLE_KEY=pk_live_your_real_key_here
STRIPE_SECRET_KEY=sk_live_your_real_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Настройки сервера
PORT=3001
NODE_ENV=production

# CORS (добавьте ваш домен)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

4. **Запустите сервер**:
```bash
npm start
```

### 3. Настройка клиентской части

1. **Обновите stripe-config.js**:
```javascript
const STRIPE_CONFIG = {
    publishableKey: 'pk_live_your_real_key_here',
    apiUrl: 'https://yourdomain.com', // URL вашего сервера
    // ... остальные настройки
};
```

### 4. Деплой

#### Сервер (Backend)
- Разместите сервер на платформе: Heroku, DigitalOcean, AWS, etc.
- Убедитесь, что переменные окружения настроены
- Настройте HTTPS (обязательно для Stripe)

#### Клиент (Frontend)
- Разместите HTML файлы на хостинге
- Обновите `apiUrl` в stripe-config.js на реальный URL сервера

### 5. Тестирование

#### Тестовые карты Stripe:
- **Успешная оплата**: 4242 4242 4242 4242
- **Требует аутентификации**: 4000 0025 0000 3155
- **Отклонена**: 4000 0000 0000 0002

Используйте любую будущую дату и любой CVC.

### 6. Безопасность

✅ **Важные моменты**:
- Никогда не используйте secret key на фронтенде
- Всегда валидируйте данные на сервере
- Используйте HTTPS в продакшене
- Настройте CORS правильно
- Логируйте все транзакции

### 7. Мониторинг

- Следите за webhook событиями в Stripe Dashboard
- Настройте логирование ошибок
- Мониторьте успешность платежей

## 🔧 Локальная разработка

1. **Запустите сервер**:
```bash
cd server
npm run dev
```

2. **Откройте фронтенд**:
- Запустите локальный сервер для HTML файлов
- Или просто откройте index.html в браузере

3. **Тестирование Webhook локально**:
```bash
# Установите Stripe CLI
stripe listen --forward-to localhost:3001/webhook

# Используйте полученный webhook secret в .env
```

## 📝 Что происходит при оплате

1. **Клиент заполняет форму** → данные отправляются на сервер
2. **Сервер создает Payment Intent** → возвращает client_secret
3. **Клиент подтверждает оплату** → Stripe обрабатывает платеж
4. **Webhook уведомляет сервер** → обновляется статус заказа
5. **Клиент получает подтверждение** → заказ завершен

## 🚨 Частые проблемы

- **CORS ошибки**: Убедитесь, что ваш домен добавлен в ALLOWED_ORIGINS
- **Webhook не работает**: Проверьте URL и secret в Stripe Dashboard
- **Платежи не проходят**: Проверьте правильность API ключей
- **Ошибка 404**: Убедитесь, что сервер запущен и доступен

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи сервера
2. Проверьте события в Stripe Dashboard
3. Убедитесь в правильности настроек

---

**Готово!** Ваш магазин теперь может принимать реальные платежи. 💳✨
