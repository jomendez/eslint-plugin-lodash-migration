module.exports = {
  meta: {
    fixable: 'Import individual lodash packages'
  },
  create: function (context) {
    const sourceCode = context.getSourceCode();
    const fixerArray = [];
    const modulesToBeImported = new Set();
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
              fixer.replaceTextRange([node.range[0], node.range[1]], '')
            ];
            return result
          }
        });
      },
      CallExpression(node) {
        const importsDeclarations = sourceCode.ast.body.filter(x => x.type === 'ImportDeclaration')

        if (node && node.callee && node.callee.object && node.callee.object.name === '_') {
          modulesToBeImported.add(node.callee.property.name);
          context.report({
            node,
            message: warningMessage,

            fix(fixer) {
              fixerArray.push(
                // this is for cases like _.isEmpty() where we just need to remove the "_."
                fixer.replaceTextRange([node.range[0], node.range[0] + 2], '')
              )
              return [
                ...getImports(importsDeclarations, modulesToBeImported, fixer),
                ...fixerArray
              ]
            }
          });
        } else if (node && node.callee && node.callee.object && node.callee.object.callee && node.callee.object.callee.name === '_') {
          modulesToBeImported.add(node.callee.property.name);
          context.report({
            node,
            message: warningMessage,

            fix(fixer) {
              // for cases like _(tes).isEmpty()
              const [fixes, extraModulesToBeImported] = parseLodashFunctionExpression(node.callee.object.arguments, node.callee.object, sourceCode, fixerArray, fixer, node);
              if (extraModulesToBeImported) {
                modulesToBeImported.add(extraModulesToBeImported);
              }
              return [
                // the order here is important, parseLodashFunctionExpression also handles cases like neted calls 
                // like for example_(obj2).catsArray().uniq().value())
                // and we need to make sure we import castArray and uniq
                ...fixes,
                ...getImports(importsDeclarations, modulesToBeImported, fixer)
              ];
            }
          });
        }
      }
    };
  }
}


function parseLodashFunctionExpression(objArguments, object, sourceCode, fixerResultsArray, fixer, node) {
  const argumentSourceCode = [];
  if (Array.isArray(objArguments) && objArguments.length > 0) {
    objArguments.forEach(arg => {
      argumentSourceCode.push(sourceCode.getText(arg));
    });
    let argumentsText = argumentSourceCode.join(', ');

    if (object && object.parent && object.parent.property) {
      let [_, propertyRangeEnd] = object.parent.property.range;
      propertyRangeEnd++; // make the end position after the parentheses eg: .byKey(|
      if (Array.isArray(object.parent.parent.arguments) && object.parent.parent.arguments.length > 0) {
        argumentsText += ', '
      }
      fixerResultsArray.push(fixer.replaceTextRange([propertyRangeEnd, propertyRangeEnd], argumentsText));
    }

    const [objectStart, objectEnd] = object.range;
    if (object) {
      // objectEnd + 1 to delete the point after the object eg: _(obj2).|
      fixerResultsArray.push(fixer.replaceTextRange([objectStart, objectEnd + 1], ''));
    }

    if (node && node.parent && node.parent.property && node.parent.property.name && node.parent.property.name === 'value') {
      const [start, end] = node.parent.property.range;
      //start-1 to remove the dot (.value()) and end + 2 to remove the parentheses  
      fixerResultsArray.push(fixer.replaceTextRange([start - 1, end + 2], ''));
    }

    if (node && node.parent && node.parent.property && node.parent.property.name && node.parent.property.name !== 'value') {
      if (Array.isArray(node.parent.parent.arguments) && node.parent.parent.arguments.length === 0) {

        const [start, end] = node.parent.property.range;
        //start-1 to remove the dot .uniq( and end + 1 to temove the open parentheses, and keep the close parentheses )  
        fixerResultsArray.push(fixer.replaceTextRange([start - 1, end + 1], ''));
        // place the function name in front of the expression with eg: from isEmpty().uniq() to uniq( isEmpty() )
        fixerResultsArray.push(fixer.replaceTextRange([objectEnd + 1, objectEnd + 1], `${node.parent.property.name}(`));

        if (node && node.parent && node.parent.parent && node.parent.parent.parent && node.parent.parent.parent.property &&
          node.parent.parent.parent.property.name && node.parent.parent.parent.property.name === 'value') {
          const [start, end] = node.parent.parent.parent.property.range;
          //start-1 to remove the dot (.value()) and end + 2 to remove the parentheses  
          fixerResultsArray.push(fixer.replaceTextRange([start - 1, end + 2], ''));
        }
      }
      return [fixerResultsArray, node.parent.property.name]
    }

  }
  return [fixerResultsArray, ''];
}


function getImports(importDeclarations, lodashFunctionNames, fixer) {
  const fixerArray = [];
  let lastImportNodeEndRange = null;
  if (!importDeclarations || importDeclarations.length === 0) {
    lastImportNodeEndRange = 0
  } else {
    lastImportNodeEndRange = importDeclarations[importDeclarations.length - 1].range[1];
  }

  let imports = '';
  for (let importName of lodashFunctionNames) {
    const alreadyIncluded = importDeclarations.find(x => x.source.raw.includes('/' + importName) || x.specifiers.some(x => x.local.name === importName));
    if (!alreadyIncluded) {
      imports += `\nimport { ${importName} } from 'lodash-es/${importName}';`
    }
  }

  fixerArray.push(
    fixer.replaceTextRange([lastImportNodeEndRange, lastImportNodeEndRange], imports)
  );
  return fixerArray;
}
