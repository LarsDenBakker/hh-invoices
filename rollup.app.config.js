import { createDefaultConfig } from '@open-wc/building-rollup';
import indexHTML from 'rollup-plugin-index-html';

const config = createDefaultConfig({
  input: './index.html',
  extensions: ['.js', '.mjs', '.ts'],
  plugins: {
    indexHTML: false,
  },
});

export default {
  ...config,
  plugins: [...config.plugins, indexHTML()],
};
