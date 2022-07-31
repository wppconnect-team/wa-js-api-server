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

import { Response } from 'express';
import { decode } from 'html-entities';
import getMetaData from 'metadata-scraper';
import fetch from 'node-fetch';
import {
  Controller,
  Get,
  HeaderParam,
  QueryParam,
  Res,
} from 'routing-controllers';
import { PassThrough } from 'stream';

import { USER_AGENT } from '../config';
import { HttpException } from '../exceptions/HttpException';
import { cache } from '../utils/cache';
import { encodeToPng } from '../utils/encodeToPng';

interface LinkPreviewData {
  url: string;
  originalUrl: string;
  title: string;
  description?: string;
  mediaType: string;
  contentType?: string;
  image?: string;
  icon?: string;
}

@Controller('/v1/link-preview')
export class LinkPreviewController {
  protected async fetchLinkPreviewData(
    url: string,
    acceptLanguage?: string
  ): Promise<LinkPreviewData | null> {
    acceptLanguage = acceptLanguage || 'en-US,en';

    const key = `${url} - ${acceptLanguage}`;

    if (cache.has(key)) {
      return cache.get<LinkPreviewData>(key) || null;
    }

    const preview = await getMetaData({
      url,
      lang: acceptLanguage,
      ua: USER_AGENT,
    });

    if (!preview || !('title' in preview)) {
      return null;
    }

    if (preview.title) {
      preview.title = decode(preview.title);
    }

    if (preview.description) {
      preview.description = decode(preview.description);
    }

    const result = {
      url: preview.url!,
      originalUrl: url,
      title: preview.title!,
      description: preview.description,
      mediaType: preview.type!,
      contentType: (preview.contentType as string) || 'text/html',
      image: preview.image || preview.icon,
      icon: preview.icon,
    };

    cache.set(key, result);

    return result;
  }

  @Get('/fetch-data.json')
  async fetchJson(
    @QueryParam('url') url: string,
    @HeaderParam('Accept-Language') acceptLanguage?: string
  ) {
    try {
      const preview = await this.fetchLinkPreviewData(url, acceptLanguage);

      if (!preview) {
        return {
          status: 404,
          message: `Preview link not found for "${url}"`,
          error: true,
        };
      }

      return {
        status: 200,
        ...preview,
      };
    } catch (error: any) {
      const status: number = error.status || 500;
      const message: string = error.message || 'Something went wrong';

      return {
        status,
        message,
        error: true,
      };
    }
  }

  @Get('/fetch-data.png')
  async fetchPng(
    @QueryParam('url') url: string,
    @Res() response: Response,
    @HeaderParam('Accept-Language') acceptLanguage?: string
  ) {
    const preview = await this.fetchJson(url, acceptLanguage);

    const buffer = encodeToPng(JSON.stringify(preview));

    const readStream = new PassThrough();

    readStream.end(buffer);

    response.setHeader('Content-Type', 'image/png');
    response.setHeader('Content-Length', buffer.length);

    return readStream.pipe(response);
  }

  @Get('/download-image')
  async downloadImage(
    @QueryParam('url') url: string,
    @Res() response: Response
  ) {
    const data = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!data.ok) {
      throw new HttpException(404, `image not found for "${url}"`);
    }

    const mimeType =
      data.headers.get('content-type') || 'application/octet-stream';

    if (!/^image\//.test(mimeType)) {
      throw new HttpException(
        400,
        `The content of "${url}" is not an image, current mime type: "${mimeType}"`
      );
    }

    const headers: { [key: string]: string } = {};
    if (data.headers.has('Content-Type')) {
      headers['Content-Type'] = data.headers.get('Content-Type')!;
    }
    if (data.headers.has('Content-Length')) {
      headers['Content-Length'] = data.headers.get('Content-Length')!;
    }

    response.writeHead(200, headers);

    return data.body?.pipe(response);
  }
}
