# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

FROM base AS build
COPY client/ ./client/
COPY server/ ./server/
RUN cd client && npm install && npm run build
RUN cd server && npm install

FROM base
COPY --from=build /app/server ./server
COPY --from=build /app/client/dist ./client/dist
ENV NODE_ENV="production"
EXPOSE 3003
CMD ["node", "server/index.js"]
