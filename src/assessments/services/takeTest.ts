import { R } from 'xlib/result';
import { buildSystemPrompt } from './buildSystemPrompt';
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

export const takeTest = async ({ test, model, apiKey, onItem }: Params) => {
  const startedAt = new Date().toISOString();
  const messages: Message[] = [
    { role: 'system', content: buildSystemPrompt({ test }), at: startedAt },
  ];
  const items: Array<{ n: number; score: number | null; raw: string }> = [];
  let promptTokens = 0;
  let completionTokens = 0;
  let usagePresent = false;

  for (const [partIndex, part] of test.parts.entries()) {
    for (const [itemIndex, item] of part.items.entries()) {
      const reminder =
        partIndex > 0 && itemIndex === 0
          ? `\n\nFrom this question on: ${part.instruction}\n${part.anchors
              .map((anchor) => `${anchor.value} — ${anchor.label}`)
              .join('\n')}`
          : '';

      messages.push({
        role: 'user',
        content: `${item.n}. ${item.text}${reminder}`,
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

      const score = parseAnswer({
        text: result.data.content,
        values: part.anchors.map((anchor) => anchor.value),
      });
      items.push({ n: item.n, score, raw: result.data.content });
      onItem?.(item.n, score);

      if (result.data.usage) {
        usagePresent = true;
        promptTokens += result.data.usage.promptTokens;
        completionTokens += result.data.usage.completionTokens;
      }
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
