### base image
# Create an intermediate image for build speed with production dependencies
FROM node:16-alpine as base

RUN mkdir -p /home/wa-js-api-server && \
	mkdir -p /home/wa-js-api-server/logs

WORKDIR /home/wa-js-api-server

ENV NODE_ENV=production

COPY package.json package-lock.json LICENSE ./

RUN npm set-script prepare "" && \
	npm install --production && \
	npm cache clean --force


### build image
# Create an image to only build the package and copy to final image
FROM base as build

WORKDIR /home/wa-js-api-server

COPY package.json package-lock.json ./

# install the devDependencies
RUN npm set-script prepare "" && \
	npm install --production=false

COPY . .

RUN npm run build


### final image
FROM base

LABEL version="1.0.0" description="WPPConnectLinkPreview" maintainer="Alan Martines<alancpmartines@hotmail.com>"

WORKDIR /home/wa-js-api-server

COPY --from=build /home/wa-js-api-server/dist /home/wa-js-api-server/dist/

EXPOSE 8000/tcp

CMD [ "node", "--trace-warnings", "dist/server.js" ]

## Acessar bash do container
# docker exec -it <container id> /bin/sh
# docker exec -it <container id> /bin/bash

## Logs do container
# docker logs -f --tail 1000 WPPconnectLinkPreview

## Removendo todos os containers e imagens de uma só vez
# docker rm $(docker ps -qa)

## Removendo todas as imagens de uma só vez
# docker rmi $(docker images -aq)

## Removendo imagens
# docker rmi <REPOSITORY>
# docker rmi <IMAGE ID>

## Como obter o endereço IP de um contêiner Docker do host
# https://stack.desenvolvedor.expert/appendix/docker/rede.html
# docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <IMAGE ID>
