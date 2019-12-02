const path = require('path');

module.exports = {
  // navigateFallback: '/index.html',
  // where to output the generated sw
  swDest: path.join(process.cwd(), 'dist', 'sw.js'),
  // directory to match patterns against to be precached
  globDirectory: path.join(process.cwd(), 'dist'),
  // cache any html js and css by default
  globPatterns: ['**/*.{html,js,css}'],
};
