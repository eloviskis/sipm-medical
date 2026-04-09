# Etapa 1: Build da aplicação (compilação TypeScript + JavaScript)
FROM node:20.14.0 AS build

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências de desenvolvimento e build
RUN npm install

# Copia o restante dos arquivos, incluindo TypeScript e JavaScript
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Etapa 2: Imagem final para execução
FROM node:20.14.0

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos compilados do TypeScript e os arquivos JavaScript originais
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/src/*.js ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

# Exponha a porta que o aplicativo irá rodar
EXPOSE 8080

# Comando para iniciar o aplicativo
CMD ["node", "dist/server.js"]
