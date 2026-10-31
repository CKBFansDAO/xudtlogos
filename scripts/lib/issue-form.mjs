// Parses the body GitHub renders for .github/ISSUE_TEMPLATE/logo-submission.yml.
// Keep FIELDS in sync with the labels in that file.
export const FIELDS = {
  Request: 'request',
  'Asset type': 'asset_type',
  'Display name': 'name',
  'Token symbol': 'symbol',
  'Logo image': 'png',
  'SVG version (optional)': 'svg',
  'xUDT type script args': 'type_args',
  'Custom type script (advanced)': 'custom_script',
  Decimals: 'decimals',
  'Official website': 'website',
  'X / Twitter': 'twitter',
  Telegram: 'telegram',
  Discord: 'discord',
  GitHub: 'github',
  'Logo file name (advanced)': 'logo_key',
  'Notes for the reviewers': 'notes',
  Confirmation: 'confirm',
};

export function parseIssueForm(body) {
  const out = {};
  const parts = String(body || '').replace(/\r\n/g, '\n').split(/^### /m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const label = part.slice(0, nl).trim();
    const key = FIELDS[label];
    if (!key) continue;
    let value = part.slice(nl + 1).trim();
    if (value === '_No response_' || value === 'None') value = '';
    value = value.replace(/^```(?:json)?\n([\s\S]*?)\n```$/, '$1').trim();
    out[key] = value;
  }
  return out;
}

const ALLOWED_HOSTS = new Set([
  'github.com',
  'user-images.githubusercontent.com',
  'private-user-images.githubusercontent.com',
]);

// First attachment URL in a form field (markdown image, <img>, link or bare URL).
export function attachmentUrl(text) {
  if (!text) return null;
  const m =
    /!\[[^\]]*\]\((https:\/\/[^)\s]+)\)/.exec(text) ||
    /<img[^>]+src=["'](https:\/\/[^"']+)["']/i.exec(text) ||
    /\[[^\]]*\]\((https:\/\/[^)\s]+)\)/.exec(text) ||
    /(https:\/\/\S+)/.exec(text);
  if (!m) return null;
  try {
    const u = new URL(m[1]);
    if (!ALLOWED_HOSTS.has(u.hostname)) return null;
    if (u.hostname === 'github.com' && !u.pathname.startsWith('/user-attachments/')) return null;
    return u.toString();
  } catch {
    return null;
  }
}
