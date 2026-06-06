# Project: Shopify Zero-Revenue-Loss Sentinel

**Goal:** An automated QA workflow integrating n8n, Playwright, and Vision LLMs to continuously monitor Shopify checkouts and promo codes.

## 🛠 Tech Stack

- **Automation/Orchestration:** n8n (Self-hosted/Docker)
- **Browser Automation:** Playwright (Node.js / plain JavaScript)
- **AI Integration:** OpenAI / Anthropic Vision APIs
- **Target Platform:** Shopify (Development Store)

## 📁 Project Structure

```
.
├── src/
│   └── sentinel.js        # Main QA orchestration script (CLI entry point)
├── tests/                 # Playwright test specs
├── scripts/               # One-off / utility scripts
├── screenshots/           # Captured on failure + key steps (gitignored)
├── workflows/             # Exported n8n workflow JSON
├── .env                   # Secrets — never commit
└── CLAUDE.md
```

## 💻 Common Commands

- Install dependencies: `npm install`
- Run Playwright tests headlessly: `npx playwright test`
- Run Playwright tests with UI: `npx playwright test --ui`
- Trigger custom QA script: `node src/sentinel.js`

### Verification (run before considering a change complete)

> Tooling is not yet set up — these are the intended commands once ESLint/Prettier are configured.

- Lint: `npx eslint .`
- Format check: `npx prettier --check .`
- Auto-fix formatting: `npx prettier --write .`

## 🔐 Secrets & Environment

- `.env` holds only secrets and connection details: store URL, store password, API keys. Never committed.
- Test scenario data — product handles, discount codes, test user info — lives in `config/test-data.js` and IS committed to version control. This is not secret; it describes the test.
- NEVER hardcode keys or scenario data in source. Reference via `process.env.*` (for `.env`) or import from `config/test-data.js`.
- Document any new `.env` var in `.env.example`.

## 🧠 Architectural Rules & Guidelines

### 1. Playwright Rules

- ALWAYS use explicit wait states (`waitForLoadState('networkidle')`) or wait for specific elements before interacting. Do NOT use hardcoded `page.waitForTimeout()`.
- Prioritize robust Locators (`getByRole`, `getByTestId`) over brittle CSS selectors or XPath.
- Always capture screenshots on failure and on key successful steps (Cart, Checkout). Save them to `/screenshots` with a timestamped filename.
- Tests use the Page Object Model. Page interactions (selectors, actions, waits) live in `tests/pages/*.js` as classes. Spec files in `tests/*.spec.js` only orchestrate page objects and assert — no raw `page.locator(...)` calls or selectors in spec files.
- For any new page object or test that interacts with elements you haven't already seen rendered, do NOT guess locators based on framework conventions (e.g. "Shopify Dawn typically uses..."). Instead, pause and ask the user for the actual HTML snippet or a working locator before writing the page object. Mark any locator that wasn't user-verified with a `// TODO: verify locator` comment.
- Do NOT guess locators based on framework conventions (e.g. "Shopify Dawn typically uses..."). Before writing any page object or test that interacts with elements, ask the user for the actual HTML snippet or a verified locator. This is a hard rule — if locators are uncertain, stop and ask, do not produce confident-looking guesses.

### 2. LLM & Vision Prompts

- System prompts for the Vision LLM must be strictly deterministic.
- Force the Vision LLM to return pure JSON (no markdown wrapping) so n8n can parse it without failing. Required format: `{"discount_applied": boolean, "ui_broken": boolean, "error_message": string}`.
- The Vision client targets a generic OpenAI-compatible endpoint via `VISION_BASE_URL`, `VISION_MODEL`, and `VISION_API_KEY` — not a specific provider's SDK. This keeps the provider swappable (LM Studio, OpenAI, others) without code changes.

### 3. n8n Integration Rules

- When writing n8n workflow JSON or webhook handlers, ensure clear error routing (e.g., if an HTTP request fails, route to a notification node — do not let the workflow crash silently).
- Assume Playwright scripts are triggered via the CLI / Execute Command node in n8n.
- Export and version workflow JSON under `/workflows`.

### 4. Conventions for Claude

- Place new files in the correct directory by role: tests in `/tests`, core logic in `/src`, utilities in `/scripts`.
- Match existing code style; once ESLint/Prettier are configured, conform to them.
- Prefer small, reviewable changes and explain any architectural decision in the summary.
- Implement one chunk from the build plan at a time. Stop after each chunk for verification before continuing. Do not chain multiple chunks in a single turn.
