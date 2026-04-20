import React, { useEffect, useMemo, useState } from 'react';
import XudtLogoLoader from '../components/XudtLogoLoader';

// Mirror of the normalization rule used by XudtLogoLoader. Kept in sync
// deliberately; we do not import from the component because its file is
// intentionally self-contained for copy-paste use by DApp developers.
const normalizeSymbol = (s) =>
    String(s || '')
        .trim()
        .replace(/^\./, '')
        .replace(/[\s/]+/g, '-')
        .toLowerCase();

const REPO_BASE = 'https://github.com/CKBFansDAO/xudtlogos';
const FORK_URL = `${REPO_BASE}/fork`;
const NEW_PR_URL = `${REPO_BASE}/compare`;
const CLONE_URL = 'git@github.com:<your-username>/xudtlogos.git';

const CopyButton = ({ value, label = 'Copy', className = '' }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard unavailable (insecure context) */
        }
    };
    return (
        <button
            type='button'
            onClick={handleCopy}
            disabled={!value}
            className={`text-xs px-2 py-1 rounded bg-color-main text-white disabled:opacity-40 hover:opacity-90 transition-opacity ${className}`}
        >
            {copied ? 'Copied!' : label}
        </button>
    );
};

const OutputRow = ({ label, value, hint }) => (
    <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-2'>
            <span className='text-xs uppercase tracking-wide opacity-60'>{label}</span>
            <CopyButton value={value} />
        </div>
        <code className='block px-3 py-2 bg-[#f7f7f7] border border-[#e5e5e5] rounded text-sm break-all'>
            {value || <span className='opacity-40'>—</span>}
        </code>
        {hint && <span className='text-xs opacity-60'>{hint}</span>}
    </div>
);

// ---------- Tool 1: Existence checker ----------

