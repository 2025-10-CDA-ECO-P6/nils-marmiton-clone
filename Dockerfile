FROM node:22.14.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node src/config/db.js
EXPOSE 1337
CMD ["node", "src/app.js"]