# TODO: Upgrade, pois 12 já atingiu EOL
FROM node:12.22.12

WORKDIR /webui

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8082

# TODO: Em 'production' o certo seria utilizar uma production build + webserver
ENTRYPOINT [ "npm" ]