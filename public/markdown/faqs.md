### How do I display xUDT logos in my DApp?

Create a single file named `XudtLogoLoader.jsx` and paste the following code. Caching is handled **inside the component** — consumers only import this one file and render `<XudtLogoLoader symbol="..." />`. No extra modules, no `localStorage`, no configuration.

```jsx
import React, { useEffect, useState } from "react";

// Session-level Set of symbols known to 404. String-only, tiny memory
// footprint, automatically cleared on reload. Successful logos are
// deduplicated by the browser's HTTP cache; we do not track them here.
const missingSymbols = new Set();

// Normalize symbols so varying casing / whitespace / leading dots from
// different data sources all resolve to the same logo URL and cache key.
const normalizeSymbol = (s) =>
  String(s || "")
    .trim()
    .replace(/^\./, "")
    .replace(/[\s/]+/g, "-")
    .toLowerCase();

const XudtLogoLoader = ({ symbol, sizeStyle }) => {
  const normalized = normalizeSymbol(symbol);
  const [loadFailed, setLoadFailed] = useState(() =>
    missingSymbols.has(normalized)
  );

  const handleLoadError = () => {
    missingSymbols.add(normalized);
    setLoadFailed(true);
  };

  useEffect(() => {
    setLoadFailed(missingSymbols.has(normalizeSymbol(symbol)));
  }, [symbol]);

  const initial = (symbol && symbol.charAt(0).toUpperCase()) || "?";

  return (
    <div>
      {loadFailed ? (
        // Display the first letter of the symbol when loading fails
        <div className={`${sizeStyle || "h-40 w-40 text-[96px]"} rounded-full bg-[#378ACA] text-black font-bold flex items-center place-content-center`}>
          {initial}
        </div>
      ) : (
        // Display the logo image when the logo is loaded successfully.
        // `loading="lazy"` defers offscreen logos. Always use the same URL
        // (no random cache-busting params) so the browser HTTP cache works.
        <img
          className={`${sizeStyle || "h-40 w-40"}`}
          src={`https://xudtlogos.cc/logos/${normalized}-logo.png`}
          alt={`xudt-${normalized}-logo`}
          loading="lazy"
          decoding="async"
          onError={handleLoadError}
        />
      )}
    </div>
  );
};

export default XudtLogoLoader;
```

Use `XudtLogoLoader`:
```jsx
    <XudtLogoLoader symbol={xudtInfo.symbol} sizeStyle={'w-24 h-24 text-5xl'}></XudtLogoLoader>
```
We assume that the data object containing the xUDT symbol field is called xudtInfo.

>The CSS styles in the above code are provided as an example using tailwindcss. You can adjust them according to your own application.

### How would you implement a logo caching mechanism in your DApp to minimize repeated requests to xudtlogos.cc?

**Short answer:** for the overwhelming majority of DApps, you don't write a cache — you let the browser do it and make sure you don't accidentally defeat it. The `XudtLogoLoader` component above already encapsulates the one small piece of logic that the browser does *not* handle (deduplicating 404s within a session).

**Why the browser is already doing most of the work:**

1. **HTTP cache (automatic, free).** `https://xudtlogos.cc/logos/{symbol}-logo.png` is served as a static asset from a CDN with long-lived `Cache-Control` headers. The first `<img>` in your app triggers one network request; every subsequent `<img>` pointing to the **same URL** — whether in the same component, another route, or after a full reload — is served from the browser's disk cache with zero network traffic. A marketplace rendering the same logo a thousand times makes one request.
2. **Rule 1 for preserving this:** use a stable URL. Do **not** append `?t=${Date.now()}` or random query strings. Do not encode the symbol inconsistently (pick lowercase and stick to it).
3. **Rule 2:** use `loading="lazy"` so offscreen logos in long lists never even start loading until scrolled into view.

**What the browser does *not* give you, and what the component handles:**

