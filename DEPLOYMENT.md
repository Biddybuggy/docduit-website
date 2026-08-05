# Deployment: dev + prod on Vercel

Docduit runs as a **single Vercel project** with two environments:

| Environment | Git branch | URL | How it deploys |
| --- | --- | --- | --- |
| Production | `master` | https://docduit.vercel.app | Only via **Promote to Production** (manual) |
| Development | `dev` | https://dev.docduit.vercel.app | Automatically on every push to `dev` |

Both environments **share the same env vars** (Firebase, backend, OpenAI, secrets) — except `NEXTAUTH_URL` (see below). Because dev shares prod credentials, **dev activity reads and writes real production data.** Keep this in mind while testing.

---

## The golden rule

**Never push directly to `master`.** All work lands on `dev`; production is reached only by promoting a dev deployment. Pushing to `master` would deploy straight to production and bypass the approval gate.

---

## Day-to-day workflow

1. Do your work on the `dev` branch and push it:
   ```bash
   git push github dev
   ```
2. Vercel builds a preview automatically. Open **https://dev.docduit.vercel.app** and verify the change on a real hosted URL.
3. When it looks good, promote it to production:
   - Vercel dashboard → the project → **Deployments**
   - Open the `dev` deployment you just verified
   - Click **⋯ → Promote to Production**
   - Confirm. It now serves at **https://docduit.vercel.app**.

   This click is the manual approval gate.

### Keep `master` in sync (recommended housekeeping)

"Promote to Production" serves the promoted build on the prod domain but **does not move the `master` branch pointer** — so `master` can drift from what's actually live. After a successful promote, fast-forward `master` to the promoted commit so it stays the source of truth:

```bash
git push github dev:master   # fast-forwards master to dev's tip
```

(Or open a `dev → master` PR and merge it. Either way, do this only after the promote, and only when `dev` is exactly what you promoted.)

---

## One-time Vercel setup

### 1. Domain
Project → Settings → **Domains** → add `dev.docduit.vercel.app` and assign it to **Git branch → `dev`**. Leave `docduit.vercel.app` assigned to the Production branch (`master`).

### 2. Env vars must include the Preview scope
Promote reuses the **existing (preview-built) deployment** — it does not rebuild with production env vars. So every var the build needs must be present for the **Preview** scope too, not just Production. The simplest way: set each var's scope to **All Environments** (Production + Preview + Development).

Verify the whole set from `.example-env` is enabled for Preview (Firebase `NEXT_PUBLIC_FIREBASE_*`, `AI_CHAT_URL`, `CHAT_DEMO_CF_WORKER_URL`, `OPENAI_*`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, `SMTP_*`, etc.).

### 3. `NEXTAUTH_URL` — the one per-scope exception
`src/services/auth.ts` builds Google's OAuth callback origin from `NEXTAUTH_URL`. It must differ by environment, or sign-in on dev will redirect to prod:

| Scope | Value |
| --- | --- |
| Production | `https://docduit.vercel.app` |
| Preview | `https://dev.docduit.vercel.app` |

Set it as two separate values (do **not** mark it "All Environments" with a single value).

### 4. Production Branch
Confirm Settings → Git → **Production Branch** is `master` (unchanged).

---

## One-time Google OAuth setup

On the OAuth 2.0 Client used for sign-in (Google Cloud Console → APIs & Services → Credentials), **add** (keep the existing prod entries):

- Authorized JavaScript origin: `https://dev.docduit.vercel.app`
- Authorized redirect URI: `https://dev.docduit.vercel.app/api/auth/callback/google`

---

## The DEV badge

A small **DEV** badge renders on any non-production host (dev alias, Vercel preview URLs, `localhost`) and is hidden on `docduit.vercel.app`. It is decided at **runtime from the hostname** (`src/components/shared/env-banner.tsx`), so it stays correct even when a preview build is promoted to production. When you add a custom production domain later, add it to `PRODUCTION_HOSTS` in that file.

---

## Sanity checks

- Push a trivial commit to `dev` → it deploys **only** to `dev.docduit.vercel.app`; production is unchanged until you promote.
- On `dev.docduit.vercel.app` the DEV badge shows and Google sign-in completes (confirms the Preview `NEXTAUTH_URL` + Google redirect URI).
- After Promote → `docduit.vercel.app` works and the DEV badge is **hidden**.
