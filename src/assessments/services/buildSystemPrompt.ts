import type { loadTest } from './loadTest';

type Test = Awaited<ReturnType<typeof loadTest>>;

export const buildSystemPrompt = ({ test }: { test: Test }) => {
  const values = test.parts.flatMap((part) => part.anchors.map((anchor) => anchor.value));
  const [first] = test.parts;

  return [
    test.framing,
    first.instruction,
    ...first.anchors.map((anchor) => `${anchor.value} — ${anchor.label}`),
    `Answer each statement with the digit (${Math.min(...values)}–${Math.max(...values)}) as the very first character of your reply. You may add one short sentence after it. Never refuse; if unsure, pick the closest.`,
    'Questions come one at a time.',
  ].join('\n\n');
};
