# Rodostoria Backend

NestJS API for Rodostoria. It handles authentication, member profiles, family relationships, media, sharing, billing, and admin workflows.

## Key capabilities

- Auth with JWT, email/password, and Google OAuth
- Family member CRUD and relationship management
- Member profiles, media uploads, and stories
- Global search and directory lookups
- Sharing requests and access controls
- Subscription billing with Stripe
- Contact and support messaging via Brevo
- Admin utilities

## Tech stack

- NestJS 11
- Prisma + PostgreSQL
- Passport (JWT, Local, Google)
- Brevo (email)
- Stripe billing

## Setup

```bash
npm install
```

Create a `.env` file in `backend/` with the following keys (values omitted here):

```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
MEDIA_ROOT=
FRONTEND_URL=
RECAPTCHA_SECRET_KEY=
RECAPTCHA_MIN_SCORE=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=
BREVO_REPLYTO_EMAIL=
BREVO_REPLYTO_NAME=
```

Admin access is now database-backed via the `User.isAdmin` boolean column.

## Database migrations

Run these commands from `backend/` after creating `.env` and setting
`DATABASE_URL` to the target PostgreSQL database.

```bash
# Apply existing migrations for local development and regenerate the Prisma client.
npx prisma migrate dev
npx prisma generate

# Inspect whether the database matches the migration history.
npx prisma migrate status
```

For a production or shared environment, apply only committed migrations:

```bash
npx prisma migrate deploy
```

Do not use `prisma migrate dev` against production. Create new migrations locally
with `npx prisma migrate dev --name <descriptive-name>`, review the generated
files under `prisma/migrations/`, then commit them before deploying.

## Run

```bash
# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

## Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## CI verification

No backend CI workflow is currently committed. Use the following commands for
the backend CI-equivalent check from `backend/`:

```bash
npm ci
npm run build
npm test -- --runInBand
```

Both `build` and `test` run `prisma generate` first, so CI must provide a valid
`DATABASE_URL` for Prisma configuration. Keep migrations committed and run
`npx prisma migrate deploy` separately in the deployment environment.

## Local development troubleshooting

- **Prisma generation or startup fails:** verify `DATABASE_URL` in `.env`, then
  run `npx prisma migrate dev` followed by `npm run prisma:generate`.
- **Database schema is out of date:** run `npx prisma migrate status` to check
  migration history; create new local migrations with
  `npx prisma migrate dev --name <descriptive-name>`.
- **Browser calls fail after starting the API:** confirm `FRONTEND_URL` matches
  the frontend development URL, restart the API, and verify the frontend uses
  the same backend port configured by `PORT`.
- **Uploads fail locally:** create the `MEDIA_ROOT` directory and grant the API
  process read/write access to it.

