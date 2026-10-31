// Single place for the submission rules. Mirrors README "Logo Specifications".

export const SITE_URL = 'https://xudtlogos.cc';

export const SPEC = {
  minPx: 128,
  maxPx: 512, // larger files are allowed but get downscaled by the submission bot
  targetPx: 512,
  maxPngKb: 500,
  maxSvgKb: 50,
  thumbPx: 100,
};

// Same rule as XudtLogoLoader / Tools page: what DApps use to build the URL.
export const normalizeSymbol = (s) =>
  String(s || '')
    .trim()
    .replace(/^\./, '')
    .replace(/[\s/]+/g, '-')
    .toLowerCase();

export const LOGO_FILE = /^public\/logos\/([^/]+)-logo\.(png|svg)$/;
export const THUMB_FILE = /^public\/logos\/thumbs\/([^/]+)\.png$/;
export const XUDTS_JSON = 'src/assets/xudts.json';
export const TOKEN_LIST_JSON = 'public/tokens/token_list.json';

export const logoUrl = (slug, ext = 'png') => `${SITE_URL}/logos/${slug}-logo.${ext}`;

// Characters that break URLs or file systems.
export const UNSAFE_SLUG = /[?#%\\<>"|*:`]|^\.|\.\./;
