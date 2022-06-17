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

import { toPng } from '@rgba-image/png';

export function encodeToPng(content: ArrayBufferView | string) {
  if (typeof content === 'string') {
    content = Buffer.from(content);
  }

  const arrayData = new Uint8Array(
    content.buffer,
    content.byteOffset,
    content.byteLength
  );

  // Set image size
  const headerSize = 12;
  const length = arrayData.length;
  const width = Math.ceil(Math.sqrt((length + headerSize) / 3));
  const height = width;

  // Create a image data
  const data = new Uint8ClampedArray(width * height * 4);

  // 1 byte for type or future use
  // 8 bytes for size;
  // first 3 pixels for length

  const bufSize = Buffer.alloc(8);
  bufSize.writeBigUInt64BE(BigInt(length));

  data[0] = 0; //red
  data[1] = bufSize[0]; //green
  data[2] = bufSize[1]; //blue
  data[3] = 255; //alfa
  data[4] = bufSize[2]; //red
  data[5] = bufSize[3]; //green
  data[6] = bufSize[4]; //blue
  data[7] = 255; //alfa
  data[8] = bufSize[5]; //red
  data[9] = bufSize[6]; //green
  data[10] = bufSize[7]; //blue
  data[11] = 255; //alfa

  let i = 0;
  let o = headerSize;
  while (i < length) {
    data[o] = arrayData[i] || 0; //red
    data[o + 1] = arrayData[i + 1] || 0; //green
    data[o + 2] = arrayData[i + 2] || 0; //blue
    data[o + 3] = 255; //alfa

    i += 3;
    o += 4;
  }

  const encodedPng = toPng({
    data,
    height,
    width,
    colorSpace: 'srgb',
  } as any);

  return encodedPng;
}
