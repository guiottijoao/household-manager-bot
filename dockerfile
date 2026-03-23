FROM node:20-bullseye

# Instala dependências do Chrome
RUN apt-get update && apt-get install -y \
  chromium \
  libglib2.0-0 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libx11-xcb1 \
  libxfixes3 \
  libxext6 \
  libx11-6 \
  libxcb1 \
  libxrender1 \
  libxi6 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
  wget \
  --no-install-recommends

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]