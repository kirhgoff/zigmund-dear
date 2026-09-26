export default {
  forbidden: [
    {
      name: 'xlib-only-imports-xlib',
      severity: 'error',
      comment: 'xlib is the foundation layer and must not depend on anything outside itself',
      from: { path: '^xlib' },
      to: { pathNot: '^xlib', dependencyTypes: ['local'] },
    },
    {
      name: 'no-src-import-pages',
      severity: 'error',
      comment: 'src/ must not depend on src/pages',
      from: { path: '^src' },
      to: { path: '^src/pages' },
    },
    {
      name: 'scripts-import-barrels-only',
      severity: 'error',
      comment: 'scripts may only import service barrels, config, xlib, and data',
      from: { path: '^scripts' },
      to: { path: '^src/', pathNot: '^src/(config/|.*/services/index\\.ts$)' },
    },
    {
      name: 'env-only-from-scripts',
      severity: 'error',
      comment: 'src/config/env is a scripts-only concern; the site build needs no key',
      from: { pathNot: '^(scripts|src/config)' },
      to: { path: '^src/config/env' },
    },
    {
      name: 'no-deep-service-imports',
      severity: 'error',
      comment: 'services are imported through their barrel, never a deep path',
      from: { pathNot: '/services/' },
      to: { path: '/services/(?!index\\.ts$)' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'circular imports make module boundaries meaningless',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    exclude: { path: '\\.astro$' },
  },
};
