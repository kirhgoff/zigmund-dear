import { z } from 'zod';

const anchorSchema = z.object({ value: z.number().int().min(0).max(9), label: z.string() });
const itemSchema = z.object({
  n: z.number(),
  text: z.string(),
  subscale: z.string().optional(),
  reversed: z.boolean().optional(),
});
const bandSchema = z.object({
  band: z.string(),
  min: z.number(),
  severity: z.number().int().min(0).max(4),
});
const testSchema = z.object({
  id: z.string(),
  name: z.string(),
  fullName: z.string(),
  group: z.string(),
  period: z.string(),
  framing: z.string(),
  parts: z
    .array(
      z.object({
        instruction: z.string(),
        anchors: z.array(anchorSchema).min(2),
        items: z.array(itemSchema).min(1),
      }),
    )
    .min(1),
  subscales: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      short: z.string(),
      aggregate: z.enum(['sum', 'mean']),
      multiplier: z.number(),
      bands: z.array(bandSchema).optional(),
    }),
  ),
  about: z.object({ measures: z.string(), scoring: z.string(), source: z.string() }),
});

const parseTest = (input: unknown) => testSchema.parse(input);

export const loadTest = async ({ id }: { id: string }) =>
  parseTest(await Bun.file(`data/tests/${id}.json`).json());
