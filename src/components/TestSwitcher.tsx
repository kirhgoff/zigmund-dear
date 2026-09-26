type Test = { id: string; name: string; href: string; group: string };
type Props = { tests: Test[]; active: string };

export const TestSwitcher = ({ tests, active }: Props) => {
  const groups = [...new Set(tests.map((test) => test.group))];

  return (
    <nav aria-label="Tests" className="flex flex-col gap-3.5 border-y border-zd-line-page py-7">
      {groups.map((group) => (
        <div key={group} className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="basis-full font-mono text-zd-eyebrow uppercase tracking-zd-eyebrow text-zd-text-muted md:shrink-0 md:basis-55">
            {group}
          </span>
          <div className="flex flex-wrap gap-2">
            {tests
              .filter((test) => test.group === group)
              .map((test) => (
                <a
                  key={test.id}
                  href={test.href}
                  aria-current={test.id === active ? 'page' : undefined}
                  className={
                    test.id === active
                      ? 'rounded-zd-pill border border-zd-accent bg-zd-accent px-4.5 py-2.25 text-zd-ui font-medium text-zd-accent-ink'
                      : 'rounded-zd-pill border border-zd-line-pill bg-zd-surface px-4.5 py-2.25 text-zd-ui text-zd-text-2 hover:border-zd-accent/55 hover:text-white'
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
