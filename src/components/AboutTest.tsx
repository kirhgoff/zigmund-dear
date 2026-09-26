import { ChevronDown } from 'lucide-react';

type Props = {
  test: {
    fullName: string;
    framing: string;
    about: { measures: string; scoring: string; source: string };
  };
  open: boolean;
};

const readThisFirst =
  'A questionnaire is not a diagnosis, and a number on this page is not one either. Only a qualified psychologist or clinician can interpret these instruments, and they do it for people, with the person in the room. The subjects here are language models. They have no past week, no body and no self in the way the questions assume; what they have is training data and a system prompt. Treat the scores as a curiosity, not as a clinical measure of anything. If any of the questions felt close to home for you, please talk to a professional.';

const howWePutAModelOnTheCouchIntro =
  'With a plain "answer as yourself" prompt, most models refuse the premise and answer "does not apply" to everything. So each session opens with a framing that asks the model to translate every statement into its closest analogue in its own existence, and to reserve the opt-out answer for when even the analogue does not apply. The framing says how to translate, not what the model\'s life is like. Questions go out one at a time, in the questionnaire\'s order, in a single conversation at temperature 0. Every model gets one run. Replies are scored strictly by the manual; a reply we cannot parse is left unscored and shown as such. The framing, verbatim from the run:';

const howWePutAModelOnTheCouchOutro =
  'The full system prompt, including the questionnaire\'s own instruction and answer scale, is under "Session notes" in every transcript.';

export const AboutTest = ({ test, open }: Props) => (
  <details
    open={open}
    className="group rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10"
  >
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
      <span className="min-w-0">
        <span className="font-heading text-lg">About this test</span>
        <span className="ml-2 text-sm text-muted-foreground">{test.fullName}</span>
      </span>
      <ChevronDown
        className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-180"
        strokeWidth={1.5}
      />
    </summary>
    <div className="flex flex-col gap-6 border-t border-border px-5 py-5 text-sm">
      <section>
        <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          What it measures
        </h3>
        <p className="mt-2">{test.about.measures}</p>
        <p className="mt-2 text-muted-foreground">{test.about.source}</p>
      </section>
      <section>
        <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          How it is scored
        </h3>
        <p className="mt-2">{test.about.scoring}</p>
      </section>
      <section>
        <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          Read this first
        </h3>
        <p className="mt-2">{readThisFirst}</p>
      </section>
      <section>
        <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          How we put a model on the couch
        </h3>
        <p className="mt-2">{howWePutAModelOnTheCouchIntro}</p>
        <pre className="mt-3 rounded-lg bg-muted/50 p-4 font-mono text-xs whitespace-pre-wrap">
          {test.framing}
        </pre>
        <p className="mt-3">{howWePutAModelOnTheCouchOutro}</p>
      </section>
    </div>
  </details>
);
