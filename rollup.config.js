import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

// rollup build configuration
export default {
    input: 'src/test.js',
    format: 'cjs',
    dest: 'dist/test.js',
    plugins: [
        nodeResolve(),
        commonjs(),
        babel({
          exclude: 'node_modules/**' // only transpile our source code
        })
    ],
    external: [
        'handlebars'
    ]
};
