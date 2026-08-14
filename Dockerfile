FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src
USER appuser
CMD ["node", "src/services/api-gateway/server.js"]
