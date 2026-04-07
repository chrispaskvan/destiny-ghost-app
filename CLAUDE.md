# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend for the **Destiny Ghost** application — an Astro + React app integrating Bungie OAuth authentication. The frontend communicates with a separate Express API backend.

- Frontend dev server: port 1101
- API backend (external): port 1100 / `https://api2.destiny-ghost.com`
- Caddy reverse proxy: port 443 (local HTTPS via `dev:https`)

## Commands

```bash
# Development
npm run dev:https    # Start dev server with Caddy HTTPS proxy (local dev)

# Build & Production
npm run build        # Production build
npm run start:production  # Run production server

# Caddy proxy
npm run caddy:start  # Start Caddy proxy
npm run caddy:stop   # Stop Caddy proxy
npm run caddy:reload # Reload Caddy config

# Linting
npm run lint         # Lint src/ (JS, JSX, Astro)
npm run lint:fix     # Auto-fix lint issues
```

## Architecture

**Framework**: Astro 5 with React 19 islands and Tailwind CSS. All source files are plain JavaScript (no TypeScript).

### Request Flow

1. Astro pages (`src/pages/`) render the shell — static HTML with `client:load` directives for interactive React components
2. React components use hooks (`src/hooks/`) for state management
3. Hooks call services (`src/services/`) which make HTTP requests to the external API
4. API base URL is resolved from env vars (`VITE_API_BASE_URL`)

### Authentication Flow (Bungie OAuth)

1. `useAuth` hook fetches the Bungie sign-in URL via `authService`
2. User is redirected to Bungie OAuth
3. Bungie redirects to `/auth/callback` with `?code=xxx&state=yyy`
4. Server-side `callback.astro` makes a call to the API backend (`/users/signin/bungie`)
5. API sets `httpOnly` cookies; page redirects to home with `?auth=success` or `?error=`
6. `useAuth` hook detects the query params on mount and cleans up the URL

### Environment Variables

Configured in `.env.example`:

```
VITE_API_BASE_URL_DEV=https://api2.destiny-ghost.com
VITE_API_BASE_URL_PROD=https://api.destiny-ghost.com
VITE_API_BASE_URL=https://api2.destiny-ghost.com
```

### API Endpoints (`src/config/api.js`)

- **Auth**: `/users/signin/bungie`, `/users/current`
- **Destiny**: `/destiny/signIn`
- **User**: `/users/signout`

### Local HTTPS

Caddy is used as a local HTTPS reverse proxy. Config is in `Caddyfile`. Start with `npm run dev:https`.

### Key Files

| Path | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config — integrations, allowed hosts, port |
| `src/pages/index.astro` | Home page entry point |
| `src/pages/auth/callback.astro` | SSR OAuth callback handler |
| `src/components/Home.jsx` | Main UI with auth state |
| `src/hooks/useAuth.js` | Central auth state hook |
| `src/services/authService.js` | Auth service used by `useAuth` |
| `src/config/api.js` | API endpoint constants and base URL config |
