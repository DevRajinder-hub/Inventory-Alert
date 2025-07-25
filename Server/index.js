require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/products');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/', productRoutes);

app.listen(port, () => {
    console.log(`Private Shopify app running at http://localhost:${port}`);
});