const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// PRODUCT LIST WITH PAGINATION + FILTERS
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  const category = req.query.category;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  let query = {};

  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  res.render("products", {
    products,
    page,
    totalPages: Math.ceil(total / limit),
    category,
    minPrice,
    maxPrice
  });
});


// ADD TO CART
router.post('/add-to-cart', async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = parseInt(quantity) || 1;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');
    if (!req.session.cart) req.session.cart = [];
    // Check if already in cart
    const existing = req.session.cart.find(item => item._id == productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      req.session.cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: qty
      });
    }
    res.redirect('/products');
  } catch (err) {
    res.status(500).send('Error adding to cart');
  }
});

module.exports = router;
