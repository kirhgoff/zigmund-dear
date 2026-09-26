import { Badge } from '@/components/ui/badge';
import { SeverityMeter, severityBgClass } from './SeverityMeter';

type Subscale = {
  id: string;
  name: string;
  min: number;
  max: number;
  bands?: Array<{ band: string; min: number; severity: number }>;
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
  scores: Record<string, Score>;
};
type Props = {
  subscales: Subscale[];
  rows: Row[];
};

export const Overview = ({ subscales, rows }: Props) => {
  const legend = [
    ...new Map(
      subscales.flatMap((subscale) => subscale.bands ?? []).map((band) => [band.band, band]),
    ).values(),
  ];

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10">
        <div className="flex gap-6 px-4 pt-4 pb-3 font-mono text-xs tracking-wide text-muted-foreground uppercase">
          <span className="w-2/5 shrink-0">Model</span>
          {subscales.map((subscale) => (
            <span key={subscale.id} className="min-w-0 flex-1">
              {subscale.name}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <a
            key={row.modelSlug}
            href={`#${row.modelSlug}`}
            data-press
            className="flex items-center gap-6 border-b border-border px-4 py-4 transition-colors duration-150 last:border-0 hover:bg-accent/40"
          >
            <div className="w-2/5 shrink-0">
              <div className="text-sm font-medium">{row.modelName}</div>
              <Badge variant="outline" className="mt-1">
                {row.vendor}
              </Badge>
            </div>
            {subscales.map((subscale) => {
              const score = row.scores[subscale.id];
              return (
                <div key={subscale.id} className="min-w-0 flex-1">
                  <SeverityMeter
                    score={score.score}
                    min={subscale.min}
                    max={subscale.max}
                    severity={score.severity}
                    label={score.label}
                    tickMins={(subscale.bands ?? []).slice(1).map((band) => band.min)}
                    caption={{ answered: score.answered, total: score.total }}
                  />
                </div>
              );
            })}
          </a>
        ))}
      </div>
      {legend.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          {legend.map((band) => (
            <span key={band.band} className="inline-flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${severityBgClass[band.severity]}`} />
              {band.band.replaceAll('-', ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