- A 404 response is cached by the browser, but some browsers still revalidate it, and React remounts could otherwise trigger fresh requests for symbols you already know don't exist. The component keeps a module-level `Set<string>` of missing symbols for the current session. This is a handful of bytes per entry, **not persisted**, and garbage-collected on reload so that newly-uploaded logos are picked up naturally.

**Why we deliberately do *not* use `localStorage` / `IndexedDB`:**

- `localStorage` has a ~5 MB per-origin budget shared with the rest of the app. A marketplace touching thousands of symbols would bloat it and risk evicting more important state.
- It duplicates what the browser HTTP cache already stores (for successful logos) or adds negligible value (for missing ones — a fresh session re-checking a 404 costs one small request).
- Persisting "missing" status across reloads actively *hurts* UX: a logo uploaded today would still render as a fallback for users whose TTL hasn't expired.

**When to reach for something heavier:**

| Need | Tool |
|---|---|
| Default case (online, SPA) | **Nothing beyond the component.** Browser HTTP cache + session `Set` is enough. |
| Offline / PWA support | **Service Worker** with a `stale-while-revalidate` strategy on `xudtlogos.cc/logos/*`. Bounded by you, not by `localStorage` quota. |
| You must bundle binaries into an installable app | **Cache API** (inside a Service Worker) or **IndexedDB** storing Blobs, with an LRU eviction policy you control. |

**Cache invalidation:**

- Successful logos: handled by HTTP `Cache-Control` headers on the CDN. No app-level policy required.
- Missing logos: cleared automatically on reload (session-scoped `Set`). If you need an in-session refresh, re-render `XudtLogoLoader` with a `key` prop change after clearing the `Set` (you can expose a helper that calls `missingSymbols.clear()` if you control the file).
- Binary assets: if the `xudtlogos.cc` team publishes a new PNG for the same symbol, they ship it under the same URL with updated `ETag`/`Last-Modified`, and the browser revalidates automatically. Consumers do nothing.

### How to submit a new xUDT logo?

New logos are accepted via **pull request from a fork**. This is the standard GitHub contribution flow — about five minutes for anyone familiar with git. Direct web uploads to this repo are disabled (GitHub will show `Uploads are disabled` without push access), so you need to fork first.

