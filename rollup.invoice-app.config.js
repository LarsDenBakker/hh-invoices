import { createDefaultConfig } from '@open-wc/building-rollup';

const config = createDefaultConfig({
  input: './src/invoice-app/invoice-app.js',
  plugins: {
    indexHTML: false,
  },
});

export default {
  ...config,
  output: {
    ...config.output,
    entryFileNames: 'invoice-app.js',
  },
};
