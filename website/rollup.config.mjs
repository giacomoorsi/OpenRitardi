import terser from '@rollup/plugin-terser';

export default [
    {
        input: [
            'js/src/statistics.js',
            'js/src/trains_search.js'
        ],
        output: {
            dir: 'js',
            format: 'es',
            sourcemap: true
        },
        plugins: [terser({format: {comments: false}})]
    }
]