# Rodostoria Frontend

Angular UI for Rodostoria. It provides the family tree experience, onboarding, member profiles, sharing, subscriptions, and admin tools.

## Highlights

- Interactive family tree visualization
- Family onboarding and relationship management
- Member profiles, stories, favorites, achievements, media
- Global search and sharing requests
- Subscription and account settings
- Contact and support pages
- Multi-language UI

## Tech stack

- Angular 20
- PrimeNG UI and PrimeIcons
- ngx-translate for i18n
- Cytoscape for tree visualization
- Stripe.js for billing

## Setup

```bash
npm install
```

Update `frontend/src/environments/environment.ts`:

```
apiUrl: 'http://localhost:3000',
stripePublishableKey: 'pk_test_change_me',
recaptchaSiteKey: 'your_site_key'
```

## Run

```bash
npm start
```

Navigate to `http://localhost:4200`.

## Build

```bash
npm run build
```

## Tests

```bash
npm run test
```

## Local development troubleshooting

- **The UI cannot reach the API:** verify `apiUrl` in
  `src/environments/environment.ts` matches the running backend URL (normally
  `http://localhost:3000`). Start the backend separately and restart `npm start`
  after changing environment values.
- **Browser requests fail CORS:** set the backend `FRONTEND_URL` to
  `http://localhost:4200`, then restart the backend.
- **Port 4200 is already in use:** run `npm start -- --port <free-port>` and
  update backend `FRONTEND_URL` if the browser will call the API from that port.
- **End-to-end tests cannot launch a browser:** install Playwright browsers with
  `npx playwright install`, then run `npm run e2e`.
- **Headless tests are needed for a local CI-equivalent check:** run
  `npm run test:coverage`.

