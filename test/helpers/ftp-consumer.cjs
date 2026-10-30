'use strict';
const assert = require('node:assert/strict');
const net = require('node:net');
const path = require('node:path');
const { createRequire } = require('node:module');
const { once } = require('node:events');
const project = createRequire(path.resolve(process.argv[2], 'package.json'));
const fromGetUri = createRequire(project.resolve('get-uri'));
const { getUri } = project('get-uri');
const ftp = fromGetUri('basic-ftp');
const version = fromGetUri('basic-ftp/package.json').version;

async function fixture(options = {}) {
  const sockets = new Set();
  const dataServers = new Set();
  const commands = [];
  const payload = Buffer.from([0, 1, 255, 65, 195, 169]);
  const server = net.createServer((control) => {
    sockets.add(control);
    control.on('close', () => sockets.delete(control));
    control.write('220 Local test FTP\r\n');
    let text = '';
    let dataReady;
    control.on('data', (chunk) => {
      text += chunk.toString();
      while (text.includes('\r\n')) {
        const end = text.indexOf('\r\n');
        const line = text.slice(0, end);
        text = text.slice(end + 2);
        commands.push(line);
        const cmd = line.split(' ')[0];
        if (cmd === 'USER') control.write('331 Password required\r\n');
        else if (cmd === 'PASS')
          control.write(
            options.badAuth ? '530 Login failed\r\n' : '230 Logged in\r\n'
          );
        else if (cmd === 'FEAT')
          control.write(
            options.mlsd
              ? '211-Features\r\n MLST type*;size*;modify*;\r\n211 End\r\n'
              : '211 No features\r\n'
          );
        else if (cmd === 'MDTM')
          control.write(
            options.missing
              ? '550 Not found\r\n'
              : options.fallback
              ? '502 Unsupported\r\n'
              : '213 20260101000000\r\n'
          );
        else if (cmd === 'EPSV' || cmd === 'PASV') {
          if (options.splitHost && cmd === 'EPSV') {
            control.write('500 Use PASV\r\n');
            continue;
          }
          const data = net.createServer((socket) => {
            sockets.add(socket);
            socket.on('close', () => sockets.delete(socket));
          });
          dataServers.add(data);
          dataReady = once(data, 'connection').then(([s]) => s);
          data.listen(0, '127.0.0.1', () => {
            const p = data.address().port;
            control.write(
              cmd === 'EPSV'
                ? `229 Extended Passive Mode (|||${p}|)\r\n`
                : `227 Passive Mode (${
                    options.splitHost ? '198,51,100,1' : '127,0,0,1'
                  },${p >> 8},${p & 255})\r\n`
            );
          });
        } else if (cmd === 'LIST' || cmd === 'MLSD' || cmd === 'RETR') {
          control.write('150 Data follows\r\n');
          const benign = `-rw-r--r-- 1 user group ${payload.length} Jan 01 2026 file.bin\r\n`;
          const attack = '-rw-r--r-- 1 ' + 'x '.repeat(32768) + 'invalid\r\n';
          const body =
            cmd === 'RETR'
              ? payload
              : Buffer.from(
                  cmd === 'MLSD'
                    ? `type=file;size=${payload.length};modify=20260101000000; file.bin\r\n`
                    : (options.attack ? attack : '') + benign
                );
          dataReady.then((socket) =>
            socket.end(body, () => control.write('226 Transfer complete\r\n'))
          );
        } else if (cmd === 'QUIT') control.end('221 Bye\r\n');
        else control.write('200 OK\r\n');
      }
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {
    payload,
    commands,
    url: `ftp://user:password@127.0.0.1:${server.address().port}/file.bin`,
    port: server.address().port,
    async close() {
      for (const s of sockets) s.destroy();
      await Promise.all(
        [...dataServers].map((s) => new Promise((resolve) => s.close(resolve)))
      );
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
async function read(stream) {
  const chunks = [];
  for await (const c of stream) chunks.push(c);
  return Buffer.concat(chunks);
}
async function run() {
  if (process.argv[3] === 'attack') {
    const f = await fixture({ fallback: true, attack: true });
    try {
      const start = performance.now();
      const client = new ftp.Client(1000);
      try {
        await client.access({
          host: '127.0.0.1',
          port: f.port,
          user: 'user',
          password: 'password',
        });
        const entries = await client.list();
        assert.equal(entries.length, 1);
        assert.equal(entries[0].name, 'file.bin');
      } finally {
        client.close();
      }
      console.log(
        JSON.stringify({
          version,
          attack: true,
          milliseconds: performance.now() - start,
        })
      );
    } finally {
      await f.close();
    }
    return;
  }
  const cases = [];
  for (const [name, options] of [
    ['MDTM and binary transfer', {}],
    ['MLSD fallback and binary transfer', { fallback: true, mlsd: true }],
  ]) {
    const f = await fixture(options);
    try {
      const s = await getUri(f.url);
      assert.deepEqual(await read(s), f.payload);
      assert.ok(s.lastModified instanceof Date);
      assert.ok(f.commands.some((x) => x === 'RETR /file.bin'));
      cases.push(name);
    } finally {
      await f.close();
    }
  }
  const spaces = await fixture();
  try {
    const s = await getUri(
      spaces.url.replace('/file.bin', '/folder/file%20name.bin')
    );
    await read(s);
    assert.ok(spaces.commands.includes('RETR /folder/file name.bin'));
    cases.push('URL encoded path');
  } finally {
    await spaces.close();
  }
  const cached = await fixture();
  try {
    await assert.rejects(
      getUri(cached.url, {
        cache: { lastModified: new Date('2026-01-01T00:00:00Z') },
      }),
      { code: 'ENOTMODIFIED' }
    );
    assert.ok(!cached.commands.some((x) => x.startsWith('RETR')));
    cases.push('Unmodified cache avoids transfer');
  } finally {
    await cached.close();
  }
  const missing = await fixture({ missing: true });
  try {
    await assert.rejects(getUri(missing.url), { code: 'ENOTFOUND' });
    cases.push('Missing file maps ENOTFOUND');
  } finally {
    await missing.close();
  }
  const bad = await fixture({ badAuth: true });
  try {
    await assert.rejects(getUri(bad.url), (err) => err.code === 530);
    cases.push('Authentication rejection');
  } finally {
    await bad.close();
  }
  const split = await fixture({ splitHost: true });
  const client = new ftp.Client(1000);
  try {
    await client.access({
      host: '127.0.0.1',
      port: split.port,
      user: 'user',
      password: 'password',
    });
    await assert.rejects(client.list(), /PASV returned another host/);
    cases.push('Default split-host security restriction');
  } finally {
    client.close();
    await split.close();
  }
  console.log(
    JSON.stringify({
      version,
      consumer: 'get-uri',
      cases: cases.length,
      checks: cases,
    })
  );
}
run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