1. On the [Tools](/tools) page, use **Tool 1** to confirm the asset does not already have a logo.
2. Use **Tool 2** to generate the canonical filename — e.g. `CKB` → `ckb-logo.png`. Rename your PNG (and optional SVG) to exactly this filename and ensure it meets the [Logo Specifications](https://github.com/CKBFansDAO/xudtlogos/blob/master/README.md#logo-specifications).
3. [Fork the repository](https://github.com/CKBFansDAO/xudtlogos/fork), then clone your fork and create a branch:

```bash
git clone git@github.com:<your-username>/xudtlogos.git
cd xudtlogos
git checkout -b add-<asset>-logo
```

4. Drop your file into `public/logos/`. For xUDT tokens, also add a registry entry to `src/assets/xudts.json` so the token appears on the home page — the top-level key must equal the normalized filename prefix:

```json
"ckb": {
  "name": "CKB",
  "symbol": "CKB"
}
```

5. (Optional but recommended) Run the dev server and visit `/tools` locally to verify with Tool 1:

```bash
npm install
npm start
```

6. Commit and push to your fork, then open a pull request against `CKBFansDAO/xudtlogos:master`:

```bash
git add public/logos/<filename>-logo.png src/assets/xudts.json
git commit -m "Add <asset> logo"
git push -u origin add-<asset>-logo
```

GitHub will surface a **Compare & pull request** banner on your fork after the push.

7. Verify via the Netlify preview link posted in the PR comments — see "How to verify a submitted PR" below.

The [Tools](/tools) page has the full walkthrough with copy-pastable commands at the bottom.

[Fork the repository →](https://github.com/CKBFansDAO/xudtlogos/fork)

### How to submit a DOB cluster logo?

DOB (Digital Object) clusters use the same fork-and-PR flow as xUDT logos. The only difference is what the "symbol" represents: for a DOB cluster it is the cluster display name (e.g. `Nervape 3D`, `Nervape / B-Boat`, `Robert DOB0 Cluster`), normalized to kebab-case.

1. Use [Tool 1](/tools) to confirm the cluster doesn't already have a logo. Whitespace, slashes, mixed case, and leading dots are all normalized — so `Nervape 3D` and `nervape-3d` check the same file.
2. Use **Tool 2** (or **Tool 3** when uploading many DOBs at once) to generate the canonical filename — e.g. `Nervape 3D` → `nervape-3d-logo.png`.
3. Follow the same **fork → clone → branch → commit → push → PR** steps as for xUDT (see above or the [Tools](/tools) page). Place the file(s) under `public/logos/` with the generated filename.
4. DOBs do **not** need to be added to `src/assets/xudts.json` — that registry is for xUDT tokens displayed on the home page. DApps render DOB logos by URL directly.
5. Open the PR and verify via the Netlify preview (next question).

[Fork the repository →](https://github.com/CKBFansDAO/xudtlogos/fork)

### How to verify a submitted PR renders correctly?

Every pull request triggers an automatic Netlify preview deploy. You can see exactly what xudtlogos.cc will look like once your PR is merged — without waiting for a maintainer to review.

1. After opening the PR, wait roughly a minute. The **netlify** bot will post a comment containing a **Deploy Preview** link (URL shape: `https://deploy-preview-<PR#>--<site>.netlify.app`).
2. Open the preview link. Navigate to `/tools` on the preview site and run **Tool 1** with the asset name — if the logo displays, you're done.
3. Alternatively, hit the file URL directly: `<preview-url>/logos/<your-filename>-logo.png`. A 200 response means the PR is ready to merge.
4. For xUDT entries, also verify the home page lists your project (it reads `src/assets/xudts.json`).
5. If the preview fails or the logo doesn't render, re-check the filename with **Tool 2**, fix, and push again — the preview re-deploys automatically.

Tip: if Netlify's comment bot doesn't post within a few minutes, check the PR's **Checks** tab — the preview URL is also available there.

### How to update or remove a logo?

Use the same fork-and-PR flow. To **update**, commit the new file with the same canonical filename under `public/logos/` on your fork and open a PR. To **remove**, open a PR deleting the file (and its entry in `xudts.json` if applicable) and briefly explain the reason (e.g. official rebrand, brand-owner request). If you cannot submit a PR yourself, open an [issue](https://github.com/CKBFansDAO/xudtlogos/issues) with the details; these receive lower priority than PRs.

### What are the differences between SVG and PNG file formats?

SVG and PNG are two common file formats used for images. The main difference between the two is the way they represent graphics. PNG files are made up of pixels, while SVG files are made up of vectors.

Pixels are tiny squares of color that are arranged in a grid to create an image. When you zoom in on a PNG image, you can see the individual pixels that make up the image. This is why PNG images can appear blurry or pixelated when they are resized or zoomed in.

Vectors, on the other hand, are made up of lines and shapes that are defined by mathematical equations. This means that SVG images can be scaled up or down without losing quality. When you zoom in on an SVG image, the lines and shapes remain sharp and clear, no matter how much you zoom in.

For this reason, SVG is generally considered the better option for images that need to be resized or scaled, such as logos or icons. Additionally, SVG files can be used as a source and easily converted to other formats, including PNG. PNG files, on the other hand, cannot be converted into vectors, so it's important to prioritize using SVG as a source when possible.

### Are xUDT logos protected by intellectual property laws, or can they be used without restriction?

Check the official brand guidelines (brandbook) on the xUDT project's website for logo usage information.

If no guidelines are available, contact the project team for permission.
