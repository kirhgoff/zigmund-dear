import { R } from 'xlib/result';
import { z } from 'zod';

type Message = { role: 'system' | 'user' | 'assistant'; content: string };
type Params = { apiKey: string; model: string; messages: Message[] };

const responseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z
            .string()
            .nullable()
            .transform((content) => content ?? ''),
        }),
      }),
    )
    .min(1),
  usage: z.object({ prompt_tokens: z.number(), completion_tokens: z.number() }).optional(),
});

const modelUnavailableError = (status: number, body: string) =>
  R.error({
    code: 'MODEL_UNAVAILABLE' as const,
    cause: new Error(`OpenRouter request failed (${status}): ${body}`),
  });

export const completeChat = async ({ apiKey, model, messages }: Params) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/kirhgoff/zigmund-dear',
      'X-Title': 'zigmund-dear',
    },
    body: JSON.stringify({ model, messages, temperature: 0 }),
    signal: AbortSignal.timeout(180_000),
  });

  if (!response.ok) return modelUnavailableError(response.status, await response.text());

  const parsed = responseSchema.parse(await response.json());

  return R.success({
    content: parsed.choices[0].message.content,
    usage: parsed.usage
      ? {
          promptTokens: parsed.usage.prompt_tokens,
          completionTokens: parsed.usage.completion_tokens,
        }
      : null,
  });
};
