
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');



const Product = require('../models/Product');
const upload = require('../multerConfig');
// Set admin layout for all admin routes
router.use((req, res, next) => {
    res.locals.layout = 'layouts/admin';
    next();
});

// Orders Management
router.get('/orders', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('admin/orders', { orders, layout: 'layouts/admin' });
});

// Mark order as Confirmed
router.post('/orders/:id/confirm', async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'Confirmed' });
    res.redirect('/admin/orders');
});

// Cancel order
router.post('/orders/:id/cancel', async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
    res.redirect('/admin/orders');
});

// Dashboard
router.get('/', (req, res) => {
    res.render('admin/dashboard');
});

// Product List
router.get('/products', async (req, res) => {
    const products = await Product.find();
    res.render('admin/products', { products });
});

// Add Product Form
router.get('/products/add', (req, res) => {
    res.render('admin/addProduct');
});

// Add Product (Create) with image upload
router.post('/products/add', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const image = req.file ? req.file.filename : '';
        await Product.create({ name, price, description, image, category });
        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).send('Error uploading product.');
    }
});

// Edit Product Form
router.get('/products/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('admin/editProduct', { product });
});

// Edit Product (Update)
router.post('/products/edit/:id', async (req, res) => {
    const { name, price, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, description });
    res.redirect('/admin/products');
});

// Delete Product
router.post('/products/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
});

module.exports = router;
