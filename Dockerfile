# syntax=docker/dockerfile:1

# Build stage: install dependencies and generate production bundle
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies using npm. Copy only the files needed for dependency resolution first
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# Copy the remaining application files and build the production bundle
COPY . .
RUN npm run build

# Production stage: serve the static files with nginx
FROM nginx:1.27-alpine AS production

# Copy the built assets from the builder stage to nginx's default public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the default nginx port
EXPOSE 80

# Use the default nginx start command
CMD ["nginx", "-g", "daemon off;"]
