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

import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { cleanEnv, num, port, str } from 'envalid';

expand(config({ path: `.env` }));
expand(config({ path: `.env.local` }));
expand(config({ path: `.env.${process.env.NODE_ENV || 'development'}` }));
expand(config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` }));
expand(config());

const env = cleanEnv(process.env, {
  CACHE_MAX_ITEMS: num({ default: 5000 }),
  CACHE_MAX_SIZE: num({ default: 100 * 1024 * 1024 }), // 100MB
  CACHE_TTL: num({ default: 60 * 60 * 1000 }), // 1 hour
  LOG_DIR: str({ default: './logs' }),
  LOG_FORMAT: str({ default: 'combined' }),
  NODE_ENV: str({ default: 'development' }),
  ORIGIN: str({ default: 'https://web.whatsapp.com' }),
  PORT: port({ default: 8000 }),
  TRUST_PROXY: str<string>({ default: '1' }),
  USER_AGENT: str<string>({ default: 'WhatsApp/2.2214.12 N' }),
});

export const {
  CACHE_MAX_ITEMS,
  CACHE_MAX_SIZE,
  CACHE_TTL,
  LOG_DIR,
  LOG_FORMAT,
  NODE_ENV,
  ORIGIN,
  PORT,
  TRUST_PROXY,
  USER_AGENT,
} = env;
