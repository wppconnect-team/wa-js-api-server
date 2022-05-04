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
import { cleanEnv, port, str } from 'envalid';

expand(config({ path: `.env` }));
expand(config({ path: `.env.local` }));
expand(config({ path: `.env.${process.env.NODE_ENV || 'development'}` }));
expand(config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` }));
expand(config());

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  LOG_FORMAT: str({ default: 'combined' }),
  PORT: port({ default: 3000 }),
  LOG_DIR: str({ default: './logs' }),
});

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const { SECRET_KEY, ORIGIN } = process.env;
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR } = env;
