FROM node:16.14-slim

LABEL version="1.0.0" description="WPPConnectLinkPreview" maintainer="Alan Martines<alancpmartines@hotmail.com>"

RUN mkdir -p /home/wa-js-api-server

WORKDIR /home/wa-js-api-server

RUN apt-get update && \
	apt-get upgrade -y && \
	apt-get install -y \
	git \
	curl \
	yarn \
	wget

COPY . .

RUN git pull && \
	npm install && \
	npm run build

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
