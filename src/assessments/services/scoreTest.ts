import type { loadTest } from './loadTest';

type Test = Awaited<ReturnType<typeof loadTest>>;
type Subscale = Test['subscales'][number];
type Answer = { n: number; score: number | null };

const scoreSubscale = ({
  test,
  subscale,
  answers,
}: {
  test: Test;
  subscale: Subscale;
  answers: Answer[];
}) => {
  const items = test.items.filter((item) => item.subscale === subscale.id);
  const itemScores = items.map(
    (item) => answers.find((answer) => answer.n === item.n)?.score ?? null,
  );
  const answered = itemScores.filter((score) => score !== null).length;
  const raw = itemScores.reduce((sum: number, score) => sum + (score ?? 0), 0);
  const score = raw * subscale.multiplier;
  const band =
    [...subscale.bands].reverse().find((candidate) => score >= candidate.min)?.band ??
    subscale.bands[0].band;

  return { raw, score, band, answered, total: items.length };
};

export const scoreTest = ({ test, answers }: { test: Test; answers: Answer[] }) =>
  Object.fromEntries(
    test.subscales.map((subscale) => [subscale.id, scoreSubscale({ test, subscale, answers })]),
  );
