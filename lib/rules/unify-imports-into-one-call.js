module.exports = {
  meta: {
    fixable: 'Import individual lodash packages'
  },
  create: function (context) {
    const sourceCode = context.getSourceCode();
    const warningMessage = '--fix';
    return {
      ImportDeclaration(node) {        
        const importsDeclarations = sourceCode.ast.body.filter(x => x.type === 'ImportDeclaration' && x.source.value.includes('lodash-es/'));
        if(importsDeclarations?.length === 0 || !node.source.value.includes('lodash-es/')) {
          return false;
        }
        
        context.report({
          node,
          message: warningMessage,

          fix(fixer) {
            return importHelper(importsDeclarations, fixer);
          }
        });
      }
    };
  }
}

function importHelper(importsDeclarations, fixer){
  const results = []
  const specifiersList = [];
  if(importsDeclarations && importsDeclarations.length > 0){
    const last = importsDeclarations[importsDeclarations.length-1].range[1] + 1;
    importsDeclarations.forEach(declaration => {
      results.push(fixer.replaceTextRange([declaration.range[0], declaration.range[1] + 1], ''));
      if(declaration?.specifiers?.length === 1){
        specifiersList.push(declaration.specifiers[0].local.name);
      }
    });
    results.push(fixer.replaceTextRange([last, last],  `import { ${specifiersList.join(', ')} } from 'lodash-es';\n`));
  }
  return results
}
