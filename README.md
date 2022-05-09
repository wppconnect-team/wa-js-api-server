# WPPConnect/WA-JS API SERVER

[![npm version](https://img.shields.io/npm/v/@wppconnect/wa-js-api-server.svg?color=green)](https://www.npmjs.com/package/@wppconnect/wa-js-api-server)
[![Downloads](https://img.shields.io/npm/dm/@wppconnect/wa-js-api-server.svg)](https://www.npmjs.com/package/@wppconnect/wa-js-api-server)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/wppconnect-team/wa-js.svg)](https://isitmaintained.com/project/wppconnect/wa-js 'Average time to resolve an issue')
[![Percentage of issues still open](https://isitmaintained.com/badge/open/wppconnect-team/wa-js.svg)](https://isitmaintained.com/project/wppconnect/wa-js 'Percentage of issues still open')

[![Build Status](https://img.shields.io/github/workflow/status/wppconnect-team/wa-js/build.svg)](https://github.com/wppconnect-team/wa-js/actions/workflows/build.yml)
[![Build Status](https://img.shields.io/github/workflow/status/wppconnect-team/wa-js/test.svg)](https://github.com/wppconnect-team/wa-js/actions/workflows/test.yml)
[![Lint Status](https://img.shields.io/github/workflow/status/wppconnect-team/wa-js/lint.svg?label=lint)](https://github.com/wppconnect-team/wa-js/actions/workflows/lint.yml)
[![release-it](https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-release--it-e10079.svg)](https://github.com/release-it/release-it)

> WPPConnect/WA-JS API SERVER is a small api server to provide url preview for @wppconnect/wa-js library

## Our online channels

[![Discord](https://img.shields.io/discord/844351092758413353?color=blueviolet&label=Discord&logo=discord&style=flat)](https://discord.gg/JU5JGGKGNG)
[![Telegram Group](https://img.shields.io/badge/Telegram-Group-32AFED?logo=telegram)](https://t.me/wppconnect)
[![WhatsApp Group](https://img.shields.io/badge/WhatsApp-Group-25D366?logo=whatsapp)](https://chat.whatsapp.com/C1ChjyShl5cA7KvmtecF3L)
[![YouTube](https://img.shields.io/youtube/channel/subscribers/UCD7J9LG08PmGQrF5IS7Yv9A?label=YouTube)](https://www.youtube.com/c/wppconnect)

## How does it work

This project generate PNG images from JSON respose for URL preview.

## Starting

Steps to run locally:

```bash
# checkout the project
git clone https://github.com/wppconnect-team/wa-js-api-server.git

# enter in the folder
cd wa-js-api-server

# if you want to get the updates
git pull

# install the depencencies
npm install

# build javascript files
npm run build

# if you want to change some configuration, you can set en ENVIRONMENT variables or copy the .env to .env.local
# cp .env .env.local

# lauch local server
node ./dist/server.js
```

## Docker-Compose

```bash
# checkout the project
git clone https://github.com/wppconnect-team/wa-js-api-server.git

# enter in the folder
cd wa-js-api-server

# if you want to change some configuration, you can set en ENVIRONMENT variables or copy the .env to .env.local
# cp .env .env.local

# create container
docker-compose -f docker-compose.yml up --build -d
```

## Dockerfile

```bash
# checkout the project
git clone https://github.com/wppconnect-team/wa-js-api-server.git

# enter in the folder
cd wa-js-api-server

# create image
docker build -t wppconnect/wa-js-api-server:1.0.0 -f Dockerfile .

# create container
# if you want to change some setting you can set ENVIRONMENT variables
docker run -d -p 8000:8000 --name WPPconnectLinkPreview \
  --restart=always \
	-e NODE_ENV=production \
	-e PORT=8000 \
	-e LOG_FORMAT=combined \
	-e LOG_DIR='./logs' \
	-e ORIGIN='https://web.whatsapp.com' \
	-e CACHE_MAX_ITEMS=500 \
	-e CACHE_MAX_SIZE=104857600 \
	-e CACHE_TTL=3600000 \
	-e TRUST_PROXY=1 \
wppconnect/wa-js-api-server:1.0.0
```

## License

Copyright 2021 WPPConnect Team

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
