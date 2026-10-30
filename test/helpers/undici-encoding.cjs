const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const { createRequire } = require('node:module');
const { once } = require('node:events');
const project = createRequire(path.resolve(process.argv[2], 'package.json'));
const owner = createRequire(project.resolve('release-it'));
const { fetch, Agent } = owner('undici');
async function main() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      'content-encoding': 'gzip, gzip, gzip, gzip, gzip, gzip',
      'content-length': '10',
      connection: 'close',
    });
    res.end();
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const dispatcher = new Agent();
  let rejected = 0;
  try {
    await fetch(`http://127.0.0.1:${server.address().port}/`, {
      dispatcher,
    }).then(
      () => assert.fail('Excessive encodings must be rejected'),
      () => rejected++
    );
    await new Promise((resolve) => setTimeout(resolve, 200));
    assert.equal(rejected, 1);
    console.log(
      JSON.stringify({
        version: owner('undici/package.json').version,
        consumer: 'release-it',
        rejected,
        survived: true,
      })
    );
  } finally {
    await dispatcher.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
