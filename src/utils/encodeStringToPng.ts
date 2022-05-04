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

import { createCanvas } from 'canvas';

function ord(a: string) {
  const c = a + '',
    e = c.charCodeAt(0);
  if (55296 <= e && 56319 >= e) {
    if (1 === c.length) return e;
    const f = c.charCodeAt(1);
    return 1024 * (e - 55296) + (f - 56320) + 65536;
  }
  return 56320 <= e && 57343 >= e ? e : e;
}

export function encodeStringToPng(a: string) {
  if (a.length) {
    const c = a.length,
      width = Math.ceil(Math.sqrt(c / 3)),
      height = width,
      canvas = createCanvas(width, height),
      h = canvas.getContext('2d');
    let j = h.getImageData(0, 0, width, height),
      k = j.data,
      l = 0;
    for (let m = 0; m < height; m++)
      for (let n = 0; n < width; n++) {
        const o = 4 * (m * width) + 4 * n,
          p = a[l++],
          q = a[l++],
          r = a[l++];
        (p || q || r) &&
          (p && (k[o] = ord(p)),
          q && (k[o + 1] = ord(q)),
          r && (k[o + 2] = ord(r)),
          (k[o + 3] = 255));
      }

    h.putImageData(j, 0, 0);

    const buffer = canvas.toBuffer('image/png');

    return buffer;
  }

  return Buffer.from('');
}
