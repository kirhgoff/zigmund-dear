import { Badge } from '@/components/ui/badge';
import { type Band, bandTextClass } from './SeverityMeter';

type Message = { role: 'system' | 'user' | 'assistant'; content: string; at: string };
type Item = { n: number; score: 0 | 1 | 2 | 3 | null; raw: string };
type Anchor = { value: number; label: string };
type Props = {
  run: { messages: Message[]; items: Item[]; modelSlug: string };
  anchors: Anchor[];
};

const scoreBand: Band[] = ['normal', 'mild', 'moderate', 'severe'];

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour12: false });

export const Transcript = ({ run, anchors }: Props) => {
  const [system, ...exchanges] = run.messages;
  const modelInitial = run.modelSlug.charAt(0).toUpperCase();

  return (
    <div>
      <details>
        <summary className="cursor-pointer font-mono text-sm text-muted-foreground hover:text-foreground">
          Session notes (system prompt)
        </summary>
        <div className="mt-2 rounded-lg bg-muted/50 p-4 text-sm whitespace-pre-wrap">
          {system.content}
        </div>
      </details>
      <div className="mt-8 flex max-w-2xl flex-col gap-5">
        {run.items.map((item, index) => {
          const userMessage = exchanges[index * 2];
          const assistantMessage = exchanges[index * 2 + 1];
          const anchor = item.score === null ? null : anchors.find((a) => a.value === item.score);

          return (
            <div key={item.n} className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-sm text-primary italic">
                  Z
                </div>
                <div>
                  <div className="rounded-2xl rounded-tl-sm bg-card px-4 py-3 text-sm ring-1 ring-foreground/10">
                    <span className="mr-2 font-mono text-muted-foreground">{item.n}.</span>
                    {userMessage.content.replace(/^\d+\.\s*/, '')}
                  </div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">
                    {formatTime(userMessage.at)}
                  </div>
                </div>
              </div>
              <div className="ml-auto flex max-w-prose flex-col items-end gap-1">
                <Badge
                  variant={item.score === null ? 'destructive' : 'outline'}
                  className={item.score === null ? '' : bandTextClass[scoreBand[item.score]]}
                >
                  <span className="font-mono">
                    {item.score === null ? '? unparsed' : `${item.score} · ${anchor?.label}`}
                  </span>
                </Badge>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl rounded-tr-sm bg-primary/10 px-4 py-3 ring-1 ring-primary/20 whitespace-pre-wrap">
                    {assistantMessage.content}
                  </div>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm">
                    {modelInitial}
                  </div>
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {formatTime(assistantMessage.at)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
