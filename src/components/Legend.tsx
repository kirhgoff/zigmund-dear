import { bandBgClass } from './ScoreMeter';

type Props = { bands: Array<{ band: string; severity: number }> };

export const Legend = ({ bands }: Props) => (
  <div className="flex flex-wrap gap-x-4.5 gap-y-2 text-zd-mono text-zd-text-lede">
    {bands.map((band) => (
      <span key={band.band} className="flex items-center gap-1.75">
        <span className={`size-2 rounded-zd-xs ${bandBgClass[band.severity]}`} />
        {band.band.replaceAll('-', ' ')}
      </span>
    ))}
  </div>
);
