type Test = { id: string; name: string; href: string; group: string };
type Props = { tests: Test[]; active: string };

type Tone = {
  label: string;
  tray: string;
  active: string;
  idle: string;
  ring: string;
  edge: string;
};

export const groupTone: Record<string, Tone> = {
  'Distress & mood': {
    label: 'text-tone-mood/80',
    tray: 'bg-tone-mood/8',
    active: 'bg-tone-mood/20 text-tone-mood ring-1 ring-tone-mood/40',
    idle: 'hover:bg-tone-mood/10 hover:text-foreground',
    ring: 'ring-tone-mood/30',
    edge: 'border-tone-mood/20',
  },
  Self: {
    label: 'text-tone-self/80',
    tray: 'bg-tone-self/8',
    active: 'bg-tone-self/20 text-tone-self ring-1 ring-tone-self/40',
    idle: 'hover:bg-tone-self/10 hover:text-foreground',
    ring: 'ring-tone-self/30',
    edge: 'border-tone-self/20',
  },
  'Personality & values': {
    label: 'text-tone-values/80',
    tray: 'bg-tone-values/8',
    active: 'bg-tone-values/20 text-tone-values ring-1 ring-tone-values/40',
    idle: 'hover:bg-tone-values/10 hover:text-foreground',
    ring: 'ring-tone-values/30',
    edge: 'border-tone-values/20',
  },
};

const fallback: Tone = {
  label: 'text-muted-foreground',
  tray: 'bg-muted',
  active: 'bg-primary/20 text-primary ring-1 ring-primary/40',
  idle: 'hover:bg-accent hover:text-foreground',
  ring: 'ring-foreground/10',
  edge: 'border-border',
};

export const toneOf = (group: string) => groupTone[group] ?? fallback;

export const TestSwitcher = ({ tests, active }: Props) => {
  const groups = [...new Set(tests.map((test) => test.group))];

  return (
    <nav aria-label="Tests" className="flex flex-col gap-2">
      {groups.map((group) => {
        const tone = toneOf(group);
        return (
          <div key={group} className="flex flex-wrap items-center gap-3">
            <span
              className={`w-44 shrink-0 font-mono text-xs tracking-wide uppercase ${tone.label}`}
            >
              {group}
            </span>
            <div className={`inline-flex gap-1 rounded-full p-1 ${tone.tray}`}>
              {tests
                .filter((test) => test.group === group)
                .map((test) => (
                  <a
                    key={test.id}
                    href={test.href}
                    data-press
                    className={
                      test.id === active
                        ? `rounded-full px-4 py-1.5 text-sm font-medium ${tone.active}`
                        : `rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 ${tone.idle}`
                    }
                  >
                    {test.name}
                  </a>
                ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
};
