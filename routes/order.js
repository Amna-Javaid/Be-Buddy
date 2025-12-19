
const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const Order = require('../models/Order');
const checkCartNotEmpty = require('../middleware/checkCartNotEmpty');

// GET cart page
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
  }
  res.render('cart', { cart, total });
});

// GET checkout page
router.get('/checkout', checkCartNotEmpty, async (req, res) => {
  const cart = req.session.cart || [];
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
  }
  res.render('checkout', { cart, total });
});

// POST create order
router.post('/checkout', checkCartNotEmpty, async (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) {
    return res.redirect('/checkout');
  }
  const { customerName, email } = req.body;
  let total = 0;
  const cartItems = cart.map(item => {
    total += item.price * item.quantity;
    return {
      product: item._id,
      quantity: item.quantity,
      price: item.price
    };
  });
  try {
    const order = await Order.create({
      customerName,
      email,
      cartItems,
      totalAmount: total,
      status: 'Pending'
    });
    req.session.cart = [];
    res.redirect(`/order-confirmation/${order._id}`);
  } catch (err) {
    res.status(500).send('Error creating order.');
  }
});

// GET order confirmation
router.get('/order-confirmation/:orderId', async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).send('Order not found');
  res.render('orderConfirmation', { order });
});

module.exports = router;
