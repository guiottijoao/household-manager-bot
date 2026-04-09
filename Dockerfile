FROM node:20-alpine

RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
