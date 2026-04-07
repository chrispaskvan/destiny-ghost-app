ARG NODE_VERSION=24.14.0

# Build stage
FROM node:${NODE_VERSION}-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

ARG VITE_API_BASE_URL=https://api.destiny-ghost.com
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Production stage
FROM node:${NODE_VERSION}-slim AS production

ENV NODE_ENV=production

LABEL org.opencontainers.image.source=https://github.com/chrispaskvan/destiny-ghost-app \
      org.opencontainers.image.licenses=MIT

ARG PORT=1101
ENV PORT=$PORT
ENV HOST=0.0.0.0

EXPOSE $PORT

RUN mkdir /destiny-ghost-app && chown -R node:node /destiny-ghost-app

WORKDIR /destiny-ghost-app

USER node

COPY --chown=node:node package.json package-lock.json* ./
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci --omit=dev

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --chown=node:node server.mjs ./

CMD ["npm", "run", "start:production"]
