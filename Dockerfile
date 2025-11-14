FROM node:22.14.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node src/config/db.js
RUN npm cache clean --force
FROM node:22.14.0-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 1337
CMD ["node", "src/app.js"]