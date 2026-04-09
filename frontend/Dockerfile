# Use a imagem oficial do Node.js
FROM node:16  

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Construa a aplicação
RUN npm run build

# Instale o servidor http-server globalmente
RUN npm install -g http-server

# Exponha a porta que o http-server usará
EXPOSE 8080

# Comando para rodar o http-server na pasta build
CMD ["http-server", "build"]
