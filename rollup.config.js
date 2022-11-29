// noinspection JSUnusedGlobalSymbols

import resolve from '@rollup/plugin-node-resolve'; // locate and bundle dependencies in node_modules (mandatory)
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: [
    {
      format: 'umd',
      file: 'dist/bundle.min.js',
      name: 'WebIFCThree'
    },
  ],
  plugins: [
    resolve({
      jsnext: true,
      browser: true
    }),
    commonjs(),
    babel(),
    terser({
      ecma: 5
    })
  ]
};