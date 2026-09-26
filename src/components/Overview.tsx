import { Badge } from '@/components/ui/badge';
import { type Band, bandBgClass, bandLabel, SeverityMeter } from './SeverityMeter';

type Subscale = {
  id: string;
  name: string;
  max: number;
  bands: Array<{ band: Band; min: number }>;
};
type Row = {
  modelSlug: string;
  modelName: string;
  vendor: string;
  scores: Record<string, { score: number; band: Band; answered: number; total: number }>;
};
type Props = {
  subscales: Subscale[];
  rows: Row[];
};

const legendBands: Band[] = ['normal', 'mild', 'moderate', 'severe', 'extremely-severe'];

export const Overview = ({ subscales, rows }: Props) => (
  <div>
    <div className="overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10">
      <div className="grid grid-cols-5 gap-6 px-4 pt-4 pb-3 font-mono text-xs tracking-wide text-muted-foreground uppercase">
        <span className="col-span-2">Model</span>
        {subscales.map((subscale) => (
          <span key={subscale.id}>{subscale.name}</span>
        ))}
      </div>
      {rows.map((row) => (
        <a
          key={row.modelSlug}
          href={`#${row.modelSlug}`}
          data-press
          className="grid grid-cols-5 items-center gap-6 border-b border-border px-4 py-4 transition-colors duration-150 last:border-0 hover:bg-accent/40"
        >
          <div className="col-span-2">
            <div className="text-sm font-medium">{row.modelName}</div>
            <Badge variant="outline" className="mt-1">
              {row.vendor}
            </Badge>
          </div>
          {subscales.map((subscale) => {
            const score = row.scores[subscale.id];
            return (
              <SeverityMeter
                key={subscale.id}
                score={score.score}
                max={subscale.max}
                band={score.band}
                tickMins={subscale.bands.slice(1).map((band) => band.min)}
                caption={{ answered: score.answered, total: score.total }}
              />
            );
          })}
        </a>
      ))}
    </div>
    <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
      {legendBands.map((band) => (
        <span key={band} className="inline-flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${bandBgClass[band]}`} />
          {bandLabel[band]}
        </span>
      ))}
    </div>
  </div>
);
