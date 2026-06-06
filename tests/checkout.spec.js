'use strict';

const { test, expect } = require('@playwright/test');
const { shopify } = require('../src/config');
const testData = require('../config/test-data');
const { StorePage } = require('./pages/StorePage');
const { ProductPage } = require('./pages/ProductPage');
const { CheckoutPage } = require('./pages/CheckoutPage');
const { takeScreenshot } = require('../scripts/screenshot');

test.describe('Shopify checkout', () => {
  let storePage;

  test.beforeEach(async ({ page }) => {
    storePage = new StorePage(page);
    await storePage.open(shopify.storeUrl);
    await storePage.unlock(shopify.storePassword);
    await takeScreenshot(page, 'store-loaded');
  });

  test('store loads and is accessible', async () => {
    await expect(storePage.storeHeading).toHaveText('storeulla');
  });

  test('full checkout flow', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.navigateTo(shopify.storeUrl, testData.productHandle);
    await productPage.addToCart();
    await takeScreenshot(page, 'cart-after-add');
    await expect(productPage.cartDrawerCheckoutButton).toBeVisible();
    await expect(productPage.cartItemTitle(testData.productTitle)).toBeVisible();
    await expect(productPage.cartItemQuantity(testData.productTitle)).toHaveValue('1');
    await productPage.clickCheckout();
    const checkoutPage = new CheckoutPage(page);
    await takeScreenshot(page, 'checkout-loaded');
    await expect(checkoutPage.lineItem(testData.productTitle)).toBeVisible();
    await expect(checkoutPage.subtotal()).toContainText(/\$[\d,.]+/);
  });
});
