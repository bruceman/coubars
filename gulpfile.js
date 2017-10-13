var gulp = require('gulp');
var rollup = require('rollup');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var babel = require('rollup-plugin-babel');

/**
 * Build coubars
 */
gulp.task('build', function () {
  return rollup.rollup({
      input: "./src/test.js",
      plugins: [
        nodeResolve(),
        commonjs(),
        babel({
          exclude: 'node_modules/**' // only transpile our source code
        })
      ],
    })
    .then(function (bundle) {
      bundle.write({
        format: "cjs",
        file: "./dist/test.js"
      });
    })
});

/**
 * The default task run by Gulp.
 */
gulp.task('default', ['build']);