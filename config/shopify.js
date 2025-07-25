require('dotenv').config();
const { shopifyApi, LATEST_API_VERSION, Session } = require('@shopify/shopify-api');
const { restResources } = require('@shopify/shopify-api/rest/admin/2024-07');
require('@shopify/shopify-api/adapters/node');

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
    apiVersion: LATEST_API_VERSION,
    isPrivateApp: true,
    scopes: ['read_products', 'write_products'],
    restResources,
    hostName: 'localhost:3000', // Replace with your ngrok/production URL if needed
});

module.exports = { shopify, Session };