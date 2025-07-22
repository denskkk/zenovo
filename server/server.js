const express = require('express');
const stripe = require('stripe');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe with secret key
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:8000', 'http://127.0.0.1:8000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create Payment Intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', customerData, orderData } = req.body;

    // Validate required fields
    if (!amount || amount < 50) { // Minimum 50 cents
      return res.status(400).json({ 
        error: 'Invalid amount. Minimum amount is 50 cents.' 
      });
    }

    if (!customerData || !customerData.email) {
      return res.status(400).json({ 
        error: 'Customer email is required.' 
      });
    }

    // Create or retrieve customer
    let customer;
    try {
      const existingCustomers = await stripeInstance.customers.list({
        email: customerData.email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripeInstance.customers.create({
          email: customerData.email,
          name: customerData.name,
          phone: customerData.phone,
          address: customerData.address ? {
            line1: customerData.address.line1,
            line2: customerData.address.line2,
            city: customerData.address.city,
            postal_code: customerData.address.postal_code,
            country: customerData.address.country || 'DE'
          } : undefined
        });
      }
    } catch (customerError) {
      console.error('Customer creation error:', customerError);
      return res.status(500).json({ 
        error: 'Failed to create customer record.' 
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderData?.orderId || `order_${Date.now()}`,
        customerEmail: customerData.email,
        customerName: customerData.name || '',
        orderData: JSON.stringify(orderData || {})
      },
      description: `ZENOVO Order - ${orderData?.items?.length || 0} items`,
      shipping: customerData.address ? {
        name: customerData.name,
        address: {
          line1: customerData.address.line1,
          line2: customerData.address.line2,
          city: customerData.address.city,
          postal_code: customerData.address.postal_code,
          country: customerData.address.country || 'DE'
        }
      } : undefined
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      orderId: paymentIntent.metadata.orderId
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while creating the payment intent.' 
    });
  }
});

// Webhook endpoint for Stripe events
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Here you can:
        // - Update your database
        // - Send confirmation email
        // - Update inventory
        // - Create shipment
        await handleSuccessfulPayment(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        await handleFailedPayment(failedPayment);
        break;

      case 'customer.created':
        const customer = event.data.object;
        console.log('New customer created:', customer.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
});

// Handle successful payment
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const metadata = paymentIntent.metadata;
    const orderData = JSON.parse(metadata.orderData || '{}');
    
    console.log('Processing successful payment:', {
      orderId: metadata.orderId,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      customer: metadata.customerEmail
    });

    // Here you would typically:
    // 1. Update your database with the order
    // 2. Send confirmation email
    // 3. Update inventory
    // 4. Create shipping label
    
    // Example: Log the successful order (replace with your database logic)
    console.log('Order completed successfully:', {
      orderId: metadata.orderId,
      customerEmail: metadata.customerEmail,
      customerName: metadata.customerName,
      amount: paymentIntent.amount / 100,
      items: orderData.items || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Handle failed payment
async function handleFailedPayment(paymentIntent) {
  try {
    console.log('Payment failed:', {
      orderId: paymentIntent.metadata.orderId,
      error: paymentIntent.last_payment_error?.message || 'Unknown error'
    });

    // Here you would typically:
    // 1. Log the failed payment
    // 2. Send notification to customer
    // 3. Update order status

  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

// Get payment status
app.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ error: 'Failed to retrieve payment status' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ZENOVO Payment Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💳 Stripe configured: ${process.env.STRIPE_SECRET_KEY ? '✅' : '❌'}`);
});

module.exports = app;
