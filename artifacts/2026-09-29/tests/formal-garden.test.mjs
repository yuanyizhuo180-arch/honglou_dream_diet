import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../outputs/honglou-garden/', import.meta.url);
for (const file of ['index.html', 'garden/index.html', 'assets/garden-clean.png', 'garden-content.js', 'release.json']) {
  await assert.doesNotReject(access(new URL(file, root)), `正式地图缺少 ${file}`);
}
const release = JSON.parse(await readFile(new URL('release.json', root)));
assert.equal(release.status, 'official');
assert.equal(release.route, '/garden');
assert.equal(release.rendering, '2d-illustration');
assert.equal(release.panelWidth, 213);
console.log('正式地图包结构验证通过');
