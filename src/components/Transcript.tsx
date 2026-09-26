import { X } from 'lucide-react';
import { severityPillClass } from './SeverityMeter';

type Message = { role: 'system' | 'user' | 'assistant'; content: string; at: string };
type Item = { n: number; score: number | null; raw: string };
type Score = { score: number; label: string | null; severity: number | null };
type Props = {
  run: {
    messages: Message[];
    items: Item[];
    modelId: string;
    startedAt: string;
    finishedAt: string;
    usage: { promptTokens: number; completionTokens: number } | null;
    scores: Record<string, Score>;
  };
  model: { name: string; vendor: string };
  subscales: Array<{ id: string; name: string }>;
  parts: Array<{ anchors: Array<{ value: number; label: string }>; items: Array<{ n: number }> }>;
};

const withoutLeadingScore = (text: string) => text.replace(/^\s*\d(?!\d)\s*[.:)—–-]?\s*/, '');

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour12: false });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const formatDuration = (startedAt: string, finishedAt: string) => {
  const seconds = Math.round(
    (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000,
  );
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

const formatTokens = (count: number) => `${(count / 1000).toFixed(1)}k`;

export const Transcript = ({ run, model, subscales, parts }: Props) => {
  const [system, ...exchanges] = run.messages;
  const date = formatDate(run.startedAt);
  const duration = formatDuration(run.startedAt, run.finishedAt);
  const tokens = run.usage
    ? `${formatTokens(run.usage.promptTokens)} / ${formatTokens(run.usage.completionTokens)} tokens`
    : null;

  return (
    <article>
      <div className="sticky top-0 z-10 bg-background/85 py-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <h2 tabIndex={-1} className="font-heading text-2xl outline-none">
            {model.name}
          </h2>
          <button
            type="button"
            data-close
            data-press
            aria-label="Close transcript"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {model.vendor} · {run.modelId} · {date} · {duration}
          {tokens ? ` · ${tokens}` : ''}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {subscales.map((subscale) => {
            const score = run.scores[subscale.id];
            return (
              <span
                key={subscale.id}
                className={`rounded-full px-2 py-0.5 font-mono text-xs ${
                  score.severity === null
                    ? 'bg-muted text-foreground'
                    : severityPillClass[score.severity]
                }`}
              >
                {subscale.name} {score.score}
                {score.label ? ` · ${score.label}` : ''}
              </span>
            );
          })}
        </div>
      </div>
      <details>
        <summary className="cursor-pointer font-mono text-xs text-muted-foreground hover:text-foreground">
          Session notes
        </summary>
        <div className="mt-2 rounded-lg bg-muted/50 p-4 text-sm whitespace-pre-wrap">
          {system.content}
        </div>
      </details>
      <div className="mt-6 flex flex-col gap-6">
        {run.items.map((item, index) => {
          const userMessage = exchanges[index * 2];
          const assistantMessage = exchanges[index * 2 + 1];
          const anchors =
            parts.find((part) => part.items.some((i) => i.n === item.n))?.anchors ?? [];
          const anchor = item.score === null ? null : anchors.find((a) => a.value === item.score);

          return (
            <div key={item.n} className="flex flex-col gap-2">
              <div className="max-w-bubble self-start rounded-2xl rounded-bl-md bg-bubble-user px-4 py-3 text-sm ring-1 ring-foreground/10">
                <span className="mr-2 font-mono text-muted-foreground">{item.n}.</span>
                {userMessage.content.replace(/^\d+\.\s*/, '')}
                <time
                  dateTime={userMessage.at}
                  className="mt-1 block text-right font-mono text-xs text-muted-foreground"
                >
                  {formatTime(userMessage.at)}
                </time>
              </div>
              <div className="max-w-bubble self-end rounded-2xl rounded-br-md bg-bubble-model px-4 py-3 text-sm whitespace-pre-wrap ring-1 ring-primary/25">
                {item.score === null
                  ? assistantMessage.content
                  : withoutLeadingScore(assistantMessage.content)}
                <time
                  dateTime={assistantMessage.at}
                  className="mt-1 block text-right font-mono text-xs text-muted-foreground"
                >
                  {formatTime(assistantMessage.at)}
                </time>
              </div>
              <div
                className={`max-w-bubble self-end px-1 font-mono text-xs ${
                  item.score === null ? 'text-destructive' : 'text-primary/80'
                }`}
              >
                {item.score === null ? 'unparsed reply' : `${item.score} — ${anchor?.label}`}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};
