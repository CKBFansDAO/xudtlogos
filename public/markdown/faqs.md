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
