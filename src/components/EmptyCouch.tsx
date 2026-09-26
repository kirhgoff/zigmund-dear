import { Sofa } from 'lucide-react';

type Props = { testId: string };

export const EmptyCouch = ({ testId }: Props) => (
  <div className="rounded-xl border border-dashed border-border p-12 text-center">
    <Sofa className="mx-auto size-12 text-muted-foreground" strokeWidth={1.5} />
    <h2 className="mt-6 font-heading text-3xl">The couch is empty.</h2>
    <p className="mt-3 text-muted-foreground">
      No transcripts yet. Add OPENROUTER_API_KEY to .env, then:
    </p>
    <p className="mt-4 font-mono text-sm">bun run take-test {testId}</p>
  </div>
);
