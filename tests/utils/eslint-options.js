const eslintOptions = {
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    babelOptions: {
       presets: [require.resolve('@babel/preset-typescript')]
   }
  }
};
module.exports = {eslintOptions};