import { createDefaultConfig } from '@open-wc/building-rollup';
import indexHTML from 'rollup-plugin-index-html';
import cpy from 'rollup-plugin-cpy';

const config = createDefaultConfig({
  input: './index.html',
  extensions: ['.js', '.mjs', '.ts'],
  plugins: {
    indexHTML: false,
  },
});

export default {
  ...config,
  plugins: [
    ...config.plugins,
    indexHTML(),
    cpy({
      // copy over all images files
      files: ['assets/**/*'],
      dest: 'dist',
      options: {
        // parents makes sure to preserve the original folder structure
        parents: true,
      },
    }),
  ],
};
