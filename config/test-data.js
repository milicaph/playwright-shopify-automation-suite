'use strict';

/**
 * Test scenario data — not secrets, safe to commit.
 * Edit these values to match your Shopify dev store's test fixtures.
 */
module.exports = {
  productHandle: 'the-collection-snowboard-hydrogen', // URL slug of the product used in QA flows
  productTitle: 'The Collection Snowboard: Hydrogen', // Display title matching productHandle

  discountCode: 'SENTINEL10', // A valid discount code that should apply successfully

  badDiscountCode: 'INVALID_CODE_XYZ', // Intentionally invalid — used for failure-path tests
};
