type Props = { testId: string };

export const EmptyCouch = ({ testId }: Props) => (
  <div className="rounded-zd-2xl border border-dashed border-zd-line-dashed p-12 text-center">
    <p className="font-serif text-zd-title text-zd-accent">Ψ</p>
    <h2 className="mt-6 font-serif text-zd-section text-zd-text-hi">The couch is empty.</h2>
    <p className="mt-3 text-zd-body text-zd-text-lede">
      No transcripts yet. Add OPENROUTER_API_KEY to .env, then:
    </p>
    <p className="mt-4 font-mono text-zd-sm text-zd-text-2">bun run take-test {testId}</p>
  </div>
);
