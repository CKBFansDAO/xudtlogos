import CopyButton from './CopyButton';

export default function CodeBlock({ code, label, className = '' }) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      {label && <div className="mb-1.5 eyebrow">{label}</div>}
      <div className="relative">
        <pre className="overflow-x-auto rounded-lg bg-ink p-4 pr-20 text-[12.5px] leading-relaxed text-[#CFE3F5]">
          <code>{code}</code>
        </pre>
        <CopyButton value={code} className="absolute right-2 top-2 border-white/20 bg-white/10 text-white hover:border-white hover:text-white" />
      </div>
    </div>
  );
}
