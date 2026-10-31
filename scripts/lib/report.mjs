// Markdown report shared by the PR check and the submission bot.
export const MARKER = '<!-- xudtlogos-check -->';

const esc = (s) => String(s).replace(/\|/g, '\\|');

export function renderReport({ title, rows, preexisting = [], footer = '' }) {
  const errors = rows.flatMap((r) => r.errors.map((e) => `\`${r.file}\`: ${e}`));
  const warnings = rows.flatMap((r) => r.warnings.map((w) => `\`${r.file}\`: ${w}`));
  const ok = errors.length === 0;
  const lines = [MARKER, `## ${ok ? '✅' : '❌'} ${title}: ${ok ? 'all checks passed' : `${errors.length} problem${errors.length > 1 ? 's' : ''} to fix`}`, ''];

  if (rows.length) {
    lines.push('| Preview | File | Details | Result |', '|:-:|---|---|:-:|');
    for (const r of rows) {
      const prev = r.preview ? `<img src="${r.preview}" width="48" height="48" alt="">` : '';
      const res = r.errors.length ? '❌' : r.warnings.length ? '⚠️' : '✅';
      lines.push(`| ${prev} | \`${esc(r.file)}\`<br><sub>${r.status}</sub> | ${esc(r.details || '')} | ${res} |`);
    }
    lines.push('');
  }
  if (errors.length) lines.push('### Problems to fix', '', ...errors.map((e) => `- ${e}`), '');
  if (warnings.length) lines.push('### Warnings', '', ...warnings.map((w) => `- ${w}`), '');
  if (preexisting.length) {
    lines.push('<details><summary>Problems that already exist on master (not caused by this change)</summary>', '', ...preexisting.map((p) => `- ${p}`), '', '</details>', '');
  }
  if (footer) lines.push(footer);
  return { markdown: lines.join('\n'), ok, errors, warnings };
}
