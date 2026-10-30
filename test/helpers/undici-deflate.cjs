'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const project = createRequire(path.resolve(process.argv[2], 'package.json'));
const release = createRequire(project.resolve('release-it/package.json'));
const root = path.dirname(release.resolve('undici/package.json'));
const { PerMessageDeflate } = require(path.join(
  root,
  'lib/web/websocket/permessage-deflate.js'
));
const frames = [];
for (let i = 0; i < 4; i++) {
  const header = Buffer.alloc(5);
  header.writeUInt16LE(65535, 1);
  header.writeUInt16LE(0, 3);
  frames.push(header, Buffer.alloc(65535, 65));
}
frames.push(Buffer.from([7])); // Reserved DEFLATE block type after the size limit.
let calls = 0;
const decoder = new PerMessageDeflate(new Map(), { maxPayloadSize: 1024 });
decoder.decompress(Buffer.concat(frames), true, (error) => {
  calls++;
  assert.ok(error, 'Oversized malformed input must be rejected');
});
setTimeout(() => {
  assert.equal(
    calls,
    1,
    'The decoder must reject exactly once and keep the process alive'
  );
  console.log(
    JSON.stringify({
      version: require(path.join(root, 'package.json')).version,
      calls,
      survived: true,
    })
  );
}, 300);
