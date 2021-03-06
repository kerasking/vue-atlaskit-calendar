import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify-es";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const config = {
  input: "src/entry.js",
  output: {
    name: "Calendar",
    exports: "named"
  },
  plugins: [
    replace({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve(),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    buble()
  ]
};

if (argv.format === "iife") {
  config.plugins.push(uglify());
}

export default config;