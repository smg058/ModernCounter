import terser from '@rollup/plugin-terser';

export default [
  // ES Module, Unminified.
  {
    input: 'src/index.js',
    output: {
      file: 'dist/modern-counter.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    }
  },
  // Minified version.
  {
    input: 'src/index.js',
    output: {
      file: 'dist/modern-counter.min.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      terser({
        compress: {
          drop_console: true
        }
      })
    ]
  }
];
