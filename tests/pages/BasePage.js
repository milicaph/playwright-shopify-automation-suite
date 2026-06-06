'use strict';

class BasePage {
  constructor(page) {
    this.page = page;
  }

  // Navigate to a URL and wait for the network to settle.
  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  // Navigate to a URL and wait for a specific element to be visible instead
  // of relying solely on networkidle. Prefer this when the landmark element
  // is known — it's faster and more reliable than a blanket network wait.
  async gotoAndWaitFor(url, locator) {
    await this.page.goto(url);
    await locator.waitFor({ state: 'visible' });
  }

  // Wait for the network to settle after an action that triggers navigation
  // (e.g. a form submit or link click that doesn't use page.goto).
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  // Element-based waits — use these instead of waitForTimeout.
  async waitForVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async waitForHidden(locator) {
    await locator.waitFor({ state: 'hidden' });
  }
}

module.exports = { BasePage };
