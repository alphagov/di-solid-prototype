FROM node:16.16.0-alpine as builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN npm ci && npm run build && rm -rf node_modules && npm ci --production

FROM node:16.16.0-alpine as final
WORKDIR /app
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules/ node_modules
COPY --chown=node:node --from=builder /app/dist/ dist

ENV NODE_ENV "production"

EXPOSE 3000
USER node
CMD ["npm", "start"]
