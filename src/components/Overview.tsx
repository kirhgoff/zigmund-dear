import { bandTextClass, ScoreMeter } from './ScoreMeter';

type Subscale = {
  id: string;
  name: string;
  min: number;
  max: number;
  bands?: Array<{ min: number }>;
};
type Score = {
  score: number;
  answered: number;
  total: number;
  label: string | null;
  severity: number | null;
};
type Row = {
  modelSlug: string;
  modelName: string;
  vendor: string;
  modelId: string;
  scores: Record<string, Score>;
};
type Props = { subscales: Subscale[]; rows: Row[] };

const resultsGridClass = [
  '',
  'md:results-grid-1',
  'md:results-grid-2',
  'md:results-grid-3',
  'md:results-grid-4',
  'md:results-grid-5',
  'md:results-grid-6',
];
const stackClass = ['', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3'];

export const Overview = ({ subscales, rows }: Props) => {
  const n = subscales.length;

  return (
    <>
      <div
        data-table
        className="overflow-hidden rounded-zd-2xl border border-zd-line bg-zd-surface"
      >
        <div
          className={`hidden gap-7 bg-zd-bg-sunken px-7 py-4 font-mono text-zd-eyebrow uppercase tracking-zd-th text-zd-text-muted md:grid ${resultsGridClass[n]}`}
        >
          <button
            type="button"
            data-sort=""
            aria-pressed="true"
            className="text-left uppercase aria-pressed:text-zd-text hover:text-zd-text"
          >
            Model
          </button>
          {subscales.map((subscale) => (
            <button
              key={subscale.id}
              type="button"
              data-sort={subscale.id}
              aria-pressed="false"
              className="group flex gap-1.5 text-left uppercase aria-pressed:text-zd-text hover:text-zd-text"
            >
              <span>{subscale.name}</span>
              <span className="hidden group-aria-pressed:inline">↓</span>
            </button>
          ))}
          <span />
        </div>
        {rows.map((row, index) => (
          <a
            key={row.modelSlug}
            href={`#${row.modelSlug}`}
            data-row
            data-index={index}
            {...Object.fromEntries(
              subscales.map((subscale) => [
                `data-score-${subscale.id}`,
                row.scores[subscale.id].score,
              ]),
            )}
            className={`grid gap-4 border-t border-zd-line-soft px-7 py-5 text-zd-text hover:bg-zd-surface-hover md:items-center md:gap-7 ${resultsGridClass[n]}`}
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-zd-body font-medium">{row.modelName}</span>
              <span className="truncate font-mono text-zd-eyebrow text-zd-text-faint">
                {row.vendor} · {row.modelId}
              </span>
            </div>
            <div className={`grid gap-4 md:contents ${stackClass[Math.min(n, 3)]}`}>
              {subscales.map((subscale) => {
                const score = row.scores[subscale.id];
                return (
                  <div key={subscale.id} className="flex min-w-0 flex-col gap-2.5">
                    <div className="flex items-baseline gap-2.5">
                      <span className="min-w-7 font-mono text-zd-score font-medium text-zd-text-hi tabular-nums">
                        {score.score}
                      </span>
                      {score.label && (
                        <span className={`text-zd-sm ${bandTextClass[score.severity as number]}`}>
                          {score.label}
                        </span>
                      )}
                      {score.answered < score.total && (
                        <span className="font-mono text-zd-eyebrow text-zd-text-ghost">
                          {score.answered}/{score.total}
                        </span>
                      )}
                    </div>
                    <ScoreMeter
                      score={score.score}
                      min={subscale.min}
                      max={subscale.max}
                      bands={subscale.bands}
                      severity={score.severity}
                      size="md"
                    />
                  </div>
                );
              })}
            </div>
            <span className="hidden text-right text-lg text-zd-text-ghost md:block">→</span>
          </a>
        ))}
      </div>
      <p className="mt-3.5 text-zd-sm text-zd-text-faint">
        Select a model to read its full session.
      </p>
    </>
  );
};
