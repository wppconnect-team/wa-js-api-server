**English** | [Português (Brasil)](./README.pt-BR.md)

<p align="center">
  <a href="https://wppconnect.io/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://wppconnect-team.github.io/brand/wppconnect-dark.png" />
      <img src="https://wppconnect-team.github.io/brand/wppconnect-light.png" alt="WPPConnect" width="220" height="121" />
    </picture>
  </a>
</p>

# WPPConnect/WA-JS API SERVER

Serve URL-preview metadata and PNG payloads for WA-JS integrations.

A project in the WPPConnect ecosystem, maintained by WPPConnect Team.

[Getting started](#getting-started) | [Documentation](#documentation) | [Contributing](#contributing) | [Support WPPConnect](#support-the-project)

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE) [![CI](https://github.com/wppconnect-team/wa-js-api-server/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/wppconnect-team/wa-js-api-server/actions/workflows/test.yml) [![Documentation](https://img.shields.io/badge/docs-WPPConnect-blue)](https://wppconnect.io/) [![Open Collective](https://img.shields.io/badge/Open%20Collective-WPPConnect-blue)](https://opencollective.com/wppconnect)

## Overview

For operators who need the companion link-preview service used by browser integrations. This is a URL-preview API, separate from the WhatsApp session/message Server. The manifest package name exists in source but was not found in the npm registry during this review; use source installation.

## Features

- Fetch link metadata and encode preview data as PNG.
- Configurable cache, CORS origin, logging and generated Swagger UI.

## Getting started

Use Node.js and npm. No minimum runtime is declared; the existing Dockerfile uses the legacy Node 16 image, so its runtime needs maintainer review before deployment.

```sh
git clone https://github.com/wppconnect-team/wa-js-api-server.git
cd wa-js-api-server
npm ci
npm run build
npm start
```

In another terminal, `curl http://localhost:8000/status` returns `OK`. Open `http://localhost:8000/api-docs` for the preview routes.

## Configuration

Environment variables include `PORT` (8000), `ORIGIN`, `CACHE_MAX_ITEMS`, `CACHE_MAX_SIZE`, `CACHE_TTL`, `TRUST_PROXY`, `USER_AGENT`, `LOG_DIR` and `LOG_FORMAT`. See [src/config/index.ts](src/config/index.ts) for defaults and `.env` loading. Configure allowed callers and review URL-fetching exposure before making the service public.

## Documentation

- [Preview controller](./src/controllers/link-preview.controller.ts)
- [Docker Compose configuration](./docker-compose.yml)
- [Retained technical details and acknowledgments](documentation/readme-reference.md)

## WPPConnect ecosystem

| Project | Purpose | When to use it |
| --- | --- | --- |
| [WPPConnect/WA-JS](https://github.com/wppconnect-team/wa-js) | Expose WhatsApp Web functions through the browser-side `WPP` API. | Run browser-side code in WhatsApp Web. |
| [WPPConnect Server](https://github.com/wppconnect-team/wppconnect-server) | Run a REST API for WhatsApp sessions, messages and webhooks. | Expose session and messaging operations over HTTP. |

## Support the project

WPPConnect is maintained by an open-source community. Your support helps fund maintenance, infrastructure, documentation, and the people working on the ecosystem.

If WPPConnect helps your project or business, consider making a one-time contribution or becoming a recurring supporter.

**[Support WPPConnect on Open Collective](https://opencollective.com/wppconnect)**

Contributions are voluntary. See the official page for current financial information. You can also help with code, tests, documentation, translations and well-described issue reports.

Additional official beneficiaries in [.github/FUNDING.yml](.github/FUNDING.yml): [joaosouz4dev](https://github.com/sponsors/joaosouz4dev), [manfe](https://github.com/sponsors/manfe).

## Contributing

Contributions of code, tests, examples, documentation and translations are welcome. For larger changes, discuss the approach in an issue first. Include the project/runtime versions, a minimal reproduction and sanitized logs when reporting a problem. Update both `README.md` and `README.pt-BR.md` in the same change when installation, configuration, features, examples, licensing or funding changes.

After installing the development dependencies, use the repository checks relevant to your change:

```sh
npm run build
npm run lint
```

Account-dependent examples and tests require separate validation with an authorized test account. Never attach credentials or session files to an issue.

## Community and support

Use [repository issues](https://github.com/wppconnect-team/wa-js-api-server/issues) for reproducible bugs and feature proposals. For usage questions, join the community through the official channels:

- [Discord](https://discord.gg/JU5JGGKGNG)
- [Telegram](https://t.me/wppconnect)
- [YouTube](https://www.youtube.com/c/wppconnect)

This project is independent and is not affiliated with or endorsed by WhatsApp or Meta. Follow applicable terms and obtain authorization for account and messaging operations.

## License

[Apache License 2.0 (Apache-2.0)](./LICENSE).

Copyright 2021 WPPConnect Team.

The original legal document and existing copyright notices are preserved. Third-party components retain their own terms.
