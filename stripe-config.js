// Конфигурация Stripe для ZENOVO

// ВАЖНО: Замените на ваши реальные ключи Stripe
const STRIPE_CONFIG = {
    // Публичный ключ (можно безопасно использовать на фронтенде)
    publishableKey: 'pk_live_51RlYHeDnazw9b0QRsKskNKyj2uIhk6FKM0Dt8vryvB5A8m5li9fKMnwSOnmBUaQbfsuNaoVTiLQ6XSrx9bzzzSYy00QKhz8fOs',
    
    // API настройки
    apiUrl: 'http://localhost:3001', // Локальный сервер для тестирования
    
    // Настройки
    currency: 'eur',
    country: 'DE',
    
    // Методы оплаты
    paymentMethods: ['card', 'sepa_debit', 'giropay', 'sofort'],
    
    // Настройки доставки
    shipping: {
        freeShippingThreshold: 39.00,
        standardShipping: 4.99,
        expressShipping: 9.99
    }
};

// Инициализация Stripe
let stripe;
let elements;

// Функция инициализации Stripe
function initializeStripe() {
    if (typeof Stripe === 'undefined') {
        console.error('Stripe.js не загружен');
        return false;
    }
    
    stripe = Stripe(STRIPE_CONFIG.publishableKey);
    elements = stripe.elements({
        locale: 'de',
        fonts: [
            {
                cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
            }
        ]
    });
    
    return true;
}

// Стили для Stripe элементов
const stripeElementStyle = {
    base: {
        fontSize: '16px',
        color: '#374151',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        '::placeholder': {
            color: '#9CA3AF',
        },
        padding: '12px',
        backgroundColor: '#F9FAFB',
        border: '1px solid #D1D5DB',
        borderRadius: '8px',
    },
    invalid: {
        iconColor: '#EF4444',
        color: '#EF4444',
        borderColor: '#EF4444',
    },
    complete: {
        iconColor: '#10B981',
        borderColor: '#10B981',
    }
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { STRIPE_CONFIG, stripeElementStyle };
}