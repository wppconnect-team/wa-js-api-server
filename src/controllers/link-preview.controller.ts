/*!
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fetch from 'cross-fetch';
import { Response } from 'express';
import { getLinkPreview } from 'link-preview-js';
import {
  Controller,
  Get,
  HeaderParam,
  NotFoundError,
  QueryParam,
  Res,
} from 'routing-controllers';

import { encodeStringToPng } from '../utils/encodeStringToPng';

@Controller('/v1/link-preview')
export class LinkPreviewController {
  protected async fetchLinkPreviewData(url: string, acceptLanguage?: string) {
    acceptLanguage = acceptLanguage || 'en-US,en';

    const preview = await getLinkPreview(url, {
      headers: {
        'Accept-Language': acceptLanguage,
      },
    });

    if (!preview || !('title' in preview)) {
      return null;
    }

    return {
      url: preview.url,
      title: preview.title,
      description: preview.description,
      mediaType: preview.mediaType,
      contentType: preview.contentType,
      image: preview.images[0] || preview.favicons[0],
    };
  }

  @Get('/fetch-data.json')
  async fetchJson(
    @QueryParam('url') url: string,
    @HeaderParam('Accept-Language') acceptLanguage?: string
  ) {
    const preview = await this.fetchLinkPreviewData(url, acceptLanguage);

    if (!preview) {
      throw new NotFoundError(`Preview link not found for "${url}"`);
    }

    return preview;
  }

  @Get('/fetch-data.png')
  async fetchPng(
    @QueryParam('url') url: string,
    @Res() response: Response,
    @HeaderParam('Accept-Language') acceptLanguage?: string
  ) {
    const preview = await this.fetchJson(url, acceptLanguage);

    const stringenc = JSON.stringify(preview).replace(
      /[\u007F-\uFFFF]/g,
      function (chr) {
        return '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).substr(-4);
      }
    );

    const buffer = encodeStringToPng(stringenc);

    response.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    });

    return response.end(buffer);
  }

  @Get('/download-image')
  async downloadImage(
    @QueryParam('url') url: string,
    @Res() response: Response
  ) {
    const data = await fetch(url);

    const arrayBuffer = await data.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const headers: { [key: string]: string } = {};
    if (data.headers.has('Content-Type')) {
      headers['Content-Type'] = data.headers.get('Content-Type')!;
    }

    response.writeHead(200, {
      'Content-Length': buffer.length,
      ...headers,
    });

    return response.end(buffer);
  }
}
