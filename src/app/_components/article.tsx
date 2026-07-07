import Link from "next/link";

export function ArticlePage({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center text-white font-bold">M</div>
            <span className="font-semibold tracking-tight">名片王 <span className="text-[var(--gold)]">Pro</span></span>
          </Link>
          <Link href="/" className="btn-ghost text-sm">← 回首頁</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16 prose prose-invert">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">{title}</h1>
        {updated && <p className="text-sm text-[var(--text-tertiary)] mb-10">最後更新：{updated}</p>}
        <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
          {children}
        </div>
      </article>
    </>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}