'use strict';

const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots');

/**
 * Captures a PNG screenshot of the given Playwright page and saves it to /screenshots.
 * @param {import('@playwright/test').Page} page
 * @param {string} label  Short description used in the filename (e.g. 'cart', 'checkout-failure')
 * @returns {Promise<string>} Absolute path of the saved screenshot
 */
async function takeScreenshot(page, label) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  // ISO timestamp with colons replaced so the name is filesystem-safe on all OSes
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+$/, '');
  const safeName = label.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${timestamp}_${safeName}.png`;
  const filePath = path.join(SCREENSHOTS_DIR, filename);

  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

module.exports = { takeScreenshot };
