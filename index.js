require('dotenv').config();
const express = require('express');
const { shopifyApi, LATEST_API_VERSION, Session } = require('@shopify/shopify-api');
const { restResources } = require('@shopify/shopify-api/rest/admin/2024-07'); // Use the latest stable API version

// Ensure Node.js adapter is loaded
require('@shopify/shopify-api/adapters/node');

const app = express();
const port = process.env.PORT || 3000;

// Configure Shopify API
const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
    apiVersion: LATEST_API_VERSION,
    isPrivateApp: true,
    scopes: ['read_products', 'write_products'], // Add the scopes your app needs
    restResources, // Mount REST resources for easier access
    // Add the hostName here. For private apps, you can use a placeholder or your app's host.
    // If you're using ngrok, this would be your ngrok URL.
    // For local development without ngrok, a dummy value like 'localhost:3000' will suffice for validation.
    hostName: 'localhost:3000', // Or your ngrok URL, or your deployment URL
    // If you're using ngrok for webhooks, set it to your ngrok URL.
    // Example: hostName: 'your-ngrok-id.ngrok.io',
});

app.use(express.json());

app.get('/getproducts', async (req, res) => {
    try {
        const sessionId = shopify.session.getOfflineId(process.env.SHOPIFY_SHOP_NAME);
        const session = new Session({
            id: sessionId,
            shop: process.env.SHOPIFY_SHOP_NAME,
            state: 'state', 
            isOnline: false,
            accessToken: process.env.SHOPIFY_API_SECRET_KEY, 
        });

        const products = await shopify.rest.Product.all({ session: session });
			console.log(products)
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

// Example: Creating a product
app.post('/products', async (req, res) => {
    try {
        const sessionId = shopify.session.getOfflineId(process.env.SHOPIFY_SHOP_NAME);
        const session = new Session({
            id: sessionId,
            shop: process.env.SHOPIFY_SHOP_NAME,
            state: 'state',
            isOnline: false,
            accessToken: process.env.SHOPIFY_API_SECRET_KEY,
        });

        const product = new shopify.rest.Product({ session: session });
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

app.listen(port, () => {
    console.log(`Private Shopify app listening at http://localhost:${port}`);
});