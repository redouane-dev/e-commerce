FROM node:14.11.0-stretch-slim

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
# For production
# RUN npm ci --only=production

COPY src/ ./src/

EXPOSE 8080

CMD ["node", "src/index.js"]