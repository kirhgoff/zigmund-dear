export type Band = 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe';

export const bandLabel: Record<Band, string> = {
  normal: 'normal',
  mild: 'mild',
  moderate: 'moderate',
  severe: 'severe',
  'extremely-severe': 'extremely severe',
};

export const bandFillClass: Record<Band, string> = {
  normal: 'fill-sev-normal',
  mild: 'fill-sev-mild',
  moderate: 'fill-sev-moderate',
  severe: 'fill-sev-severe',
  'extremely-severe': 'fill-sev-extreme',
};

export const bandBgClass: Record<Band, string> = {
  normal: 'bg-sev-normal',
  mild: 'bg-sev-mild',
  moderate: 'bg-sev-moderate',
  severe: 'bg-sev-severe',
  'extremely-severe': 'bg-sev-extreme',
};

export const bandTextClass: Record<Band, string> = {
  normal: 'text-sev-normal',
  mild: 'text-sev-mild',
  moderate: 'text-sev-moderate',
  severe: 'text-sev-severe',
  'extremely-severe': 'text-sev-extreme',
};

export const bandPillClass: Record<Band, string> = {
  normal: 'text-sev-normal bg-sev-normal/15',
  mild: 'text-sev-mild bg-sev-mild/15',
  moderate: 'text-sev-moderate bg-sev-moderate/15',
  severe: 'text-sev-severe bg-sev-severe/15',
  'extremely-severe': 'text-sev-extreme bg-sev-extreme/15',
};

type Props = {
  score: number;
  max: number;
  band: Band;
  tickMins: number[];
  caption?: { answered: number; total: number };
};

export const SeverityMeter = ({ score, max, band, tickMins, caption }: Props) => (
  <div>
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <svg
        viewBox={`0 0 ${max} 1`}
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <rect className={`meter-fill ${bandFillClass[band]}`} width={score} height="1" />
        {tickMins.map((min) => (
          <line
            key={min}
            x1={min}
            x2={min}
            y1="0"
            y2="1"
            className="stroke-background"
            strokeWidth="0.35"
          />
        ))}
      </svg>
    </div>
    {caption && (
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="tabular font-mono text-sm">{score}</span>
        <span className={`text-xs ${bandTextClass[band]}`}>{bandLabel[band]}</span>
        {caption.answered < caption.total && (
          <span className="text-xs text-muted-foreground">
            · {caption.answered}/{caption.total}
          </span>
        )}
      </div>
    )}
  </div>
);
