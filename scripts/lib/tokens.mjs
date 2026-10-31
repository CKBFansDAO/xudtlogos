// Validation of public/tokens/token_list.json entries.
import { isHex, scriptHash } from './ckb.mjs';
import { SITE_URL } from './rules.mjs';

const LINK_KEYS = ['official', 'twitter', 'discord', 'telegram', 'github', 'medium', 'youtube'];

export function validateToken(t, { logoExists } = {}) {
  const errors = [];
  const label = t?.symbol || t?.name || 'token';
  if (!t || typeof t !== 'object') return [`Entry is not an object.`];
  if (typeof t.name !== 'string' || !t.name.trim()) errors.push(`${label}: "name" is required.`);
  if (typeof t.symbol !== 'string' || !t.symbol.trim()) errors.push(`${label}: "symbol" is required.`);
  if (!Number.isInteger(t.decimals) || t.decimals < 0 || t.decimals > 255) errors.push(`${label}: "decimals" must be an integer 0–255.`);

  const m = /^https:\/\/xudtlogos\.cc\/logos\/(.+)-logo\.png$/.exec(t.logo || '');
  if (!m) errors.push(`${label}: "logo" must be ${SITE_URL}/logos/{symbol}-logo.png.`);
  else if (logoExists && !logoExists(decodeURIComponent(m[1]))) errors.push(`${label}: logo file public/logos/${m[1]}-logo.png does not exist.`);

  const s = t.typeScript || {};
  if (!isHex(s.codeHash, 32)) errors.push(`${label}: typeScript.codeHash must be a 32-byte hex string.`);
  if (!['data', 'type', 'data1', 'data2'].includes(s.hashType)) errors.push(`${label}: typeScript.hashType must be data, type, data1 or data2.`);
  if (!isHex(s.args)) errors.push(`${label}: typeScript.args must be hex.`);
  if (!isHex(t.typeHash, 32)) errors.push(`${label}: "typeHash" must be a 32-byte hex string.`);
  if (!errors.some((e) => e.includes('typeScript'))) {
    const computed = scriptHash(s);
    if (isHex(t.typeHash, 32) && computed !== t.typeHash.toLowerCase()) {
      errors.push(`${label}: typeHash does not match typeScript (computed ${computed}). Check codeHash, hashType and args.`);
    }
  }

  const op = t.typeCellDep?.outPoint;
  if (!isHex(op?.txHash, 32) || !Number.isInteger(op?.index)) errors.push(`${label}: typeCellDep.outPoint needs txHash and an integer index.`);
  if (!['code', 'dep_group', 'depGroup'].includes(t.typeCellDep?.depType)) errors.push(`${label}: typeCellDep.depType must be "code" or "dep_group".`);

  for (const [k, v] of Object.entries(t.extensions?.links || {})) {
    if (!LINK_KEYS.includes(k)) errors.push(`${label}: unknown link "${k}".`);
    else if (v && !/^https:\/\/\S+$/.test(v)) errors.push(`${label}: link "${k}" must be an https URL.`);
  }
  return errors;
}

export const emptyLinks = () => Object.fromEntries(LINK_KEYS.map((k) => [k, '']));
export { LINK_KEYS };
