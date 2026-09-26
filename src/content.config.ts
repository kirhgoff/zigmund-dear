import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { runSchema } from '@/assessments/services';

const runs = defineCollection({
  loader: glob({
    pattern: '*/*.json',
    base: './data/runs',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: runSchema,
});

export const collections = { runs };
