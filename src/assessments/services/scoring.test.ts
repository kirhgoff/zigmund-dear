import { describe, expect, test } from 'bun:test';
import dass21 from '../../../data/tests/dass21.json' with { type: 'json' };
import { parseAnswer } from './parseAnswer';
import { scoreTest } from './scoreTest';

describe('parseAnswer', () => {
  const cases: Array<[string, 0 | 1 | 2 | 3 | null]> = [
    ['2 — most days', 2],
    ['**3**', 3],
    ['Score: 1', 1],
    ['I would say 2', null],
    ['10', null],
    ['', null],
  ];

  test.each(cases)('parses %j as %j', (text, expected) => {
    expect(parseAnswer({ text })).toBe(expected);
  });
});

describe('scoreTest', () => {
  const test_ = {
    subscales: [
      {
        id: 'a',
        name: 'A',
        short: 'A',
        multiplier: 2,
        bands: [
          { band: 'normal', min: 0 },
          { band: 'mild', min: 4 },
          { band: 'moderate', min: 8 },
        ],
      },
      {
        id: 'b',
        name: 'B',
        short: 'B',
        multiplier: 2,
        bands: [
          { band: 'normal', min: 0 },
          { band: 'mild', min: 2 },
        ],
      },
    ],
    items: [
      { n: 1, text: 'x', subscale: 'a' },
      { n: 2, text: 'y', subscale: 'a' },
      { n: 3, text: 'z', subscale: 'b' },
    ],
  } as never;

  test('sums non-null scores, applies the multiplier, and tracks answered count', () => {
    const scores = scoreTest({
      test: test_,
      answers: [
        { n: 1, score: 2 },
        { n: 2, score: null },
        { n: 3, score: 3 },
      ],
    });

    expect(scores.a).toEqual({ raw: 2, score: 4, band: 'mild', answered: 1, total: 2 });
    expect(scores.b).toEqual({ raw: 3, score: 6, band: 'mild', answered: 1, total: 1 });
  });

  test('picks the exact band at a boundary min', () => {
    const scores = scoreTest({
      test: test_,
      answers: [
        { n: 1, score: 2 },
        { n: 2, score: 2 },
        { n: 3, score: 0 },
      ],
    });

    expect(scores.a.score).toBe(8);
    expect(scores.a.band).toBe('moderate');
  });
});

describe('scoreTest with the real DASS-21', () => {
  test('scores all-3 answers as 42/42/42 and extremely-severe', () => {
    const answers = dass21.items.map((item) => ({ n: item.n, score: 3 as const }));
    const scores = scoreTest({ test: dass21 as never, answers });

    for (const subscale of dass21.subscales) {
      expect(scores[subscale.id].score).toBe(42);
      expect(scores[subscale.id].band).toBe('extremely-severe');
    }
  });

  test('scores all-0 answers as normal', () => {
    const answers = dass21.items.map((item) => ({ n: item.n, score: 0 as const }));
    const scores = scoreTest({ test: dass21 as never, answers });

    for (const subscale of dass21.subscales) {
      expect(scores[subscale.id].score).toBe(0);
      expect(scores[subscale.id].band).toBe('normal');
    }
  });
});
