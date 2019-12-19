import fs from 'fs';
import path from 'path';
import { createDefaultConfig } from '@open-wc/building-rollup';

const config = createDefaultConfig({
  input: './src/invoice-renderer/invoice-renderer.js',
  plugins: {
    indexHTML: false,
  },
});

export default {
  ...config,
  output: {
    ...config.output,
    entryFileNames: 'invoice-renderer.js',
  },
  plugins: [
    ...config.plugins,
    {
      name: 'copy-assets',
      buildStart() {
        const htmlPath = path.join(__dirname, 'invoice.html');
        const htmlString = fs.readFileSync(htmlPath, 'utf-8');

        const logoPath = path.join(__dirname, 'logo.png');
        const logoBuffer = fs.readFileSync(logoPath);

        this.emitFile({
          type: 'asset',
          source: htmlString.replace(
            './src/invoice-renderer/invoice-renderer.js',
            '/invoice-renderer.js',
          ),
          name: 'invoice.html',
          fileName: 'invoice.html',
        });

        this.emitFile({
          type: 'asset',
          source: logoBuffer,
          name: 'logo.png',
          fileName: 'logo.png',
        });
      },
    },
  ],
};
