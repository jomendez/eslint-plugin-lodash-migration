const { ESLint } = require("eslint");

module.exports = async function main(path) {
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
        "lodash-migration/convert-and-import": 1,
        "lodash-migration/no-full-lodash-imports": 1
      }
    },
    plugins: {
      "eslint-plugin-lodash-migration": {
        rules: {
          "convert-and-import": require("../lib/rules/convert-and-import"),
          "no-full-lodash-imports": require("../lib/rules/no-full-lodash-imports")
        }
      }
    }
  });

  for (let i = 0; i < 5; i++) {
    console.log('***** round ', i+1, '***********')
    await migrate(path);
  }

}

function getAllOutputsWhereLodashStillPresent(resultArr) {
  return (resultArr.filter(x => isLodashStillPresent(x.output)) || []).map(x => x.output) || []
}

function isLodashStillPresent(code) {
  const regex = /(_\.|_\()/g;
  return code.match(regex);
}

async function migrate(path) {
  try {
    const results = await eslint.lintFiles([`${path}/**/*.ts`]);
    // 3. Modify the files with the fixed code.
    await ESLint.outputFixes(results);
    console.log(`${results.length} files analyzed`);
    const modified = results.filter(x => !!x.output) || [];
    console.log(`${modified.length} files modified`);
    console.log(`${getAllOutputsWhereLodashStillPresent(modified).length} file(s) where old lodash usage still present`);
    console.log('*********** success! **************');

  } catch (err) {
    console.log('***********************\n');
    console.error('There was an error: ', err, '\n')
    console.log('***********************\n');
  }
}