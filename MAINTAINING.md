# Maintaining xudtlogos

This is the process for adding, updating and reviewing logos. Most of it is automated; maintainers mainly confirm *who* is submitting.

## How a logo gets onto the site

```
Project team                     Bot (GitHub Actions)                         Maintainer
────────────                     ────────────────────                         ──────────
Opens "Submit or update   ──▶    logo-submission.yml                          
a logo" issue form               • validates the form                          
                                 • downloads the image (GitHub uploads only)   
                                 • converts to square PNG ≤ 512px, makes a     
                                   100×100 thumbnail, checks the SVG           
                                 • xUDT: builds the token_list.json entry from 
                                   the args, checks the type hash and that the 
                                   token exists on mainnet                    
                     ◀── ❌ ──   comments what to fix (label needs-info);      
Edits the issue ───────────▶     runs again                                    
                         ✅ ──▶  pushes logo-submission/issue-N and opens a PR 
                                 (labels logo, token-info, pr-opened)          
                                 Netlify posts a deploy preview          ──▶   Reviews identity + preview, merges
                                                                               (the issue closes automatically)
                                 site-health.yml waits for the deploy and      
                                 checks every logo URL on xudtlogos.cc         
```

Hand-made pull requests (forks included) are checked by `pr-check.yml`, which comments the same kind of report and labels the PR.

## Reviewing a pull request

The bot checks file names, format, size, squareness, transparency, SVG safety, JSON validity, type hash ↔ type script, duplicates and that nothing live is deleted. A maintainer only needs to check what a bot cannot:

1. **Identity.** The submitter represents the project: a link from the official site or social account, or a known contributor.
2. **Brand.** The logo is the project's official logo and does not imitate another asset. Pay extra attention when the bot warns about a duplicate symbol.
3. **Live changes.** PRs labelled `changes-existing-logo` replace a logo every app already shows. Confirm the request is intended.
4. **Preview.** Open the Netlify deploy preview and the logo's page.

Then merge. Nothing else is needed: the site deploys and `site-health.yml` checks the result.

## Labels

| Label | Set by | Meaning |
|---|---|---|
| `logo-submission` | issue form | Issue is processed by the bot |
| `needs-info` | bot | Submission has problems; waiting for the submitter |
| `pr-opened` | bot | Submission passed; a pull request exists |
| `logo`, `token-info` | bot | What the PR changes |
| `changes-existing-logo` | bot | PR replaces, renames or removes something already live |
| `allow-logo-removal` | **maintainer** | Allows a PR to delete or rename a live logo or token entry |
| `checks-passed` / `checks-failed` | bot | Result of the logo check |
| `site-health` | bot | xudtlogos.cc is not serving some files; closed automatically on recovery |

## Rules that protect existing apps

- Logo URLs never change. Deleting or renaming a file under `public/logos/`, or removing a `token_list.json` entry, fails the check unless a maintainer adds `allow-logo-removal`.
- A submission can never take over another token's `token_list.json` entry; a type hash that is already registered under another name is rejected.
- Existing files are never re-encoded or resized automatically. Only new submissions are converted.

## One-time repository settings

- **Settings → Actions → General → Workflow permissions:** "Read and write permissions" and **"Allow GitHub Actions to create and approve pull requests"**. The submission bot needs this to open pull requests.
- Optional: branch protection on `master` requiring the `CI` and `Logo check` checks and one review.

## Where things live

| What | File |
|---|---|
| Specification limits, file name rule | `scripts/lib/rules.mjs` |
| Image and SVG checks, conversion | `scripts/lib/image.mjs` |
| token_list.json validation, type hash | `scripts/lib/tokens.mjs`, `scripts/lib/ckb.mjs` |
| Known UDT script deployments | `KNOWN_UDT_SCRIPTS` in `scripts/lib/ckb.mjs` |
| Issue form | `.github/ISSUE_TEMPLATE/logo-submission.yml` (labels must match `scripts/lib/issue-form.mjs`) |
| Workflows | `.github/workflows/` |

Run `npm test` after changing any rule.
