[English](./README.md) | **Português (Brasil)**

<p align="center">
  <a href="https://wppconnect.io/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://wppconnect-team.github.io/brand/wppconnect-dark.png" />
      <img src="https://wppconnect-team.github.io/brand/wppconnect-light.png" alt="WPPConnect" width="220" height="121" />
    </picture>
  </a>
</p>

# WPPConnect/WA-JS API SERVER

Forneça metadados de preview de URLs e payloads PNG para integrações WA-JS.

Um projeto do ecossistema WPPConnect, mantido pela WPPConnect Team.

[Primeiros passos](#primeiros-passos) | [Documentação](#documentação) | [Como contribuir](#como-contribuir) | [Apoie a WPPConnect](#apoie-o-projeto)

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE) [![CI](https://github.com/wppconnect-team/wa-js-api-server/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/wppconnect-team/wa-js-api-server/actions/workflows/test.yml) [![Documentation](https://img.shields.io/badge/docs-WPPConnect-blue)](https://wppconnect.io/) [![Open Collective](https://img.shields.io/badge/Open%20Collective-WPPConnect-blue)](https://opencollective.com/wppconnect)

## Visão geral

Para operadores que precisam do serviço auxiliar de preview de links usado por integrações de navegador. Esta API de preview é separada do Server de sessões/mensagens do WhatsApp. O nome do pacote consta no manifest, mas não foi encontrado no npm nesta revisão; instale pelos fontes.

## Funcionalidades

- Consulte metadados de links e codifique os dados do preview como PNG.
- Cache, origem CORS e logs configuráveis, além de Swagger UI gerado.

## Primeiros passos

Use Node.js e npm. Não há versão mínima declarada; o Dockerfile existente usa a imagem legada Node 16, portanto o runtime precisa de revisão dos mantenedores antes de uma implantação.

```sh
git clone https://github.com/wppconnect-team/wa-js-api-server.git
cd wa-js-api-server
npm ci
npm run build
npm start
```

Em outro terminal, `curl http://localhost:8000/status` retorna `OK`. Abra `http://localhost:8000/api-docs` para consultar as rotas de preview.

## Configuração

As variáveis incluem `PORT` (8000), `ORIGIN`, `CACHE_MAX_ITEMS`, `CACHE_MAX_SIZE`, `CACHE_TTL`, `TRUST_PROXY`, `USER_AGENT`, `LOG_DIR` e `LOG_FORMAT`. Consulte os valores padrão e o carregamento de `.env` em [src/config/index.ts](src/config/index.ts). Configure os clientes permitidos e revise a exposição de consultas a URLs antes de tornar o serviço público.

## Documentação

- [Controller de preview](./src/controllers/link-preview.controller.ts)
- [Configuração Docker Compose](./docker-compose.yml)
- [Detalhes técnicos e agradecimentos preservados](documentation/readme-reference.md)

## Ecossistema WPPConnect

| Projeto | Finalidade | Quando usar |
| --- | --- | --- |
| [WPPConnect/WA-JS](https://github.com/wppconnect-team/wa-js) | Exponha funções do WhatsApp Web pela API `WPP` no navegador. | Executar código no navegador dentro do WhatsApp Web. |
| [WPPConnect Server](https://github.com/wppconnect-team/wppconnect-server) | Execute uma API REST para sessões, mensagens e webhooks do WhatsApp. | Expor operações de sessão e mensagens por HTTP. |

## Apoie o projeto

A WPPConnect é mantida por uma comunidade de código aberto. Seu apoio ajuda a financiar a manutenção, a infraestrutura, a documentação e o trabalho das pessoas que desenvolvem o ecossistema.

Se a WPPConnect ajuda seu projeto ou sua empresa, considere fazer uma contribuição pontual ou apoiar de forma recorrente.

**[Apoie a WPPConnect no Open Collective](https://opencollective.com/wppconnect)**

As contribuições são voluntárias. Consulte a página oficial para acompanhar as informações financeiras atuais. Você também pode ajudar com código, testes, documentação, traduções e relatos de problemas bem descritos.

Beneficiários oficiais adicionais em [.github/FUNDING.yml](.github/FUNDING.yml): [joaosouz4dev](https://github.com/sponsors/joaosouz4dev), [manfe](https://github.com/sponsors/manfe).

## Como contribuir

Contribuições de código, testes, exemplos, documentação e traduções são bem-vindas. Para mudanças maiores, discuta a proposta em uma issue primeiro. Ao relatar um problema, informe as versões do projeto/runtime, uma reprodução mínima e logs sem dados sensíveis. Atualize `README.md` e `README.pt-BR.md` na mesma alteração quando mudar instalação, configuração, funcionalidades, exemplos, licença ou arrecadação.

Após instalar as dependências de desenvolvimento, use as verificações pertinentes à sua alteração:

```sh
npm run build
npm run lint
```

Exemplos e testes que dependem de conta exigem validação separada com uma conta de teste autorizada. Nunca anexe credenciais ou arquivos de sessão a uma issue.

## Comunidade e suporte

Use as [issues do repositório](https://github.com/wppconnect-team/wa-js-api-server/issues) para bugs reproduzíveis e propostas de funcionalidades. Para dúvidas de uso, participe pelos canais oficiais:

- [Discord](https://discord.gg/JU5JGGKGNG)
- [Telegram](https://t.me/wppconnect)
- [YouTube](https://www.youtube.com/c/wppconnect)

Este projeto é independente e não é afiliado nem endossado pelo WhatsApp ou pela Meta. Siga os termos aplicáveis e obtenha autorização para operações de conta e mensagens.

## Licença

[Apache License 2.0 (Apache-2.0)](./LICENSE).

Copyright 2021 WPPConnect Team.

O documento jurídico original e os avisos de autoria existentes são preservados. Componentes de terceiros mantêm seus próprios termos.
