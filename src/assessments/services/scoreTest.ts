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
  const itemScores = test.parts.flatMap((part) => {
    const floor = part.anchors[0].value;
    const ceil = part.anchors[part.anchors.length - 1].value;
    return part.items
      .filter((item) => item.subscale === subscale.id)
      .map((item) => {
        const score = answers.find((answer) => answer.n === item.n)?.score ?? null;
        if (score === null) return null;
        return item.reversed ? floor + ceil - score : score;
      });
  });

  const answered = itemScores.filter((score) => score !== null).length;
  const raw = itemScores.reduce((sum: number, score) => sum + (score ?? 0), 0);
  const score =
    subscale.aggregate === 'mean'
      ? answered
        ? Math.round((raw / answered) * 100) / 100
        : 0
      : raw * subscale.multiplier;
  const band = subscale.bands
    ? ([...subscale.bands].reverse().find((candidate) => score >= candidate.min)?.band ??
      subscale.bands[0].band)
    : null;

  return { raw, score, band, answered, total: itemScores.length };
};

export const scoreTest = ({ test, answers }: { test: Test; answers: Answer[] }) =>
  Object.fromEntries(
    test.subscales.map((subscale) => [subscale.id, scoreSubscale({ test, subscale, answers })]),
  );
