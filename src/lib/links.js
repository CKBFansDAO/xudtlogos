// Client-safe constants (no Node imports).
export const SITE_URL = 'https://xudtlogos.cc';
export const REPO_URL = 'https://github.com/CKBFansDAO/xudtlogos';
export const FORK_URL = `${REPO_URL}/fork`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const NEW_PR_URL = `${REPO_URL}/compare`;
export const DONATION_ADDRESS =
  'ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqddfkm2dxu807jw87smd0fwfc2rs35lx9gqm9wqv';

export const normalizeSymbol = (s) =>
  String(s || '')
    .trim()
    .replace(/^\./, '')
    .replace(/[\s/]+/g, '-')
    .toLowerCase();

export const pngUrl = (slug) => `${SITE_URL}/logos/${slug}-logo.png`;
export const svgUrl = (slug) => `${SITE_URL}/logos/${slug}-logo.svg`;
export const pagePath = (slug) => `/${encodeURIComponent(slug)}`;
