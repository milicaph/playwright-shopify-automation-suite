'use strict';

const { BasePage } = require('./BasePage');

class StorePage extends BasePage {
  constructor(page) {
    super(page);
    this.storeHeading = page.locator('h1.header__heading .h2');
    this.passwordInput = page.getByLabel('Password');
    this.enterButton = page.getByRole('button', { name: 'Enter' });
  }

  async open(storeUrl) {
    await this.goto(storeUrl);
  }

  async unlock(password) {
    if (await this.passwordInput.isVisible()) {
      await this.passwordInput.fill(password);
      await this.enterButton.click();
      await this.waitForNavigation();
    }
  }
}

module.exports = { StorePage };
