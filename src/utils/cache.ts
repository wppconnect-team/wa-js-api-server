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

import LRUCache from 'lru-cache';

import { CACHE_MAX_ITEMS, CACHE_MAX_SIZE, CACHE_TTL } from '../config';

export const cache = new LRUCache<string, string | object | Buffer>({
  max: CACHE_MAX_ITEMS,
  maxSize: CACHE_MAX_SIZE,
  ttl: CACHE_TTL,
  sizeCalculation: (value) => {
    if (Buffer.isBuffer(value) || typeof value === 'string') {
      return value.length;
    }
    return JSON.stringify(value).length;
  },
  allowStale: false,
  updateAgeOnGet: false,
});
