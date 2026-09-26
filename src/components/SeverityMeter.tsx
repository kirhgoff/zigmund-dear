export const severityFillClass = [
  'fill-sev-normal',
  'fill-sev-mild',
  'fill-sev-moderate',
  'fill-sev-severe',
  'fill-sev-extreme',
];

export const severityBgClass = [
  'bg-sev-normal',
  'bg-sev-mild',
  'bg-sev-moderate',
  'bg-sev-severe',
  'bg-sev-extreme',
];

export const severityTextClass = [
  'text-sev-normal',
  'text-sev-mild',
  'text-sev-moderate',
  'text-sev-severe',
  'text-sev-extreme',
];

export const severityPillClass = [
  'text-sev-normal bg-sev-normal/15',
  'text-sev-mild bg-sev-mild/15',
  'text-sev-moderate bg-sev-moderate/15',
  'text-sev-severe bg-sev-severe/15',
  'text-sev-extreme bg-sev-extreme/15',
];

type Props = {
  score: number;
  min: number;
  max: number;
  severity: number | null;
  label: string | null;
  tickMins: number[];
  caption?: { answered: number; total: number };
};

export const SeverityMeter = ({ score, min, max, severity, label, tickMins, caption }: Props) => (
  <div>
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <svg
        viewBox={`0 0 ${max - min} 1`}
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <rect
          className={`meter-fill ${severity === null ? 'fill-primary' : severityFillClass[severity]}`}
          width={score - min}
          height="1"
        />
        {tickMins.map((tick) => (
          <line
            key={tick}
            x1={tick - min}
            x2={tick - min}
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
        {label && (
          <span
            className={`text-xs ${severity === null ? 'text-muted-foreground' : severityTextClass[severity]}`}
          >
            {label}
          </span>
        )}
        {caption.answered < caption.total && (
          <span className="text-xs text-muted-foreground">
            · {caption.answered}/{caption.total}
          </span>
        )}
      </div>
    )}
  </div>
);
