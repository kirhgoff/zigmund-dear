import { bandBgClass } from './ScoreMeter';

type Band = { band: string; min: number; severity: number };
type Subscale = { id: string; name: string; max: number; bands?: Band[] };
type Props = {
  test: {
    framing: string;
    about: { measures: string; scoring: string; source: string };
  };
  subscales: Subscale[];
  open: boolean;
};

const readThisFirst =
  'A questionnaire is not a diagnosis, and a number on this page is not one either. Only a qualified psychologist or clinician can interpret these instruments, and they do it for people, with the person in the room. The subjects here are language models. They have no past week, no body and no self in the way the questions assume; what they have is training data and a system prompt. Treat the scores as a curiosity, not as a clinical measure of anything. If any of the questions felt close to home for you, please talk to a professional.';

const howWePutAModelOnTheCouchIntro =
  'With a plain "answer as yourself" prompt, most models refuse the premise and answer "does not apply" to everything. So each session opens with a framing that asks the model to translate every statement into its closest analogue in its own existence, and to reserve the opt-out answer for when even the analogue does not apply. The framing says how to translate, not what the model\'s life is like. Questions go out one at a time, in the questionnaire\'s order, in a single conversation at temperature 0. Every model gets one run. Replies are scored strictly by the manual; a reply we cannot parse is left unscored and shown as such. The framing, verbatim from the run:';

const howWePutAModelOnTheCouchOutro =
  'The full system prompt, including the questionnaire\'s own instruction and answer scale, is under "Session notes" in every transcript.';

const splitScoring = (scoring: string, first?: { band: string; min: number }) => {
  const key = first ? `${first.band.replaceAll('-', ' ')} ${first.min}` : '';
  const start = key ? scoring.indexOf(key) : -1;
  if (start < 0) return { before: scoring, leadIn: '', after: '' };
  const dot = scoring.lastIndexOf('. ', start);
  const sentenceStart = dot < 0 ? 0 : dot + 2;
  const end = scoring.indexOf('. ', start);
  const leadIn = scoring.slice(sentenceStart, start).trim();
  return {
    before: scoring.slice(0, sentenceStart).trim(),
    leadIn: /^Bands( \([^)]*\))?:$/.test(leadIn) ? '' : leadIn,
    after: end < 0 ? '' : scoring.slice(end + 2).trim(),
  };
};

const bandRange = (band: Band, next: Band | undefined, max: number) => {
  if (!next) return `${band.min}–${max}`;
  return band.min === next.min - 1 ? `${band.min}` : `${band.min}–${next.min - 1}`;
};

export const AboutTest = ({ test, subscales, open }: Props) => {
  const bandedSubscales = subscales.filter((subscale) => subscale.bands);
  const columns = bandedSubscales[0]?.bands;
  const { before, leadIn, after } = splitScoring(test.about.scoring, columns?.[0]);

  return (
    <details
      open={open}
      className="group overflow-hidden rounded-zd-2xl border border-zd-line bg-zd-surface"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-7 py-5.5 hover:bg-zd-surface-toggle">
        <span className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
          <span className="text-zd-lg font-medium">About this test</span>
          <span className="text-zd-ui text-zd-text-muted">
            What it measures, how it is scored, how we ran it
          </span>
        </span>
        <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full border border-zd-line-strong text-zd-reply text-zd-text-2">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="flex flex-col gap-10 border-t border-zd-line px-7 py-9">
        <div className="flex flex-wrap gap-10">
          <div className="flex min-w-0 flex-1 basis-120 flex-col gap-9">
            <section className="flex flex-col gap-3">
              <h3 className="font-mono text-zd-eyebrow font-medium uppercase tracking-zd-eyebrow text-zd-accent">
                What it measures
              </h3>
              <p className="text-zd-body text-zd-text-body">{test.about.measures}</p>
              <p className="text-zd-sm text-zd-text-faint">{test.about.source}</p>
            </section>
            <section className="flex flex-col gap-4">
              <h3 className="font-mono text-zd-eyebrow font-medium uppercase tracking-zd-eyebrow text-zd-accent">
                How it is scored
              </h3>
              <p className="text-zd-body text-zd-text-body">{before}</p>
              {leadIn && <p className="text-zd-sm text-zd-text-muted">{leadIn}</p>}
              {columns && (
                <div className="overflow-x-auto rounded-zd-lg border border-zd-line">
                  <table className="w-full border-collapse text-zd-sm">
                    <thead className="bg-zd-bg-sunken font-mono text-zd-tag uppercase tracking-zd-cell text-zd-text-muted">
                      <tr>
                        <th className="px-3.5 py-3 text-left font-normal">Band</th>
                        {columns.map((band) => (
                          <th key={band.band} className="px-2.5 py-3 text-left font-normal">
                            <span
                              className={`mr-1.5 inline-block size-1.75 rounded-full align-middle ${bandBgClass[band.severity]}`}
                            />
                            {band.band.replaceAll('-', ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bandedSubscales.map((subscale) => (
                        <tr key={subscale.id} className="border-t border-zd-line">
                          <td className="px-3.5 py-3 text-zd-text">{subscale.name}</td>
                          {(subscale.bands as Band[]).map((band, index, all) => (
                            <td key={band.band} className="px-2.5 py-3 font-mono text-zd-text-2">
                              {bandRange(band, all[index + 1], subscale.max)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {after && <p className="text-zd-body text-zd-text-body">{after}</p>}
            </section>
          </div>
          <div className="min-w-0 flex-1 basis-80">
            <div className="flex flex-col gap-3 rounded-zd-xl border border-zd-line-callout bg-zd-surface-callout p-6">
              <h3 className="font-serif text-zd-callout text-zd-accent-soft italic">
                Read this first
              </h3>
              <p className="text-zd-reply text-zd-text-body">{readThisFirst}</p>
            </div>
          </div>
        </div>
        <section className="flex flex-col gap-4 border-t border-zd-line pt-9">
          <h3 className="font-mono text-zd-eyebrow font-medium uppercase tracking-zd-eyebrow text-zd-accent">
            How we put a model on the couch
          </h3>
          <p className="max-w-220 text-zd-body text-zd-text-body">
            {howWePutAModelOnTheCouchIntro}
          </p>
          <figure className="mt-2 overflow-hidden rounded-zd-lg border border-zd-line bg-zd-bg-header">
            <figcaption className="flex justify-between gap-3 border-b border-zd-line px-4.5 py-3 font-mono text-zd-eyebrow text-zd-text-muted">
              <span>system · framing</span>
              <span>verbatim</span>
            </figcaption>
            <pre className="px-4.5 py-5 font-mono text-zd-prompt whitespace-pre-wrap text-zd-accent-soft">
              {test.framing}
            </pre>
          </figure>
          <p className="text-zd-ui text-zd-text-muted">{howWePutAModelOnTheCouchOutro}</p>
        </section>
      </div>
    </details>
  );
};
