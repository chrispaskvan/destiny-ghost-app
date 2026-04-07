# Destiny Ghost App

Modern Astro + React frontend with Express API backend, using nginx reverse proxy for local HTTPS development.

## Quick Start

### ✅ Working Setup

The development environment is now properly configured for HTTPS through nginx proxy.

### Current Status:
- **Nginx proxy**: Running on port 443 (HTTP proxy, not SSL)
- **Frontend**: Astro running on port 8443 (HTTPS internally)
- **API**: Express should run on different port (not 443) since nginx uses 443

### Commands:
```bash
# Start nginx proxy (port 443)
npm run proxy:start

# Start frontend (port 8443) 
npm run dev

# Make sure your API runs on port 1100 (HTTP) or another port
# Then access via:
# Frontend: http://app2.destiny-ghost.com:443
# API: http://api2.destiny-ghost.com:443
```

### ⚠️ Important Setup Notes:

1. **Your Express API must run on port 1100 (HTTP)** - not port 443
2. **Nginx proxy uses port 443** - both domains route through nginx
3. **Use HTTP for development** - SSL certificates have Docker mounting issues on macOS

### Alternative: Use HTTP on port 80
If you prefer, you can use the HTTP version on port 80:
```bash
npm run proxy:start-no-ssl  # Uses port 80
# Access: http://app2.destiny-ghost.com, http://api2.destiny-ghost.com
```

## Troubleshooting

If you see Docker mount errors, check `DOCKER_SETUP.md` for solutions.

## Access URLs

- Frontend: https://app2.destiny-ghost.com (via proxy) or https://127.0.0.1:8443 (direct)
- API: https://api2.destiny-ghost.com (via proxy) or https://127.0.0.1:443 (direct)

## Available Scripts

### Main Development
- `npm run dev:full` - Start nginx proxy and Astro dev server
- `npm run dev` - Start only the Astro dev server (port 8443)

### Nginx Proxy Management  
- `npm run proxy:start` - Start nginx reverse proxy
- `npm run proxy:stop` - Stop nginx reverse proxy
- `npm run proxy:restart` - Restart nginx reverse proxy
- `npm run proxy:logs` - View nginx logs

### Build & Test
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```
├── src/                    # Astro source code
│   ├── components/         # React components
│   ├── layouts/           # Astro layouts
│   ├── pages/             # Astro pages
│   ├── services/          # API services
│   └── hooks/             # React hooks
├── nginx/                 # Nginx configuration
│   ├── nginx.conf         # Nginx config file
│   ├── docker-compose.yml # Docker setup for nginx
│   └── README.md          # Nginx setup docs
├── security/              # SSL certificates
└── dev.sh                 # Development script
```

## Prerequisites

1. **Docker** - For running nginx reverse proxy
2. **Node.js** - For running the Astro development server
3. **SSL Certificates** - Place wildcard certificates in `security/` folder
4. **Express API** - Should run on port 443 with HTTPS

## Development Workflow

1. **Start the proxy**: `npm run proxy:start`
2. **Start your Express API** on port 443 with HTTPS
3. **Start the frontend**: `npm run dev`
4. **Access via custom domains** through the nginx proxy

## Configuration

- **Frontend**: Runs on port 8443, accessible via app2.destiny-ghost.com
- **API**: Runs on port 443, accessible via api2.destiny-ghost.com  
- **Nginx**: Runs in Docker, proxies both services on port 443

See `nginx/README.md` for detailed nginx configuration.
