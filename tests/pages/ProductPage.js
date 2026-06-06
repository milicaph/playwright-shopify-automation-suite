'use strict';

const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    // Checkout button inside the side-cart drawer — visible only after a successful add
    this.cartDrawerCheckoutButton = page.getByRole('button', { name: 'Check out' });
  }

  async navigateTo(storeUrl, handle) {
    await this.goto(`${storeUrl}/products/${handle}`);
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.waitForVisible(this.cartDrawerCheckoutButton);
  }

  // Returns a locator for the product title link inside the cart drawer.
  cartItemTitle(productTitle) {
    return this.page.getByRole('link', { name: productTitle });
  }

  // Returns a locator for the quantity input inside the cart drawer.
  cartItemQuantity(productTitle) {
    return this.page.getByLabel(`Quantity for ${productTitle}`);
  }

  async clickCheckout() {
    await this.cartDrawerCheckoutButton.click();
    await this.page.waitForURL(/checkouts/);
  }
}

module.exports = { ProductPage };
