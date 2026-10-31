// CKB helpers for validating xUDT token metadata.
import { blake2b } from '@noble/hashes/blake2b';

const HASH_TYPES = { data: 0, type: 1, data1: 2, data2: 4 };
const HEX = /^0x([0-9a-f]{2})*$/;

export const RPC_URL = process.env.CKB_RPC_URL || 'https://mainnet.ckb.dev/rpc';

// Script deployments already used in token_list.json, keyed by a short name.
// A submitter only has to give the type script args; the rest is filled in.
export const KNOWN_UDT_SCRIPTS = {
  xudt: {
    label: 'xUDT (RFC 0052)',
    codeHash: '0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95',
    hashType: 'data1',
    cellDep: { outPoint: { txHash: '0xc07844ce21b38e4b071dd0e1ee3b0e27afd8d7532491327f39b786343f558ab7', index: 0 }, depType: 'code' },
  },
};

const hexToBytes = (hex) => Uint8Array.from(Buffer.from(hex.slice(2), 'hex'));
const u32le = (n) => {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, n, true);
  return b;
};

export function isHex(v, bytes) {
  if (typeof v !== 'string' || !HEX.test(v)) return false;
  return bytes == null || v.length === 2 + bytes * 2;
}

// Molecule serialisation of Script { code_hash: Byte32, hash_type: byte, args: Bytes }.
export function serializeScript({ codeHash, hashType, args }) {
  if (!isHex(codeHash, 32)) throw new Error('codeHash must be 32 bytes hex');
  if (!(hashType in HASH_TYPES)) throw new Error(`hashType must be one of ${Object.keys(HASH_TYPES).join(', ')}`);
  if (!isHex(args)) throw new Error('args must be hex');
  const code = hexToBytes(codeHash);
  const a = hexToBytes(args);
  const argsField = new Uint8Array([...u32le(a.length), ...a]);
  const header = 16;
  const total = header + 32 + 1 + argsField.length;
  return new Uint8Array([
    ...u32le(total),
    ...u32le(header),
    ...u32le(header + 32),
    ...u32le(header + 33),
    ...code,
    HASH_TYPES[hashType],
    ...argsField,
  ]);
}

export function scriptHash(script) {
  const personalization = new TextEncoder().encode('ckb-default-hash');
  const h = blake2b(serializeScript(script), { dkLen: 32, personalization });
  return '0x' + Buffer.from(h).toString('hex');
}

async function rpc(method, params) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: 1, jsonrpc: '2.0', method, params }),
    signal: AbortSignal.timeout(20000),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

// Returns true/false when the chain answered, or null when it could not be reached.
export async function typeScriptExistsOnChain({ codeHash, hashType, args }) {
  try {
    const r = await rpc('get_cells', [
      { script: { code_hash: codeHash, hash_type: hashType, args }, script_type: 'type' },
      'asc',
      '0x1',
    ]);
    return r.objects.length > 0;
  } catch {
    return null;
  }
}

export async function liveCellExists({ txHash, index }) {
  try {
    const r = await rpc('get_live_cell', [{ tx_hash: txHash, index: '0x' + Number(index).toString(16) }, false]);
    return r.status === 'live';
  } catch {
    return null;
  }
}
