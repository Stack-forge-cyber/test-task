FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm ci
COPY server/tsconfig.json server/tsconfig.json
COPY server/src server/src
RUN npm run build -w server

FROM node:24-bookworm-slim
ENV NODE_ENV=production APP_PORT=3000
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm ci --omit=dev --workspace=server --include-workspace-root=false && npm cache clean --force
COPY --from=build /app/server/dist server/dist
USER node
EXPOSE 3000
CMD ["node", "server/dist/www.js"]
