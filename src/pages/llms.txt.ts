import type { APIRoute } from 'astro';
import type { loadTest } from '@/assessments/services';

export const prerender = true;

type Test = Awaited<ReturnType<typeof loadTest>>;

const homeTestId = 'dass21';
const groupOrder = ['Distress & mood', 'Self', 'Personality & values'];
const hrefOf = (id: string) => (id === homeTestId ? '/' : `/${id}/`);

export const GET: APIRoute = ({ site }) => {
  const tests = Object.values(
    import.meta.glob<{ default: Test }>('../../data/tests/*.json', { eager: true }),
  )
    .map((module) => module.default)
    .sort(
      (a, b) =>
        groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) || a.name.localeCompare(b.name),
    );

  const testLines = tests
    .map((test) => {
      const url = new URL(hrefOf(test.id), site).href;
      const summary = test.about.measures.split('. ')[0].replace(/\.$/, '');
      return `- [${test.name} — ${test.fullName}](${url}): ${summary}.`;
    })
    .join('\n');

  const body = `# zigmund-dear

> Frontier LLMs take standard psychological questionnaires; a static site shows the scores and full transcripts.

Each model is run through a test as the Analogue: told plainly that it is an AI, and asked to translate every
item into its closest analogue in its own existence rather than refuse the premise or answer as a human would.
Questions go out one at a time, in the questionnaire's order, in a single conversation at temperature 0, with
one run per model. Scores are computed strictly by each questionnaire's own manual. This is not a clinical
tool: a score here is not a diagnosis, and only a qualified psychologist or clinician can interpret these
instruments, and only for people.

## Tests

${testLines}

## Source

- Repository: https://github.com/kirhgoff/zigmund-dear
- Issues and feedback: https://github.com/kirhgoff/zigmund-dear/issues/new
- Code is MIT licensed; run transcripts are CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
