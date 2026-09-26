import { z } from 'zod';

const messageRoleSchema = z.enum(['system', 'user', 'assistant']);

export const runSchema = z.object({
  testId: z.string(),
  modelId: z.string(),
  modelSlug: z.string(),
  startedAt: z.string(),
  finishedAt: z.string(),
  messages: z.array(z.object({ role: messageRoleSchema, content: z.string(), at: z.string() })),
  items: z.array(
    z.object({
      n: z.number(),
      score: z.number().int().nullable(),
      raw: z.string(),
    }),
  ),
  scores: z.record(
    z.string(),
    z.object({
      raw: z.number(),
      score: z.number(),
      band: z.string().nullable(),
      answered: z.number(),
      total: z.number(),
    }),
  ),
  usage: z.object({ promptTokens: z.number(), completionTokens: z.number() }).nullable(),
});

export const parseRun = (input: unknown) => runSchema.parse(input);
