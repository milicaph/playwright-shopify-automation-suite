'use strict';

require('dotenv').config();

// Connection/secret vars that must be present in .env
const REQUIRED_VARS = ['SHOPIFY_STORE_URL', 'VISION_BASE_URL', 'VISION_MODEL', 'VISION_API_KEY'];

function validateConfig() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join('\n  ')}\n` +
        `Copy .env.example to .env and fill in the values.`
    );
  }
}

validateConfig();

module.exports = {
  shopify: {
    storeUrl: process.env.SHOPIFY_STORE_URL,
    storePassword: process.env.SHOPIFY_STORE_PASSWORD || null,
  },
  vision: {
    baseUrl: process.env.VISION_BASE_URL,
    model: process.env.VISION_MODEL,
    apiKey: process.env.VISION_API_KEY,
  },
};
