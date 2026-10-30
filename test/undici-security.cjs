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

test('the proxy FTP consumer preserves transfers, caching and host restrictions', () => {
  execFileSync(
    process.execPath,
    [path.join(__dirname, 'helpers/ftp-consumer.cjs'), root],
    {
      cwd: root,
      timeout: 20000,
    }
  );
});

test('the FTP parser rejects a malformed listing without blocking', () => {
  execFileSync(
    process.execPath,
    [path.join(__dirname, 'helpers/ftp-consumer.cjs'), root, 'attack'],
    {
      cwd: root,
      timeout: 3000,
    }
  );
});

test('the Socks IPv6 parser bounds malformed zone scanning and retains ordinary addresses', () => {
  const code = String.raw`const {createRequire}=require('node:module');
    const owner=createRequire(require.resolve('socks'));
    const {Address6}=owner('ip-address');
    require('node:assert/strict').throws(()=>new Address6('fe80::1%'+'%'.repeat(65536)+'\ninvalid'));
    require('node:assert/strict').equal(new Address6('::1').correctForm(),'::1');
    require('node:assert/strict').equal(new Address6('fe80::1%eth0').zone,'%eth0');`;
  execFileSync(process.execPath, ['-e', code], { cwd: root, timeout: 2000 });
});
