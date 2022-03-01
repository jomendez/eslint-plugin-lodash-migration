module.exports = {
  meta: {
    fixable: 'Import individual lodash packages'
  },
  create: function (context) {
    const warningMessage = 'Import the entired lodash module is not optimal, please consider refactor it or apply --fix';
    return {
      ImportDeclaration(node) {
        if (node && node.specifiers) {
          const importNamespaceIdentifier = node.specifiers.find(x => x.type === 'ImportNamespaceSpecifier');
          const source = node.source.value === 'lodash';
          if (importNamespaceIdentifier && source) {
            // importLodashLoc = node.loc;
          } else {
            return false;
          }
        }
        context.report({
          node,
          message: warningMessage,

          fix(fixer) {
            const result = [
              fixer.replaceTextRange([node.range[0], node.range[1] + 1], '')
            ];
            return result
          }
        });
      }
    };
  }
}
