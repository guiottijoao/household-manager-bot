# Usando a versão estável do Node no Debian Bullseye (mais compatível com Chrome)
FROM node:20-bullseye-slim

# Instala o Chromium e as dependências mínimas para o Puppeteer rodar
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Define variáveis de ambiente para o Puppeteer não baixar o Chrome de novo
# e apontar para o executável correto no Linux
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# Instala as dependências (incluindo o Prisma)
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Gera o Prisma Client para o ambiente Linux do Docker
RUN npx prisma generate

# Comando para iniciar a aplicação
CMD ["npm", "start"]