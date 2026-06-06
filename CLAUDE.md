## 💻 Common Commands
- Install dependencies: `npm install`
- Run Playwright tests headlessly: `npx playwright test`
- Run Playwright tests with UI: `npx playwright test --ui`
- Trigger custom QA script: `node src/sentinel.js` (Phase 4+)

### Verification (run before considering a change complete)
- Lint: `npm run lint`
- Format check: `npm run format:check`
- Auto-fix formatting: `npm run format`

## 🔐 Secrets & Environment
- `.env` holds only secrets and connection details: store URL, store password, API keys / endpoints. Never committed.
- Test scenario data — product handles, product titles, discount codes, test user info — lives in `config/test-data.js` and IS committed to version control. This is not secret; it describes the test.
- NEVER hardcode keys or scenario data in source. Reference via `process.env.*` (for `.env`) or import from `config/test-data.js`.
- Document any new `.env` var in `.env.example`.

## 🧠 Architectural Rules & Guidelines

### 1. Playwright Rules
- Tests use the Page Object Model. Page interactions (selectors, actions, waits) live in `tests/pages/*.js` as classes. Spec files in `tests/*.spec.js` only orchestrate page objects and assert — no raw `page.locator(...)` calls or selectors in spec files.
- Do NOT guess locators based on framework conventions (e.g. "Shopify Dawn typically uses..."). Before writing any page object or test that interacts with elements, ask the user for the actual HTML snippet or a verified locator. This is a hard rule — if locators are uncertain, stop and ask, do not produce confident-looking guesses. If a locator must be written without user verification (rare exception), mark it with a `// TODO: verify locator` comment.
- ALWAYS use explicit wait states (`waitForLoadState('networkidle')`, `waitForURL`, element-based waits) before interacting. Do NOT use `page.waitForTimeout()`.
- Locator priority on storefront elements: `getByTestId` first (for elements with `data-testid`), then `getByRole` / `getByLabel`, then text-based locators. Avoid CSS selectors and XPath.
- Locator priority on checkout elements: `getByRole` / `getByLabel` only. Do NOT add `data-testid` to checkout — it's Shopify-hosted and the Sentinel must monitor it as a real customer experiences it.
- Always capture screenshots on failure and on key successful steps (Cart, Checkout). Save them to `/screenshots` with a timestamped filename via the `takeScreenshot` helper.

### 2. Test Attribute Convention (Storefront Only)
- `data-testid` attributes are added to **storefront theme elements** (Liquid templates) where the project controls the source — e.g. add-to-cart button, cart drawer, cart drawer checkout button.
- `data-testid` is NOT added to checkout-page elements. Checkout is Shopify-hosted, and the Sentinel must use the same semantic locators a customer-experienced selector would resolve to. This keeps the tool generalizable to any Shopify store, not just one with custom test instrumentation.
- Naming: kebab-case, descriptive of the element's role, not its position or styling. Examples: `data-testid="add-to-cart"`, `data-testid="cart-drawer"`, `data-testid="cart-drawer-checkout"`. Avoid `data-testid="btn-1"` or `data-testid="main-cta"`.
- When adding a new `data-testid`, record it (location in theme, purpose) in a brief comment in the corresponding Page Object.

### 3. LLM & Vision Prompts
- The Vision client targets a generic OpenAI-compatible endpoint via `VISION_BASE_URL`, `VISION_MODEL`, and `VISION_API_KEY` — not a specific provider's SDK. This keeps the provider swappable (LM Studio, OpenAI, others) without code changes.
- System prompts for the Vision LLM must be strictly deterministic.
- Force the Vision LLM to return pure JSON (no markdown wrapping) so n8n can parse it without failing. Required format: `{"discount_applied": boolean, "ui_broken": boolean, "error_message": string}`.

### 4. n8n Integration Rules
- When writing n8n workflow JSON or webhook handlers, ensure clear error routing (e.g., if an HTTP request fails, route to a notification node — do not let the workflow crash silently).
- Assume Playwright scripts are triggered via the CLI / Execute Command node in n8n.
- Export and version workflow JSON under `/workflows`.

### 5. Conventions for Claude
- Place new files in the correct directory by role: tests in `/tests`, page objects in `/tests/pages`, core logic in `/src`, utilities in `/scripts`, test scenario data in `/config`.
- Implement one chunk from the build plan at a time. Stop after each chunk for verification before continuing. Do not chain multiple chunks in a single turn.
- Match existing code style; conform to ESLint and Prettier configs.
- Prefer small, reviewable changes. Explain any architectural decision in the summary.