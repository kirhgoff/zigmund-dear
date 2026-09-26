import { Card, CardContent } from '@/components/ui/card';
import { type Band, bandLabel, bandPillClass, bandTextClass, SeverityMeter } from './SeverityMeter';

type Props = {
  label: string;
  score: number;
  max: number;
  band: Band;
  tickMins: number[];
};

export const ScoreTile = ({ label, score, max, band, tickMins }: Props) => (
  <Card>
    <CardContent>
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <span className={`tabular font-heading text-5xl ${bandTextClass[band]}`}>{score}</span>
        <span className={`w-fit rounded-full px-2 py-0.5 text-xs ${bandPillClass[band]}`}>
          {bandLabel[band]}
        </span>
        <SeverityMeter score={score} max={max} band={band} tickMins={tickMins} />
      </div>
    </CardContent>
  </Card>
);
