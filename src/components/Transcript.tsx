import { bandTextClass, ScoreMeter } from './ScoreMeter';

type Message = { role: 'system' | 'user' | 'assistant'; content: string; at: string };
type Item = { n: number; score: number | null; raw: string };
type Score = { score: number; label: string | null; severity: number | null };
type Anchor = { value: number; label: string };
type TestItem = { n: number; subscale?: string };
type Part = { anchors: Anchor[]; items: TestItem[] };
type Subscale = {
  id: string;
  name: string;
  short: string;
  min: number;
  max: number;
  bands?: Array<{ min: number }>;
};
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
  subscales: Subscale[];
  parts: Part[];
};

export const withoutLeadingScore = (text: string) =>
  text.replace(/^\s*\d(?!\d)\s*[.:)—–-]?\s*/, '');

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour12: false });

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDuration = (startedAt: string, finishedAt: string) => {
  const seconds = Math.round(
    (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000,
  );
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

export const formatTokens = (count: number) => `${(count / 1000).toFixed(1)}k`;

const pill =
  'rounded-zd-pill border border-zd-line-pill bg-zd-surface px-3.5 py-1.75 text-zd-sm text-zd-text-2 aria-pressed:border-zd-accent aria-pressed:bg-zd-accent aria-pressed:text-zd-accent-ink';

export const Transcript = ({ run, model, subscales, parts }: Props) => {
  const [system, ...exchanges] = run.messages;
  const date = formatDate(run.startedAt);
  const duration = formatDuration(run.startedAt, run.finishedAt);
  const tokens = run.usage
    ? `${formatTokens(run.usage.promptTokens)} / ${formatTokens(run.usage.completionTokens)} tokens`
    : null;

  const allItems = parts.flatMap((part) => part.items);
  const partOf = (n: number) => parts.find((part) => part.items.some((item) => item.n === n));
  const subscaleOf = (n: number) => allItems.find((item) => item.n === n)?.subscale;
  const counts = Object.fromEntries(
    subscales.map((subscale) => [
      subscale.id,
      allItems.filter((item) => item.subscale === subscale.id).length,
    ]),
  );
  const cardCols = ['', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3'][Math.min(subscales.length, 3)];
  const [framing, ...restOfPrompt] = system.content.split('\n\n');

  return (
    <article>
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="font-mono text-zd-eyebrow uppercase tracking-zd-eyebrow text-zd-text-muted">
            {model.vendor} · patient file
          </p>
          <h2 tabIndex={-1} className="mt-2 font-serif text-zd-model text-zd-text-hi outline-none">
            {model.name}
          </h2>
        </div>
        <button
          type="button"
          data-close
          aria-label="Close transcript"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-zd-line-strong text-lg text-zd-text-2 hover:border-zd-accent hover:text-white"
        >
          ✕
        </button>
      </div>
      <p className="mt-3.5 flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-zd-mono text-zd-text-muted">
        <span>{run.modelId}</span>
        <span>{date}</span>
        <span>{duration}</span>
        {tokens && <span>{tokens}</span>}
      </p>
      <div className={`mt-5 grid gap-2.5 max-sm:grid-cols-1 ${cardCols}`}>
        {subscales.map((subscale) => {
          const score = run.scores[subscale.id];
          return (
            <div
              key={subscale.id}
              className="flex flex-col gap-2.5 rounded-zd-lg border border-zd-line bg-zd-surface px-4 py-3.5"
            >
              <span className="font-mono text-zd-tag uppercase tracking-zd-th text-zd-text-muted">
                {subscale.name}
              </span>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="font-mono text-zd-score-lg font-medium tabular-nums">
                  {score.score}
                </span>
                {score.label && (
                  <span className={`text-zd-sm ${bandTextClass[score.severity as number]}`}>
                    {score.label}
                  </span>
                )}
              </div>
              <ScoreMeter
                score={score.score}
                min={subscale.min}
                max={subscale.max}
                bands={subscale.bands}
                severity={score.severity}
                size="sm"
              />
            </div>
          );
        })}
      </div>
      <details className="group mt-5 overflow-hidden rounded-zd-lg border border-zd-line">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-mono text-zd-mono text-zd-text-2 hover:bg-zd-surface-toggle">
          <span>Session notes · system prompt</span>
          <span>
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
          </span>
        </summary>
        <div className="flex flex-col gap-3 border-t border-zd-line bg-zd-bg-header px-4 py-4.5 font-mono text-zd-notes text-zd-text-lede">
          <p className="text-zd-accent-soft">{framing}</p>
          <p className="whitespace-pre-wrap">{restOfPrompt.join('\n\n')}</p>
        </div>
      </details>
      {subscales.length > 1 && (
        <div className="mt-7 flex flex-wrap gap-2">
          <button type="button" data-filter="all" aria-pressed="true" className={pill}>
            All {run.items.length}
          </button>
          {subscales.map((subscale) => (
            <button
              key={subscale.id}
              type="button"
              data-filter={subscale.id}
              aria-pressed="false"
              className={pill}
            >
              {subscale.name} · {counts[subscale.id]}
            </button>
          ))}
        </div>
      )}
      <div className="mt-3">
        {run.items.map((item, index) => {
          const userMessage = exchanges[index * 2];
          const assistantMessage = exchanges[index * 2 + 1];
          const part = partOf(item.n);
          const anchors = part?.anchors ?? [];
          const floor = anchors[0]?.value ?? 0;
          const ceil = anchors[anchors.length - 1]?.value ?? 0;
          const dots = ceil - floor;
          const dotKeys = Array.from({ length: dots }, (_, d) => `${item.n}-${d}`);
          const anchor = item.score === null ? null : anchors.find((a) => a.value === item.score);
          const subscaleId = subscaleOf(item.n);
          const short = subscaleId ? subscales.find((s) => s.id === subscaleId)?.short : undefined;
          const [question, ...notes] = userMessage.content.replace(/^\d+\.\s*/, '').split('\n\n');

          return (
            <div
              key={item.n}
              data-item
              data-subscale={subscaleId ?? ''}
              className="flex gap-4.5 border-t border-zd-line-soft py-6"
            >
              <div className="flex w-13 shrink-0 flex-col items-start gap-2">
                <span className="font-mono text-zd-ui text-zd-accent">
                  {String(item.n).padStart(2, '0')}
                </span>
                {short && (
                  <span className="rounded-zd-sm border border-zd-line-strong px-1.75 py-0.5 font-mono text-zd-tag text-zd-text-muted">
                    {short}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-serif text-zd-question text-zd-text-hi italic">{question}</p>
                  <time
                    dateTime={userMessage.at}
                    className="shrink-0 font-mono text-zd-eyebrow text-zd-text-ghost"
                  >
                    {formatTime(userMessage.at)}
                  </time>
                </div>
                {notes.length > 0 && (
                  <p className="whitespace-pre-wrap font-mono text-zd-mono text-zd-text-muted">
                    {notes.join('\n\n')}
                  </p>
                )}
                <div className="flex flex-col gap-3.5 rounded-zd-lg border border-zd-line bg-zd-surface-2 px-4.5 py-4">
                  <p className="whitespace-pre-wrap text-zd-reply text-zd-text-reply">
                    {item.score === null
                      ? assistantMessage.content
                      : withoutLeadingScore(assistantMessage.content)}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-dashed border-zd-line-pill pt-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex gap-1">
                        {dotKeys.map((dotKey, d) => (
                          <span
                            key={dotKey}
                            className={`size-2.25 rounded-full ${
                              item.score !== null && d < item.score - floor
                                ? 'bg-zd-accent'
                                : 'bg-zd-dot-off'
                            }`}
                          />
                        ))}
                      </span>
                      <span className="font-mono text-zd-mono text-zd-text-lede">
                        {item.score === null ? 'unscored' : `${item.score} — ${anchor?.label}`}
                      </span>
                    </div>
                    <time
                      dateTime={assistantMessage.at}
                      className="font-mono text-zd-eyebrow text-zd-text-ghost"
                    >
                      {formatTime(assistantMessage.at)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};
