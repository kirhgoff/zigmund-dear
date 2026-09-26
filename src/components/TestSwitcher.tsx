type Test = { id: string; name: string; href: string; group: string };
type Props = { tests: Test[]; active: string };

export const TestSwitcher = ({ tests, active }: Props) => {
  const groups = [...new Set(tests.map((test) => test.group))];

  return (
    <nav aria-label="Tests" className="flex flex-col gap-2">
      {groups.map((group) => (
        <div key={group} className="flex flex-wrap items-center gap-3">
          <span className="w-44 shrink-0 font-mono text-xs tracking-wide text-muted-foreground uppercase">
            {group}
          </span>
          <div className="inline-flex gap-1 rounded-full bg-muted p-1">
            {tests
              .filter((test) => test.group === group)
              .map((test) => (
                <a
                  key={test.id}
                  href={test.href}
                  data-press
                  className={
                    test.id === active
                      ? 'rounded-full bg-card px-4 py-1.5 text-sm font-medium text-foreground ring-1 ring-foreground/10'
                      : 'rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground'
                  }
                >
                  {test.name}
                </a>
              ))}
          </div>
        </div>
      ))}
    </nav>
  );
};
