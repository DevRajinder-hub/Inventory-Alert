const express = require('express');
const router = express.Router();
const { shopify, Session } = require('../config/shopify');

// GET /getproducts
router.get('/getproducts', async (req, res) => {
    try {
        const sessionId = shopify.session.getOfflineId(process.env.SHOPIFY_SHOP_NAME);
        const session = new Session({
            id: sessionId,
            shop: process.env.SHOPIFY_SHOP_NAME,
            state: 'state',
            isOnline: false,
            accessToken: process.env.SHOPIFY_API_SECRET_KEY,
        });

        const products = await shopify.rest.Product.all({ session });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

// POST /products
router.post('/products', async (req, res) => {
    try {
        const sessionId = shopify.session.getOfflineId(process.env.SHOPIFY_SHOP_NAME);
        const session = new Session({
            id: sessionId,
            shop: process.env.SHOPIFY_SHOP_NAME,
            state: 'state',
            isOnline: false,
            accessToken: process.env.SHOPIFY_API_SECRET_KEY,
        });

        const product = new shopify.rest.Product({ session });
        product.title = req.body.title || "New Test Product";
        product.body_html = req.body.body_html || "This is a test product created via Node.js private app.";
        product.vendor = req.body.vendor || "My Company";
        product.product_type = req.body.product_type || "Test";
        product.status = "active";

        await product.save({ update: true });

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});

module.exports = router;