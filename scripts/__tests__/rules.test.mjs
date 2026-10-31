import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';
import { scriptHash } from '../lib/ckb.mjs';
import { normalizeSymbol } from '../lib/rules.mjs';
import { normalizeSymbol as siteNormalize } from '../../src/lib/links.js';
import { checkSvg, inspectRaster, checkPng, normalizeToPng } from '../lib/image.mjs';
import { validateToken } from '../lib/tokens.mjs';
import { parseIssueForm, attachmentUrl } from '../lib/issue-form.mjs';

const tokens = JSON.parse(fs.readFileSync('public/tokens/token_list.json', 'utf8')).tokens;
// Known data problem, tracked separately: hashType should be data1.
const KNOWN_BAD = new Set(['DRAGON']);

test('scriptHash matches typeHash of every token_list entry', () => {
  for (const t of tokens.filter((t) => !KNOWN_BAD.has(t.symbol))) {
    assert.equal(scriptHash(t.typeScript), t.typeHash.toLowerCase(), t.symbol);
  }
});

test('normalizeSymbol matches the site and XudtLogoLoader', () => {
  for (const s of ['CKB', ' Nervape 3D ', 'Nervape / B-Boat', '.bit', 'RGB++', '拯救民主']) {
    assert.equal(normalizeSymbol(s), siteNormalize(s));
  }
  assert.equal(normalizeSymbol('Nervape / B-Boat'), 'nervape-b-boat');
});

test('every existing logo file name is already normalised', () => {
  for (const f of fs.readdirSync('public/logos')) {
    const m = /^(.+)-logo\.(png|svg)$/.exec(f);
    if (m) assert.equal(normalizeSymbol(m[1]), m[1], f);
  }
});

test('checkSvg rejects active content and accepts a plain SVG', () => {
  const bad = '<svg xmlns="http://www.w3.org/2000/svg" onload="x()"><script>1</script><image href="https://e.com/a.png"/></svg>';
  assert.equal(checkSvg(bad, bad.length).errors.length, 3);
  const good = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle r="5"/></svg>';
  assert.deepEqual(checkSvg(good, good.length).errors, []);
});

test('normalizeToPng makes any image square, transparent-padded and ≤512px', async () => {
  const jpeg = await sharp({ create: { width: 900, height: 600, channels: 3, background: '#123456' } }).jpeg().toBuffer();
  const out = await normalizeToPng(jpeg);
  const info = await inspectRaster(out.buf);
  assert.equal(info.format, 'png');
  assert.equal(info.width, 512);
  assert.equal(info.height, 512);
  assert.ok(info.transparentCorners);
  assert.deepEqual(checkPng(info).errors, []);
});

test('validateToken catches a typeHash that does not match its script', () => {
  const t = structuredClone(tokens.find((x) => x.symbol === 'Seal'));
  assert.deepEqual(validateToken(t), []);
  t.typeScript.hashType = 'type';
  assert.match(validateToken(t).join(), /typeHash does not match/);
});

test('issue form parsing and attachment host allow-list', () => {
  const body = '### Display name\n\nSeal\n\n### Token symbol\n\n_No response_\n\n### Logo image\n\n![x](https://github.com/user-attachments/assets/abc)\n\n### Custom type script (advanced)\n\n```json\n{"a":1}\n```';
  const f = parseIssueForm(body);
  assert.equal(f.name, 'Seal');
  assert.equal(f.symbol, '');
  assert.equal(f.custom_script, '{"a":1}');
  assert.equal(attachmentUrl(f.png), 'https://github.com/user-attachments/assets/abc');
  assert.equal(attachmentUrl('![x](https://evil.example.com/a.png)'), null);
  assert.equal(attachmentUrl('https://github.com/someone/repo/raw/main/a.png'), null);
});
