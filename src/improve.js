const { ESLint } = require("eslint");

module.exports = async function improve(path) {
  eslint = new ESLint({
    useEslintrc: false,
    fix: true,
    overrideConfig: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021
      },
      plugins: ["lodash-migration"],
      rules: {
        "lodash-migration/unify-imports-into-one-call": 1
      }
    },
    plugins: {
      "eslint-plugin-lodash-migration": {
        rules: {
           "unify-imports-into-one-call": require("../lib/rules/unify-imports-into-one-call")
        }
      }
    }
  });

  console.log('******** Ruler: unify-imports-into-one-call ********')
  await migrate(path);


}


async function migrate(path) {
  try {
    const results = await eslint.lintFiles([`${path}/**/*.ts`]);
    // 3. Modify the files with the fixed code.
    await ESLint.outputFixes(results);
    console.log(`${results.length} files analyzed`);
    const modified = results.filter(x => !!x.output) || [];
    console.log(`${modified.length} files modified`);
    console.log('*********** success! **************');

  } catch (err) {
    console.log('***********************\n');
    console.error('There was an error: ', err, '\n')
    console.log('***********************\n');
  }
}