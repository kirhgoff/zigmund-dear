const firstDigit = /^([0-3])(?![0-9])/;
const labelledDigit = /^(?:answer|score)?\s*[:=-]?\s*([0-3])(?![0-9])/i;

export const parseAnswer = ({ text }: { text: string }): 0 | 1 | 2 | 3 | null => {
  const line =
    text
      .split('\n')
      .find((candidate) => candidate.trim().length > 0)
      ?.trim() ?? '';
  const stripped = line.replace(/^[\s*_#`]+/, '');

  const match = firstDigit.exec(stripped) ?? labelledDigit.exec(stripped);
  if (!match) return null;

  return Number(match[1]) as 0 | 1 | 2 | 3;
};
