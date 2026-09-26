import { Code2, MessageSquare } from 'lucide-react';

const links = [
  { href: 'https://github.com/kirhgoff/zigmund-dear', label: 'Source on GitHub', icon: Code2 },
  {
    href: 'https://github.com/kirhgoff/zigmund-dear/issues/new',
    label: 'Send feedback or report an issue',
    icon: MessageSquare,
  },
];

export const Footer = () => (
  <footer className="border-t border-border">
    <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground">
      <nav className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Icon className="size-3.5" strokeWidth={1.5} />
            {label}
          </a>
        ))}
      </nav>
      <p>Code MIT · transcripts CC BY 4.0</p>
      <p>Not a clinical measure of anything. See &ldquo;About this test&rdquo;.</p>
    </div>
  </footer>
);
