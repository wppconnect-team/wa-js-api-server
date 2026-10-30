const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { once } = require('node:events');
const http = require('node:http');
const { createRequire } = require('node:module');
const path = require('node:path');
const { test } = require('node:test');
const { gzipSync } = require('node:zlib');

const root = path.resolve(__dirname, '..');
const release = createRequire(require.resolve('release-it'));
const { fetch, Agent } = release('undici');

test('release HTTP client preserves JSON, gzip decoding and redirects', async (t) => {
  const payload = {
    name: 'tooling-fixture',
    title: 'Configuração',
    version: '1.0.0',
  };
  const server = http.createServer((request, response) => {
    if (request.url === '/redirect') {
      response.writeHead(302, { location: '/gzip' });
      response.end();
      return;
    }
    const body = Buffer.from(JSON.stringify(payload));
    response.setHeader('content-type', 'application/json');
    if (request.url === '/gzip') {
      response.setHeader('content-encoding', 'gzip');
      response.end(gzipSync(body));
    } else response.end(body);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const dispatcher = new Agent();
  t.after(async () => {
    await dispatcher.close();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });
  for (const route of ['/json', '/gzip', '/redirect']) {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}${route}`,
      { dispatcher }
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), payload);
  }
});

for (const name of ['undici-encoding.cjs', 'undici-deflate.cjs']) {
  test(`release HTTP dependency rejects malformed input in ${name}`, () => {
    const output = execFileSync(
      process.execPath,
      [path.join(__dirname, 'helpers', name), root],
      {
        cwd: root,
        timeout: 5000,
        encoding: 'utf8',
      }
    );
    assert.match(output, /"survived":true/);
  });
}
