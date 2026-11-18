const assert = require('node:assert/strict');
const { mkdtempSync, rmdirSync, unlinkSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');
const {
  importClassesFromDirectories,
} = require('routing-controllers/cjs/util/importClassesFromDirectories');

test('routing-controllers loads controller classes through the installed glob', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'routing-controller-glob-'));
  t.after(() => {
    for (const file of ['controller.js', 'controller.d.ts', 'readme.txt']) {
      try {
        unlinkSync(join(directory, file));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    rmdirSync(directory);
  });

  writeFileSync(
    join(directory, 'controller.js'),
    'module.exports = { Controller: class Controller {} };'
  );
  writeFileSync(
    join(directory, 'controller.d.ts'),
    'throw new Error("declaration files must not be imported");'
  );
  writeFileSync(
    join(directory, 'readme.txt'),
    'throw new Error("text files must not be imported");'
  );

  const controllers = importClassesFromDirectories([join(directory, '*')]);
  assert.deepEqual(controllers.map((controller) => controller.name), [
    'Controller',
  ]);
});
