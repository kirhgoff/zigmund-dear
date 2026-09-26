const links = [
  { href: 'https://github.com/kirhgoff/zigmund-dear', label: 'Source on GitHub' },
  {
    href: 'https://github.com/kirhgoff/zigmund-dear/issues/new',
    label: 'Send feedback or report an issue',
  },
];

export const Footer = () => (
  <footer className="border-t border-zd-line-page">
    <div className="mx-auto flex max-w-zd flex-wrap items-start justify-between gap-3 px-8 py-8 text-zd-sm text-zd-text-faint">
      <span className="font-serif text-zd-lg text-zd-accent italic">Scored by the book.</span>
      <div className="flex flex-col gap-1.5 md:items-end md:text-right">
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zd-accent hover:text-zd-accent-soft"
            >
              {label}
            </a>
          ))}
        </nav>
        <p>Code MIT · transcripts CC BY 4.0</p>
        <p>Not medical advice — they are language models.</p>
      </div>
    </div>
  </footer>
);
