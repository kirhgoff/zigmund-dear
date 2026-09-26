import models from '../data/models.json' with { type: 'json' };

const [testId, ...rest] = Bun.argv.slice(2);

if (!testId) {
  console.error('usage: bun run take-test <testId> [--model <openrouter-id>]');
  process.exit(1);
}

const { env } = await import('@/config/env');
const { loadTest, takeTest } = await import('@/assessments/services');

const modelFlagIndex = rest.indexOf('--model');
const requestedModelId = modelFlagIndex === -1 ? undefined : rest[modelFlagIndex + 1];

if (requestedModelId && !models.some((model) => model.id === requestedModelId)) {
  console.error(`unknown model "${requestedModelId}". known models:`);
  for (const model of models) console.error(`  ${model.id}`);
  process.exit(1);
}

const selectedModels = requestedModelId
  ? models.filter((model) => model.id === requestedModelId)
  : models;

const test = await loadTest({ id: testId });

let hadFailure = false;

for (const model of selectedModels) {
  console.log(`→ ${model.name}`);

  const result = await takeTest({
    test,
    model,
    apiKey: env.OPENROUTER_API_KEY,
    onItem: (n, score) => console.log(`  ${n}: ${score ?? '?'}`),
  });

  if (result.success) {
    await Bun.write(`data/runs/${testId}/${model.slug}.json`, JSON.stringify(result.data, null, 2));
    const summary = Object.values(test.subscales)
      .map((subscale) => {
        const score = result.data.scores[subscale.id];
        return `${subscale.short} ${score.score} ${score.band ?? ''}`;
      })
      .join(' · ');
    console.log(`  ${summary}`);
    continue;
  }

  hadFailure = true;
  switch (result.error.code) {
    case 'MODEL_UNAVAILABLE':
      console.error(`  ${model.name} unavailable: ${result.error.cause.message}`);
      break;
    default: {
      const _exhaustive: never = result.error.code;
      throw result.error.cause;
    }
  }
}

if (hadFailure) process.exit(1);
