type Props = {
  tests: Array<{ id: string; name: string }>;
  active: string;
};

export const TestSwitcher = ({ tests, active }: Props) => (
  <nav aria-label="Test" className="inline-flex gap-1 rounded-full bg-muted p-1">
    {tests.map((test) => (
      <a
        key={test.id}
        href="/"
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
  </nav>
);
