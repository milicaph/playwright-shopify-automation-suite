'use strict';

const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    // <section aria-label="Shopping cart"> — order summary on the right
    this.cartSummary = page.getByRole('region', { name: 'Shopping cart' });
    // <div role="table" aria-labelledby="...">Cost summary</div>
    this.costTable = page.getByRole('table', { name: 'Cost summary' });
  }

  // Product title <p> scoped to the cart summary region
  lineItem(productTitle) {
    return this.cartSummary.getByText(productTitle);
  }

  // Finds the row whose rowheader is "Subtotal" and returns the adjacent cell
  subtotal() {
    return this.costTable
      .getByRole('row')
      .filter({ has: this.page.getByRole('rowheader', { name: 'Subtotal' }) })
      .getByRole('cell');
  }
}

module.exports = { CheckoutPage };
