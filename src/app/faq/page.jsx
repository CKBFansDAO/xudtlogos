import fs from 'node:fs';
import path from 'node:path';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata = {
  title: 'FAQ',
  description: 'How to submit, update and integrate xUDT and DOB logos from xudtlogos.cc.',
};

// The FAQ source stays at public/markdown/faqs.md (also served as a raw file).
const source = () => fs.readFileSync(path.join(process.cwd(), 'public', 'markdown', 'faqs.md'), 'utf8');

const textOf = (node) =>
  typeof node === 'string' ? node : Array.isArray(node) ? node.map(textOf).join('') : node?.props ? textOf(node.props.children) : '';

const anchor = (text) =>
  text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);

export default function FaqPage() {
  const md = source();
  const questions = [...md.matchAll(/^### (.+)$/gm)].map((m) => m[1].trim());

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">FAQ</h1>
        <nav aria-label="Questions">
          <ol className="flex flex-col gap-1 text-sm">
            {questions.map((q) => (
              <li key={q}>
                <a href={`#${anchor(q)}`} className="block rounded-md px-2 py-1.5 text-sub hover:bg-wash hover:text-ink">{q}</a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <article className="prose prose-slate min-w-0 max-w-none prose-headings:scroll-mt-20 prose-h3:mt-12 prose-h3:border-t prose-h3:border-line prose-h3:pt-8 prose-h3:text-xl prose-a:text-brand prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-wash prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-pre:bg-ink prose-pre:text-[#CFE3F5] prose-table:block prose-table:overflow-x-auto [&>h3:first-child]:mt-0 [&>h3:first-child]:border-0 [&>h3:first-child]:pt-0">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h3: ({ children }) => <h3 id={anchor(textOf(children))}>{children}</h3>,
            a: ({ href, children }) => (
              <a href={href} {...(/^https?:/.test(href || '') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>
            ),
          }}
        >
          {md}
        </Markdown>
      </article>
    </div>
  );
}
