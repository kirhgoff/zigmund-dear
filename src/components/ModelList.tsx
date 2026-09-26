import { severityTextClass } from './SeverityMeter';

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
    className="overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10"
  >
    {rows.map((row) => (
      <a
        key={row.modelSlug}
        href={`#${row.modelSlug}`}
        data-model={row.modelSlug}
        data-press
        className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 transition-colors duration-150 last:border-0 hover:bg-accent/40"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{row.modelName}</span>
          <span className="block text-xs text-muted-foreground">{row.vendor}</span>
        </span>
        <span className="tabular flex shrink-0 gap-3 font-mono text-sm">
          {subscales.map((subscale) => {
            const score = row.scores[subscale.id];
            return (
              <span
                key={subscale.id}
                className={score.severity === null ? '' : severityTextClass[score.severity]}
              >
                <span className="text-muted-foreground">{subscale.short} </span>
                {score.score}
              </span>
            );
          })}
        </span>
      </a>
    ))}
  </nav>
);
