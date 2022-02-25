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
      rules: { "lodash-migration/no-full-lodash-imports": 1 }
    },
    plugins: {
      "eslint-plugin-lodash-migration": { rules: { "no-full-lodash-imports": require("../lib/rules/no-full-lodash-imports") } 
    }
  }
  });
  
  const results = await eslint.lintFiles([`${path}/**/*.ts`]);
  
  // 3. Modify the files with the fixed code.
  await ESLint.outputFixes(results);
  
  console.log('success!');

}
