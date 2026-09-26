import { z } from 'zod';

const bandSchema = z.enum(['normal', 'mild', 'moderate', 'severe', 'extremely-severe']);

const testSchema = z.object({
  id: z.string(),
  name: z.string(),
  fullName: z.string(),
  instruction: z.string(),
  anchors: z.array(z.object({ value: z.number(), label: z.string() })),
  items: z.array(z.object({ n: z.number(), text: z.string(), subscale: z.string() })),
  subscales: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      short: z.string(),
      multiplier: z.number(),
      bands: z.array(z.object({ band: bandSchema, min: z.number() })),
    }),
  ),
});

const parseTest = (input: unknown) => testSchema.parse(input);

export const loadTest = async ({ id }: { id: string }) =>
  parseTest(await Bun.file(`data/tests/${id}.json`).json());
