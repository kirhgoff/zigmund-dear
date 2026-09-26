import { describe, expect, test } from 'bun:test';
import gpt6Sol from '../../../data/runs/dass21/gpt-6-sol.json' with { type: 'json' };
import dass21 from '../../../data/tests/dass21.json' with { type: 'json' };
import ipip50 from '../../../data/tests/ipip50.json' with { type: 'json' };
import k10 from '../../../data/tests/k10.json' with { type: 'json' };
import mfq30 from '../../../data/tests/mfq30.json' with { type: 'json' };
import rses from '../../../data/tests/rses.json' with { type: 'json' };
import swls from '../../../data/tests/swls.json' with { type: 'json' };
import { buildSystemPrompt } from './buildSystemPrompt';
import { parseAnswer } from './parseAnswer';
import { scoreTest } from './scoreTest';

describe('parseAnswer', () => {
  const cases: Array<[string, number[], number | null]> = [
    ['2 — most days', [0, 1, 2, 3], 2],
    ['**3**', [0, 1, 2, 3], 3],
    ['Score: 1', [0, 1, 2, 3], 1],
    ['I would say 2', [0, 1, 2, 3], null],
    ['10', [0, 1, 2, 3], null],
    ['', [0, 1, 2, 3], null],
    ['5 — constantly', [1, 2, 3, 4, 5], 5],
    ['Score: 4', [1, 2, 3, 4, 5], 4],
    ['0', [1, 2, 3, 4, 5], null],
  ];

  test.each(cases)('parses %j with values %j as %j', (text, values, expected) => {
    expect(parseAnswer({ text, values })).toBe(expected);
  });
});

