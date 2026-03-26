FROM node:18-alpine

# Instala Chromium e dependências pelo apk (muito mais leve que apt)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    udev

# No Alpine o binário se chama chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm install

# Gera o Prisma client
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]