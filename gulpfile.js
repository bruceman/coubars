const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const exec = require('child_process').exec;

// rollup build config
const config = {
    input: 'test.js',
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        })
    ],
    output: {
        file: 'dist/test.js',
        format: 'umd'
    }
};

gulp.task('jison:build', function(cb) {
    exec('npm run jison -- -m js src/handlebars.yy src/handlebars.l -o src/handlebars.js', function(err) {
        if (err) return cb(err);
        cb();
      });
});

gulp.task('generate:parser', ['jison:build'], function(cb) {
    return gulp.src(['src/parser-prefix.js', 'src/handlebars.js', 'src/parser-suffix.js'])
        .pipe(concat('parser.js'))
        .pipe(gulp.dest('lib/handlebars/compiler'));
});

gulp.task('build', function () {
    const output = config.output;

    return rollup.rollup(config)
        .then(bundle => bundle.generate(output))
        .then(({code}) => {
            return write(output.file, code);
        });
});

function write(dest, code) {
    return new Promise((resolve, reject) => {
        function report() {
            console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code));
            resolve();
        }

        fs.writeFile(dest, code, err => {
            if (err) return reject(err)
            report();
        });
    })
}

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}

function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}