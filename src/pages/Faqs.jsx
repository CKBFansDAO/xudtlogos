import React from 'react';
import { Link } from 'react-router-dom';
import MarkdownViewer from '../components/markdownviewer/MarkdownViewer'

const REPO_BASE = 'https://github.com/CKBFansDAO/xudtlogos';
const FORK_URL = `${REPO_BASE}/fork`;
const ISSUES_URL = `${REPO_BASE}/issues`;

const Faqs = () => {

    return (
        <div className='w-full flex flex-col py-14 gap-14 text-base text-color-maintext'>
            <span className='text-2xl title'>FAQs</span>
            <div className='flex flex-col gap-5'>
                <span className='title text-lg '>
                    How to display xUDT logo on Dapps?
                </span>
                <div className='w-full flex flex-col'>
                    <MarkdownViewer filePath={'/markdown/faqs.md'}></MarkdownViewer>
                </div>
            </div>

            <div className='flex flex-col gap-5'>
                <span className='title text-lg '>
                    How to submit a new xUDT logo?
                </span>
                <span>
                    New logos are accepted via <span className='title'>pull request from a fork</span>. This is the standard GitHub contribution flow — about five minutes for anyone familiar with git. Direct web uploads to this repo are disabled (GitHub will show <code className='px-1 bg-[#f0f0f0] rounded'>Uploads are disabled</code> without push access), so you need to fork first.
                </span>
                <ol className='list-decimal list-inside flex flex-col gap-2 pl-2'>
                    <li>
                        On the <Link to='/tools' className='title text-color-main'>Tools</Link> page, use <span className='title'>Tool 1</span> to confirm the asset does not already have a logo.
                    </li>
                    <li>
                        Use <span className='title'>Tool 2</span> to generate the canonical filename — e.g. <code className='px-1 bg-[#f0f0f0] rounded'>CKB</code> → <code className='px-1 bg-[#f0f0f0] rounded'>ckb-logo.png</code>. Rename your PNG (and optional SVG) to exactly this filename and ensure it meets the <a className='title text-color-main' href={`${REPO_BASE}/blob/master/README.md#logo-specifications`} target='_blank' rel='noopener noreferrer'>Logo Specifications</a>.
                    </li>
                    <li>
                        <a className='title text-color-main' href={FORK_URL} target='_blank' rel='noopener noreferrer'>Fork the repository</a>, then clone your fork and create a branch:
                        <pre className='mt-2 p-3 bg-[#1e1e1e] text-[#d4d4d4] border border-[#333] rounded text-xs overflow-x-auto'><code>{`git clone git@github.com:<your-username>/xudtlogos.git
cd xudtlogos
git checkout -b add-<asset>-logo`}</code></pre>
                    </li>
                    <li>
                        Drop your file into <code className='px-1 bg-[#f0f0f0] rounded'>public/logos/</code>. For xUDT tokens, also add a registry entry to <code className='px-1 bg-[#f0f0f0] rounded'>src/assets/xudts.json</code> so the token appears on the home page — the top-level key must equal the normalized filename prefix:
                        <pre className='mt-2 p-3 bg-[#1e1e1e] text-[#d4d4d4] border border-[#333] rounded text-xs overflow-x-auto'><code>{`"ckb": {
  "name": "CKB",
  "symbol": "CKB"
}`}</code></pre>
                    </li>
                    <li>
                        (Optional but recommended) Run the dev server and visit <code className='px-1 bg-[#f0f0f0] rounded'>/tools</code> locally to verify with Tool 1:
                        <pre className='mt-2 p-3 bg-[#1e1e1e] text-[#d4d4d4] border border-[#333] rounded text-xs overflow-x-auto'><code>{`npm install
npm start`}</code></pre>
                    </li>
                    <li>
                        Commit and push to your fork, then open a pull request against <code className='px-1 bg-[#f0f0f0] rounded'>CKBFansDAO/xudtlogos:master</code>:
                        <pre className='mt-2 p-3 bg-[#1e1e1e] text-[#d4d4d4] border border-[#333] rounded text-xs overflow-x-auto'><code>{`git add public/logos/<filename>-logo.png src/assets/xudts.json
git commit -m "Add <asset> logo"
git push -u origin add-<asset>-logo`}</code></pre>
                        GitHub will surface a <span className='title'>Compare &amp; pull request</span> banner on your fork after the push.
                    </li>
                    <li>
                        Verify via the Netlify preview link posted in the PR comments — see "How to verify a submitted PR" below.
                    </li>
                </ol>
                <span className='text-sm opacity-70'>
                    The <Link to='/tools' className='title text-color-main'>Tools</Link> page has the full walkthrough with copy-pastable commands at the bottom.
                </span>
                <a
                    className='self-start font-bold text-center rounded px-4 py-2 bg-color-main text-white hover:opacity-90'
                    href={FORK_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Fork the repository →
                </a>
            </div>

            <div className='flex flex-col gap-5'>
                <span className='title text-lg '>
                    How to submit a DOB cluster logo?
                </span>
                <span>
                    DOB (Digital Object) clusters use the same fork-and-PR flow as xUDT logos. The only difference is what the "symbol" represents: for a DOB cluster it is the cluster display name (e.g. <code className='px-1 bg-[#f0f0f0] rounded'>Nervape 3D</code>, <code className='px-1 bg-[#f0f0f0] rounded'>Nervape / B-Boat</code>, <code className='px-1 bg-[#f0f0f0] rounded'>Robert DOB0 Cluster</code>), normalized to kebab-case.
                </span>
                <ol className='list-decimal list-inside flex flex-col gap-2 pl-2'>
                    <li>
                        Use <Link to='/tools' className='title text-color-main'>Tool 1</Link> to confirm the cluster doesn't already have a logo. Whitespace, slashes, mixed case, and leading dots are all normalized — so <code className='px-1 bg-[#f0f0f0] rounded'>Nervape 3D</code> and <code className='px-1 bg-[#f0f0f0] rounded'>nervape-3d</code> check the same file.
                    </li>
                    <li>
                        Use <span className='title'>Tool 2</span> (or <span className='title'>Tool 3</span> when uploading many DOBs at once) to generate the canonical filename — e.g. <code className='px-1 bg-[#f0f0f0] rounded'>Nervape 3D</code> → <code className='px-1 bg-[#f0f0f0] rounded'>nervape-3d-logo.png</code>.
                    </li>
                    <li>
                        Follow the same <span className='title'>fork → clone → branch → commit → push → PR</span> steps as for xUDT (see above or the <Link to='/tools' className='title text-color-main'>Tools</Link> page). Place the file(s) under <code className='px-1 bg-[#f0f0f0] rounded'>public/logos/</code> with the generated filename.
                    </li>
                    <li>
                        DOBs do <span className='title'>not</span> need to be added to <code className='px-1 bg-[#f0f0f0] rounded'>src/assets/xudts.json</code> — that registry is for xUDT tokens displayed on the home page. DApps render DOB logos by URL directly.
                    </li>
                    <li>
                        Open the PR and verify via the Netlify preview (next question).
                    </li>
                </ol>
                <a
                    className='self-start font-bold text-center rounded px-4 py-2 bg-color-main text-white hover:opacity-90'
                    href={FORK_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Fork the repository →
                </a>
            </div>

            <div className='flex flex-col gap-5'>
                <span className='title text-lg '>
                    How to verify a submitted PR renders correctly?
                </span>
                <span>
                    Every pull request triggers an automatic Netlify preview deploy. You can see exactly what xudtlogos.cc will look like once your PR is merged — without waiting for a maintainer to review.
                </span>
                <ol className='list-decimal list-inside flex flex-col gap-2 pl-2'>
                    <li>
                        After opening the PR, wait roughly a minute. The <span className='title'>netlify</span> bot will post a comment containing a <span className='title'>Deploy Preview</span> link (URL shape: <code className='px-1 bg-[#f0f0f0] rounded'>https://deploy-preview-&lt;PR#&gt;--&lt;site&gt;.netlify.app</code>).
                    </li>
                    <li>
                        Open the preview link. Navigate to <code className='px-1 bg-[#f0f0f0] rounded'>/tools</code> on the preview site and run <span className='title'>Tool 1</span> with the asset name — if the logo displays, you're done.
                    </li>
                    <li>
                        Alternatively, hit the file URL directly: <code className='px-1 bg-[#f0f0f0] rounded'>&lt;preview-url&gt;/logos/&lt;your-filename&gt;-logo.png</code>. A 200 response means the PR is ready to merge.
                    </li>
                    <li>
                        For xUDT entries, also verify the home page lists your project (it reads <code className='px-1 bg-[#f0f0f0] rounded'>src/assets/xudts.json</code>).
                    </li>
                    <li>
                        If the preview fails or the logo doesn't render, re-check the filename with <span className='title'>Tool 2</span>, fix, and push again — the preview re-deploys automatically.
                    </li>
                </ol>
                <span className='text-sm opacity-70'>
                    Tip: if Netlify's comment bot doesn't post within a few minutes, check the PR's <span className='title'>Checks</span> tab — the preview URL is also available there.
                </span>
            </div>

            <div className='flex flex-col gap-5'>
                <span className='title text-lg '>
                    How to update or remove a logo?
                </span>
                <span>
                    Use the same fork-and-PR flow. To <span className='title'>update</span>, commit the new file with the same canonical filename under <code className='px-1 bg-[#f0f0f0] rounded'>public/logos/</code> on your fork and open a PR. To <span className='title'>remove</span>, open a PR deleting the file (and its entry in <code className='px-1 bg-[#f0f0f0] rounded'>xudts.json</code> if applicable) and briefly explain the reason (e.g. official rebrand, brand-owner request). If you cannot submit a PR yourself, open an <a className='title text-color-main' href={ISSUES_URL} target='_blank' rel='noopener noreferrer'>issue</a> with the details; these receive lower priority than PRs.
                </span>
            </div>
            <div className='flex flex-col gap-5'>
                <span className='title text-lg '>
                    What are the differences between SVG and PNG file formats?
                </span>
                <span>
                    SVG and PNG are two common file formats used for images. The main difference between the two is the way they represent graphics. PNG files are made up of pixels, while SVG files are made up of vectors.
                </span>
                <span>
                    Pixels are tiny squares of color that are arranged in a grid to create an image. When you zoom in on a PNG image, you can see the individual pixels that make up the image. This is why PNG images can appear blurry or pixelated when they are resized or zoomed in.
                </span>
                <span>
                    Vectors, on the other hand, are made up of lines and shapes that are defined by mathematical equations. This means that SVG images can be scaled up or down without losing quality. When you zoom in on an SVG image, the lines and shapes remain sharp and clear, no matter how much you zoom in.
                </span>
                <span>
                    For this reason, SVG is generally considered the better option for images that need to be resized or scaled, such as logos or icons. Additionally, SVG files can be used as a source and easily converted to other formats, including PNG. PNG files, on the other hand, cannot be converted into vectors, so it's important to prioritize using SVG as a source when possible.
                </span>
            </div>
            <div className='flex flex-col gap-5'>
                <span className='title text-lg '>
                    Are xUDT logos protected by intellectual property laws, or can they be used without restriction?
                </span>
                <span>
                    Check the official brand guidelines (brandbook) on the xUDT project's website for logo usage information.
                </span>
                <span>
                    If no guidelines are available, contact the project team for permission.
                </span>
            </div>
        </div>
    );
}

export default Faqs;
