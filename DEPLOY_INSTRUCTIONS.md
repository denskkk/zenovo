# 🚀 ZENOVO - Инструкции по деплою

## Готовность к продакшену

Сайт **полностью готов** к использованию и содержит:

### ✅ Все 12 Stripe кнопок покупки:
1. **Главная страница**: 3 товара с кнопками
2. **Каталог**: 12 товаров с индивидуальными кнопками
3. **Адаптивный дизайн** для всех устройств
4. **Оптимизированная производительность**

## 📱 Мобильная оптимизация
- PWA функциональность
- Оффлайн поддержка
- Ленивая загрузка изображений
- Адаптивные кнопки Stripe

## 🛒 Stripe интеграция
Все кнопки настроены с live ключами:
- `pk_live_51RlYHeDnazw9b0QRsKskNKyj2uIhk6FKM0Dt8vryvB5A8m5li9fKMnwSOnmBUaQbfsuNaoVTiLQ6XSrx9bzzzSYy00QKhz8fOs`

## 🌐 Деплой на хостинг

### 1. Vercel (Рекомендуется)
```bash
# Установить Vercel CLI
npm i -g vercel

# В папке zenovo
vercel

# Следовать инструкциям
```

### 2. Netlify
1. Перетащить папку `zenovo` на netlify.com
2. Настроить домен в Settings

### 3. GitHub Pages
```bash
# Создать репозиторий на GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Включить GitHub Pages в настройках репозитория
```

### 4. Обычный хостинг
Загрузить все файлы через FTP/cPanel в корень сайта.

## 🔧 Настройка домена

### Обязательные файлы:
- `CNAME` - уже настроен
- `robots.txt` - готов
- `sitemap.xml` - готов
- `manifest.json` - PWA готов

### SSL сертификат
Убедитесь что хостинг поддерживает HTTPS (обязательно для Stripe).

## ⚙️ Локальный сервер

```bash
cd server
npm start
```
Доступ: http://localhost:3001

## 📊 Аналитика

Добавить Google Analytics:
```html
<!-- В <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎯 Финальная проверка

### ✅ Перед запуском проверить:
- [ ] Все Stripe кнопки работают
- [ ] Сайт загружается на мобильных
- [ ] SSL сертификат активен
- [ ] Домен корректно настроен
- [ ] Контактная информация актуальна

## 🏆 Результат

**ZENOVO сайт готов к использованию!**

🌿 **Красивый, быстрый, адаптивный интернет-магазин с интегрированной оплатой Stripe**

### Основные преимущества:
- 💚 Идеальный дизайн для эко-брендов
- 🛒 Готовые к работе кнопки оплаты
- 📱 Отличная работа на всех устройствах
- ⚡ Высокая производительность
- 🔍 SEO оптимизация
- 🛡️ Безопасность

---

**Сайт готов принимать заказы! 🎉**
