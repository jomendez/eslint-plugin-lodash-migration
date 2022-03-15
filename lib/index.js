/**
 * @fileoverview no full lodash imports
 * @author Jose Mendez
 */
'use strict';

const convertAndImport = require("./rules/convert-and-import");
const noFullLodashImports = require("./rules/no-full-lodash-imports");
const unifyIntoOneCall = require("./rules/unify-imports-into-one-call");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
module.exports = {
  rules: {
    'convert-and-import': convertAndImport,
    'no-full-lodash-imports': noFullLodashImports,
    'unify-imports-into-one-call': unifyIntoOneCall
  }
};
