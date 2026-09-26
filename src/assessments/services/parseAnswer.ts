const firstDigit = /^(\d)(?!\d)/;
const labelledDigit = /^(?:answer|score)?\s*[:=-]?\s*(\d)(?!\d)/i;

export const parseAnswer = ({
  text,
  values,
}: {
  text: string;
  values: number[];
}): number | null => {
  const line =
    text
      .split('\n')
      .find((candidate) => candidate.trim().length > 0)
      ?.trim() ?? '';
  const stripped = line.replace(/^[\s*_#`]+/, '');

  const match = firstDigit.exec(stripped) ?? labelledDigit.exec(stripped);
  if (!match) return null;

  const value = Number(match[1]);
  return values.includes(value) ? value : null;
};
