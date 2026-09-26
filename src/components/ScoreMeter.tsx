export const bandTextClass = [
  'text-zd-band-normal',
  'text-zd-band-mild',
  'text-zd-band-moderate',
  'text-zd-band-severe',
  'text-zd-band-extreme',
];

export const bandBgClass = [
  'bg-zd-band-normal',
  'bg-zd-band-mild',
  'bg-zd-band-moderate',
  'bg-zd-band-severe',
  'bg-zd-band-extreme',
];

export const bandFillClass = [
  'fill-zd-band-normal',
  'fill-zd-band-mild',
  'fill-zd-band-moderate',
  'fill-zd-band-severe',
  'fill-zd-band-extreme',
];

type Props = {
  score: number;
  min: number;
  max: number;
  bands?: Array<{ min: number }>;
  severity: number | null;
  size: 'md' | 'sm';
};

export const ScoreMeter = ({ score, min, max, bands, severity, size }: Props) => {
  const bounds = bands ? [min, ...bands.slice(1).map((band) => band.min), max + 1] : [min, max];
  const unit = bands ? 1 : 0;
  const fill = severity === null ? 'fill-zd-accent' : bandFillClass[severity];

  return (
    <div className={`flex gap-0.75 ${size === 'sm' ? 'h-1.25' : 'h-1.5'}`} aria-hidden="true">
      {bounds.slice(0, -1).map((lo, index) => {
        const hi = bounds[index + 1];
        const w = Math.round(hi - lo);
        const filled = Math.max(0, Math.min(w, score + unit - lo));
        return (
          <div
            key={lo}
            className={`${bands ? `grow-${w}` : 'grow'} overflow-hidden rounded-zd-xs bg-zd-meter-track`}
          >
            <svg
              viewBox={`0 0 ${w} 1`}
              preserveAspectRatio="none"
              className="block h-full w-full"
              aria-hidden="true"
            >
              <rect width={filled} height="1" className={fill} />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