const LogoExistenceChecker = () => {
    const [input, setInput] = useState('');
    const normalized = useMemo(() => normalizeSymbol(input), [input]);
    const [status, setStatus] = useState('idle'); // idle | loading | ok | missing

    useEffect(() => {
        if (!normalized) {
            setStatus('idle');
            return undefined;
        }
        setStatus('loading');
        const img = new Image();
        let cancelled = false;
        img.onload = () => !cancelled && setStatus('ok');
        img.onerror = () => !cancelled && setStatus('missing');
        img.src = `/logos/${normalized}-logo.png`;
        return () => {
            cancelled = true;
            img.onload = null;
            img.onerror = null;
        };
    }, [normalized]);

    const renderVerdict = () => {
        if (!input.trim()) {
            return <span className='text-sm opacity-60'>Enter a name to check.</span>;
        }
        if (status === 'loading') {
            return <span className='text-sm opacity-60'>Checking…</span>;
        }
        if (status === 'ok') {
            return (
                <div className='flex flex-col gap-1'>
                    <span className='text-sm text-green-600 font-semibold'>✓ Logo exists on xudtlogos.cc</span>
                    <span className='text-xs opacity-70'>
                        Resolved filename: <code className='px-1 bg-[#f0f0f0] rounded'>{normalized}-logo.png</code>
                    </span>
                </div>
            );
        }
        if (status === 'missing') {
            return (
                <div className='flex flex-col gap-2'>
                    <span className='text-sm text-red-600 font-semibold'>✗ No logo found for this name</span>
                    <span className='text-xs opacity-70'>
                        Expected filename would be <code className='px-1 bg-[#f0f0f0] rounded'>{normalized}-logo.png</code>.
                        If you own this asset, fork the repo, add the file locally, push to your fork, and open a pull request.
                    </span>
                    <a
                        href={FORK_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='self-start text-xs px-3 py-1.5 rounded bg-color-main text-white hover:opacity-90'
                    >
                        Fork the repo to submit a PR →
                    </a>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='flex flex-col gap-4 border border-[#e5e5e5] rounded-lg p-5 bg-white'>
            <div className='flex flex-col gap-1'>
                <span className='title text-lg text-color-maintext'>1. Check whether a logo already exists</span>
                <span className='text-sm opacity-75'>
                    Before submitting a PR, confirm that the xUDT / DOB logo is not already on xudtlogos.cc. Enter the raw name (e.g. <code className='px-1 bg-[#f0f0f0] rounded'>Nervape 3D</code>, <code className='px-1 bg-[#f0f0f0] rounded'>CKB</code>, <code className='px-1 bg-[#f0f0f0] rounded'>Nervape / B-Boat</code>) and we'll look it up using the same normalization that DApps use.
                </span>
            </div>
            <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='e.g. Nervape 3D'
                className='px-3 py-2 border border-[#ccc] rounded-md focus:outline-none focus:border-color-main'
            />
            <div className='flex flex-col md:flex-row gap-5'>
                <div className='md:w-1/3 flex items-center justify-center p-4 rounded-md bg-[#f7f7f7] border border-[#eee] min-h-[140px]'>
                    {input.trim() ? (
                        <XudtLogoLoader symbol={input} sizeStyle='h-24 w-24 text-4xl' />
                    ) : (
                        <span className='text-sm opacity-40'>preview</span>
                    )}
                </div>
                <div className='md:w-2/3 flex flex-col gap-3'>{renderVerdict()}</div>
            </div>
        </div>
    );
};

// ---------- Tool 2: Filename / URL / snippet generator ----------

const FilenameGenerator = () => {
    const [input, setInput] = useState('');
    const normalized = useMemo(() => normalizeSymbol(input), [input]);

    const pngName = normalized ? `${normalized}-logo.png` : '';
    const svgName = normalized ? `${normalized}-logo.svg` : '';
    const pngUrl = normalized ? `https://xudtlogos.cc/logos/${pngName}` : '';
    const snippet = normalized
        ? `<XudtLogoLoader symbol="${input.trim()}" sizeStyle="h-10 w-10 text-lg" />`
        : '';

    return (
        <div className='flex flex-col gap-4 border border-[#e5e5e5] rounded-lg p-5 bg-white'>
            <div className='flex flex-col gap-1'>
                <span className='title text-lg text-color-maintext'>2. Generate filenames & ready-to-use snippets</span>
                <span className='text-sm opacity-75'>
                    When preparing a PR, every uploaded logo <span className='title'>must</span> use the canonical filename so DApps across the ecosystem can load it. Paste the asset's display name and we'll produce everything you need.
                </span>
            </div>
            <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='e.g. Nervape 3D'
                className='px-3 py-2 border border-[#ccc] rounded-md focus:outline-none focus:border-color-main'
            />
            <div className='flex flex-col gap-3'>
                <OutputRow
                    label='Normalized symbol'
                    value={normalized}
                    hint='Lowercase, whitespace & slashes replaced with "-", leading dot stripped.'
                />
                <OutputRow
                    label='PNG filename (required)'
                    value={pngName}
                    hint='Commit this exact filename to public/logos/ in your PR.'
                />
                <OutputRow
                    label='SVG filename (optional)'
                    value={svgName}
                    hint='If you have a vector version, commit it alongside the PNG under the same base name.'
                />
                <OutputRow
                    label='Full URL on xudtlogos.cc'
                    value={pngUrl}
                    hint='What DApps will request once your PR is merged.'
                />
                <OutputRow
                    label='React usage snippet'
                    value={snippet}
                    hint='Paste into any React component that imports XudtLogoLoader.'
                />
            </div>
        </div>
    );
};

// ---------- Tool 3: Batch filename generator ----------

const BatchFilenameGenerator = () => {
    const [input, setInput] = useState('');

    const rows = useMemo(() => {
        return input
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((name) => ({ name, filename: `${normalizeSymbol(name)}-logo.png` }));
    }, [input]);

    const allFilenames = rows.map((r) => r.filename).join('\n');
    const tsv = rows.map((r) => `${r.name}\t${r.filename}`).join('\n');

    return (
        <div className='flex flex-col gap-4 border border-[#e5e5e5] rounded-lg p-5 bg-white'>
            <div className='flex flex-col gap-1'>
                <span className='title text-lg text-color-maintext'>3. Batch filename generator (for collections)</span>
                <span className='text-sm opacity-75'>
                    Uploading a whole DOB cluster or a set of xUDTs? Paste one name per line and get the full filename list. Great for sanity-checking a PR that includes many assets.
                </span>
            </div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={6}
                placeholder={'Nervape 3D\nNervape / B-Boat\nCKB\nRobert DOB0 Cluster'}
                className='px-3 py-2 border border-[#ccc] rounded-md focus:outline-none focus:border-color-main font-mono text-sm'
            />
            {rows.length > 0 && (
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs uppercase tracking-wide opacity-60'>
                            {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
                        </span>
                        <div className='flex gap-2'>
                            <CopyButton value={allFilenames} label='Copy filenames' />
                            <CopyButton value={tsv} label='Copy as TSV' />
                        </div>
                    </div>
                    <div className='border border-[#e5e5e5] rounded overflow-hidden'>
                        <table className='w-full text-sm'>
                            <thead className='bg-[#f7f7f7] text-xs uppercase tracking-wide opacity-70'>
                                <tr>
                                    <th className='text-left px-3 py-2'>Input name</th>
                                    <th className='text-left px-3 py-2'>Expected filename</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, i) => (
                                    <tr key={`${r.filename}-${i}`} className='border-t border-[#eee]'>
                                        <td className='px-3 py-2'>{r.name}</td>
                                        <td className='px-3 py-2'>
                                            <code>{r.filename}</code>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// ---------- Page ----------

const Tools = () => {
    return (
        <div className='w-full flex flex-col py-14 gap-10 text-base text-color-maintext'>
            <div className='flex flex-col gap-2'>
                <span className='text-2xl title'>Tools</span>
                <span className='text-sm opacity-75'>
                    Utilities for contributors and DApp developers. Check whether a logo already exists before opening a PR, generate the canonical filename for your upload, and prepare batches of assets at once. All normalization here matches the rule used by <span className='title'>XudtLogoLoader</span>, so what you see is what DApps see.
                </span>
            </div>

            <LogoExistenceChecker />
            <FilenameGenerator />
            <BatchFilenameGenerator />

            <div className='flex flex-col gap-4 border-t border-[#eee] pt-8'>
                <span className='title text-lg'>How to submit a logo PR</span>
                <span className='text-sm opacity-75'>
                    xudtlogos uses the standard GitHub fork-and-PR workflow. GitHub's direct web-upload will be rejected with <code className='px-1 bg-[#f0f0f0] rounded'>Uploads are disabled</code> for non-committers, so you need to fork the repo first and push from your own fork. Project teams typically have a developer who is comfortable with this flow; it takes about five minutes.
                </span>

                <div className='flex flex-col gap-2'>
                    <span className='text-sm font-semibold'>Step 1 — Fork the repository</span>
                    <span className='text-xs opacity-70'>
                        Click the button below (or the <span className='title'>Fork</span> button on the GitHub repo page). You only need to do this once.
                    </span>
                    <a
                        href={FORK_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='self-start text-sm px-4 py-2 rounded bg-color-main text-white hover:opacity-90'
                    >
                        Fork CKBFansDAO/xudtlogos →
                    </a>
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='text-sm font-semibold'>Step 2 — Clone your fork and create a branch</span>
                    <span className='text-xs opacity-70'>
                        Replace <code className='px-1 bg-[#f0f0f0] rounded'>&lt;your-username&gt;</code> with your GitHub username. Use HTTPS (<code className='px-1 bg-[#f0f0f0] rounded'>https://github.com/&lt;your-username&gt;/xudtlogos.git</code>) if you don't have SSH keys configured.
                    </span>
                    <div className='relative'>
                        <div className='absolute top-2 right-2'>
                            <CopyButton value={`git clone ${CLONE_URL}\ncd xudtlogos\ngit checkout -b add-<asset>-logo`} />
                        </div>
                        <pre className='bg-[#1e1e1e] text-[#d4d4d4] text-xs md:text-sm rounded-md p-4 overflow-x-auto border border-[#333]'>
                            <code>{`git clone ${CLONE_URL}
cd xudtlogos
git checkout -b add-<asset>-logo`}</code>
                        </pre>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='text-sm font-semibold'>Step 3 — Add the logo file(s)</span>
                    <span className='text-xs opacity-70'>
                        Place your PNG (and optional SVG) under <code className='px-1 bg-[#f0f0f0] rounded'>public/logos/</code>, named exactly as <span className='title'>Tool 2</span> generated (e.g. <code className='px-1 bg-[#f0f0f0] rounded'>nervape-3d-logo.png</code>). Ensure it matches the <a className='text-color-main title' href={`${REPO_BASE}/blob/master/README.md#logo-specifications`} target='_blank' rel='noopener noreferrer'>Logo Specifications</a>.
                    </span>
                    <span className='text-xs opacity-70'>
                        For <span className='title'>xUDT tokens</span> (not DOBs), also add a registry entry to <code className='px-1 bg-[#f0f0f0] rounded'>src/assets/xudts.json</code> so it appears on the home page. The top-level key must equal the normalized filename prefix:
                    </span>
                    <div className='relative'>
                        <div className='absolute top-2 right-2'>
                            <CopyButton value={`"ckb": {\n  "name": "CKB",\n  "symbol": "CKB"\n}`} />
                        </div>
                        <pre className='bg-[#1e1e1e] text-[#d4d4d4] text-xs md:text-sm rounded-md p-4 overflow-x-auto border border-[#333]'>
                            <code>{`"ckb": {
  "name": "CKB",
  "symbol": "CKB"
}`}</code>
                        </pre>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='text-sm font-semibold'>Step 4 — Test locally (optional but recommended)</span>
                    <span className='text-xs opacity-70'>
                        Run the dev server and navigate to <code className='px-1 bg-[#f0f0f0] rounded'>/tools</code> to verify your logo renders with Tool 1 before pushing.
                    </span>
                    <div className='relative'>
                        <div className='absolute top-2 right-2'>
                            <CopyButton value={`npm install\nnpm start`} />
                        </div>
                        <pre className='bg-[#1e1e1e] text-[#d4d4d4] text-xs md:text-sm rounded-md p-4 overflow-x-auto border border-[#333]'>
                            <code>{`npm install
npm start`}</code>
                        </pre>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='text-sm font-semibold'>Step 5 — Commit and push to your fork</span>
                    <div className='relative'>
                        <div className='absolute top-2 right-2'>
                            <CopyButton value={`git add public/logos/<filename>-logo.png src/assets/xudts.json\ngit commit -m "Add <asset> logo"\ngit push -u origin add-<asset>-logo`} />
                        </div>
                        <pre className='bg-[#1e1e1e] text-[#d4d4d4] text-xs md:text-sm rounded-md p-4 overflow-x-auto border border-[#333]'>
                            <code>{`git add public/logos/<filename>-logo.png src/assets/xudts.json
git commit -m "Add <asset> logo"
git push -u origin add-<asset>-logo`}</code>
                        </pre>
                    </div>
                    <span className='text-xs opacity-70'>
                        Omit <code className='px-1 bg-[#f0f0f0] rounded'>src/assets/xudts.json</code> from <code className='px-1 bg-[#f0f0f0] rounded'>git add</code> if you're only submitting a DOB logo.
                    </span>
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='text-sm font-semibold'>Step 6 — Open a pull request</span>
                    <span className='text-xs opacity-70'>
                        After the push, GitHub will show a yellow banner on your fork with a <span className='title'>Compare &amp; pull request</span> button. Click it, fill in a short description, and submit.
                    </span>
                    <a
                        href={NEW_PR_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='self-start text-sm px-4 py-2 rounded border border-color-main text-color-main hover:bg-color-main hover:text-white transition-colors'
                    >
                        Open a new pull request →
                    </a>
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='text-sm font-semibold'>Step 7 — Verify the Netlify preview</span>
                    <span className='text-xs opacity-70'>
                        Within about a minute, a <span className='title'>Deploy Preview</span> link from the netlify bot will appear in the PR comments (URL shape: <code className='px-1 bg-[#f0f0f0] rounded'>https://deploy-preview-&lt;PR#&gt;--&lt;site&gt;.netlify.app</code>). Open it, go to <code className='px-1 bg-[#f0f0f0] rounded'>/tools</code> on the preview site, and run Tool 1 with the asset name. If the logo renders, the PR is ready for a maintainer.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Tools;
