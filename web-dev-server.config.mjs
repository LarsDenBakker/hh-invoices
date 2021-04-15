import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  appIndex: 'index.html',
  nodeResolve: true,
  watch: true,
  plugins: [esbuildPlugin({ ts: true })],
};