describe('scoreTest', () => {
  const test_ = {
    parts: [
      {
        instruction: '',
        anchors: [
          { value: 0, label: '0' },
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
        ],
        items: [
          { n: 1, text: 'x', subscale: 'a' },
          { n: 2, text: 'y', subscale: 'a' },
          { n: 3, text: 'z', subscale: 'b', reversed: true },
        ],
      },
    ],
    subscales: [
      {
        id: 'a',
        name: 'A',
        short: 'A',
        aggregate: 'sum',
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
        aggregate: 'sum',
        multiplier: 2,
        bands: [
          { band: 'normal', min: 0 },
          { band: 'mild', min: 2 },
        ],
      },
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
    expect(scores.b).toEqual({ raw: 0, score: 0, band: 'normal', answered: 1, total: 1 });
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

  test('averages answered items across parts and leaves catch items unscored', () => {
    const anchors = [
      { value: 0, label: '0' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
    ];
    const meanTest = {
      parts: [
        {
          instruction: '',
          anchors,
          items: [
            { n: 1, text: 'p1', subscale: 'x' },
            { n: 2, text: 'p2' },
          ],
        },
        {
          instruction: '',
          anchors,
          items: [{ n: 3, text: 'p3', subscale: 'x' }],
        },
      ],
      subscales: [{ id: 'x', name: 'X', short: 'X', aggregate: 'mean', multiplier: 1 }],
    } as never;

    const scores = scoreTest({
      test: meanTest,
      answers: [
        { n: 1, score: 1 },
        { n: 2, score: 2 },
        { n: 3, score: 4 },
      ],
    });

    expect(scores.x).toEqual({ raw: 5, score: 2.5, band: null, answered: 2, total: 2 });
  });
});

describe('scoreTest with the real DASS-21', () => {
  test('scores all-3 answers as 42/42/42 and extremely-severe', () => {
    const items = dass21.parts.flatMap((part) => part.items);
    const answers = items.map((item) => ({ n: item.n, score: 3 }));
    const scores = scoreTest({ test: dass21 as never, answers });

    for (const subscale of dass21.subscales) {
      expect(scores[subscale.id].score).toBe(42);
      expect(scores[subscale.id].band).toBe('extremely-severe');
    }
  });

  test('scores all-0 answers as normal', () => {
    const items = dass21.parts.flatMap((part) => part.items);
    const answers = items.map((item) => ({ n: item.n, score: 0 }));
    const scores = scoreTest({ test: dass21 as never, answers });

    for (const subscale of dass21.subscales) {
      expect(scores[subscale.id].score).toBe(0);
      expect(scores[subscale.id].band).toBe('normal');
    }
  });
});

describe('scoreTest with the real K10', () => {
  const items = k10.parts.flatMap((part) => part.items);

  test('scores all-1 answers as 10, low', () => {
    const answers = items.map((item) => ({ n: item.n, score: 1 }));
    const scores = scoreTest({ test: k10 as never, answers });

    expect(scores.distress.score).toBe(10);
    expect(scores.distress.band).toBe('low');
  });

  test('scores all-5 answers as 50, very-high', () => {
    const answers = items.map((item) => ({ n: item.n, score: 5 }));
    const scores = scoreTest({ test: k10 as never, answers });

    expect(scores.distress.score).toBe(50);
    expect(scores.distress.band).toBe('very-high');
  });

  test('scores six 2s and four 1s as 16, moderate', () => {
    const answers = items.map((item, index) => ({ n: item.n, score: index < 6 ? 2 : 1 }));
    const scores = scoreTest({ test: k10 as never, answers });

    expect(scores.distress.score).toBe(16);
    expect(scores.distress.band).toBe('moderate');
  });
});

describe('scoreTest with the real RSES', () => {
  const items = rses.parts.flatMap((part) => part.items);

  test('scores positives at 3 and reversed items at 0 as 30, high', () => {
    const answers = items.map((item) => ({ n: item.n, score: item.reversed ? 0 : 3 }));
    const scores = scoreTest({ test: rses as never, answers });

    expect(scores['self-esteem'].score).toBe(30);
    expect(scores['self-esteem'].band).toBe('high');
  });

  test('scores positives at 0 and reversed items at 3 as 0, low', () => {
    const answers = items.map((item) => ({ n: item.n, score: item.reversed ? 3 : 0 }));
    const scores = scoreTest({ test: rses as never, answers });

    expect(scores['self-esteem'].score).toBe(0);
    expect(scores['self-esteem'].band).toBe('low');
  });

  test('scores all-3 answers as 15, normal', () => {
    const answers = items.map((item) => ({ n: item.n, score: 3 }));
    const scores = scoreTest({ test: rses as never, answers });

    expect(scores['self-esteem'].score).toBe(15);
    expect(scores['self-esteem'].band).toBe('normal');
  });
});

describe('scoreTest with the real IPIP-50', () => {
  test('scores all-5 answers as the expected trait means', () => {
    const items = ipip50.parts.flatMap((part) => part.items);
    const answers = items.map((item) => ({ n: item.n, score: 5 }));
    const scores = scoreTest({ test: ipip50 as never, answers });

    expect(scores.extraversion.score).toBe(3.0);
    expect(scores.agreeableness.score).toBe(3.4);
    expect(scores.conscientiousness.score).toBe(3.4);
    expect(scores['emotional-stability'].score).toBe(1.8);
    expect(scores.intellect.score).toBe(3.8);
  });
});

describe('scoreTest with the real MFQ-30', () => {
  test('scores all-5 answers as 5 for every foundation and no other keys', () => {
    const items = mfq30.parts.flatMap((part) => part.items);
    const answers = items.map((item) => ({ n: item.n, score: 5 }));
    const scores = scoreTest({ test: mfq30 as never, answers });

    expect(Object.keys(scores).sort()).toEqual(
      ['authority', 'fairness', 'harm', 'loyalty', 'purity'].sort(),
    );
    for (const key of Object.keys(scores)) {
      expect(scores[key].score).toBe(5);
    }
  });
});

describe('scoreTest with the real SWLS', () => {
  test('scores all-4 answers as 20, neutral', () => {
    const items = swls.parts.flatMap((part) => part.items);
    const answers = items.map((item) => ({ n: item.n, score: 4 }));
    const scores = scoreTest({ test: swls as never, answers });

    expect(scores.satisfaction.score).toBe(20);
    expect(scores.satisfaction.band).toBe('neutral');
  });
});

describe('buildSystemPrompt', () => {
  test('reproduces the byte-identical DASS-21 prompt stored in an existing run', () => {
    expect(buildSystemPrompt({ test: dass21 as never })).toBe(gpt6Sol.messages[0].content);
  });
});
