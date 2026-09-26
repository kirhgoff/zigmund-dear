import { bandTextClass } from './ScoreMeter';

type Score = { score: number; severity: number | null };
type Row = {
  modelSlug: string;
  modelName: string;
  vendor: string;
  scores: Record<string, Score>;
};
type Props = { subscales: Array<{ id: string; short: string }>; rows: Row[] };

export const ModelList = ({ subscales, rows }: Props) => (
  <nav
    aria-label="Models"
    className="overflow-hidden rounded-zd-xl border border-zd-line bg-zd-surface"
  >
    {rows.map((row) => (
      <a
        key={row.modelSlug}
        href={`#${row.modelSlug}`}
        data-model={row.modelSlug}
        className="flex items-center justify-between gap-3 border-t border-zd-line-soft px-4.5 py-3.5 text-zd-text first:border-t-0 hover:bg-zd-surface-hover"
      >
        <span className="min-w-0">
          <span className="block truncate text-zd-ui font-medium">{row.modelName}</span>
          <span className="block text-zd-mono text-zd-text-faint">{row.vendor}</span>
        </span>
        <span className="flex shrink-0 flex-wrap justify-end gap-2.5 font-mono text-zd-mono tabular-nums">
          {subscales.map((subscale) => {
            const score = row.scores[subscale.id];
            return (
              <span key={subscale.id} className="flex gap-1">
                <span className="text-zd-text-ghost">{subscale.short}</span>
                <span
                  className={
                    score.severity === null ? 'text-zd-text-2' : bandTextClass[score.severity]
                  }
                >
                  {score.score}
                </span>
              </span>
            );
          })}
        </span>
      </a>
    ))}
  </nav>
);
