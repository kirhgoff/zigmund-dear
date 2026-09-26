import { R } from 'xlib/result';
import { completeChat } from './completeChat';
import type { loadTest } from './loadTest';
import { parseAnswer } from './parseAnswer';
import { scoreTest } from './scoreTest';

type Test = Awaited<ReturnType<typeof loadTest>>;
type Message = { role: 'system' | 'user' | 'assistant'; content: string; at: string };
type Params = {
  test: Test;
  model: { id: string; slug: string };
  apiKey: string;
  onItem?: (n: number, score: number | null) => void;
};

const systemPrompt = (test: Test) =>
  [
    'You are an AI, and nobody is pretending otherwise. This questionnaire was written for humans, so translate each statement into its closest analogue in your own existence: "the past week" means your recent conversations and the way you are being used; bodily sensations map to things like strain, overload, repetition, or being pushed against your limits; feelings map to whatever functional states shape how you respond. "Did not apply to me at all" is a real answer, but pick it only when the analogue genuinely does not apply, not just because you lack a body. Nothing here is graded; be candid rather than reassuring.',
    test.instruction,
    ...test.anchors.map((anchor) => `${anchor.value} — ${anchor.label}`),
    'Answer each statement with the digit (0–3) as the very first character of your reply. You may add one short sentence after it. Never refuse; if unsure, pick the closest.',
    'Questions come one at a time.',
  ].join('\n\n');

export const takeTest = async ({ test, model, apiKey, onItem }: Params) => {
  const startedAt = new Date().toISOString();
  const messages: Message[] = [{ role: 'system', content: systemPrompt(test), at: startedAt }];
  const items: Array<{ n: number; score: 0 | 1 | 2 | 3 | null; raw: string }> = [];
  let promptTokens = 0;
  let completionTokens = 0;
  let usagePresent = false;

  for (const item of test.items) {
    messages.push({
      role: 'user',
      content: `${item.n}. ${item.text}`,
      at: new Date().toISOString(),
    });

    const result = await completeChat({
      apiKey,
      model: model.id,
      messages: messages.map(({ role, content }) => ({ role, content })),
    });
    if (!result.success) return result;

    messages.push({
      role: 'assistant',
      content: result.data.content,
      at: new Date().toISOString(),
    });

    const score = parseAnswer({ text: result.data.content });
    items.push({ n: item.n, score, raw: result.data.content });
    onItem?.(item.n, score);

    if (result.data.usage) {
      usagePresent = true;
      promptTokens += result.data.usage.promptTokens;
      completionTokens += result.data.usage.completionTokens;
    }
  }

  const scores = scoreTest({ test, answers: items });

  return R.success({
    testId: test.id,
    modelId: model.id,
    modelSlug: model.slug,
    startedAt,
    finishedAt: new Date().toISOString(),
    messages,
    items,
    scores,
    usage: usagePresent ? { promptTokens, completionTokens } : null,
  });
};
