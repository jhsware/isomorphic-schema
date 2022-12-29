import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';

const baseConfig = (outputFormat) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let file;
  switch (outputFormat) {
    case 'umd':
    case 'cjs':
      file = 'dist/' + outputFormat + '/index' + (isProduction ? '.min' : '') + '.js';
      break;

    default:
      throw new Error('Unsupported output format: ' + outputFormat);
  }

  return {
    input: 'src/index.js',
    plugins: [
      nodeResolve(),
      babel({
        plugins: [
          '@babel/plugin-proposal-decorators'
        ],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      isProduction ? minify({
        comments: false,
      }) : false,
    ],
    external: [
      'component-registry',
      'date-fns'
    ],
    output: {
            file: file,
      format: outputFormat,
      sourcemap: true,
      globals: {
        'component-registry': 'componentRegistry',
        'date-fns': 'dateFns',
        'striptags': 'striptags'
      },
    },
  };
};

export default [
  baseConfig('cjs'),
  baseConfig('umd'),
];