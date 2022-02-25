/**
 * @fileoverview no full lodash imports
 * @author Jose Mendez
 */
'use strict';

const noFullLodashImports = require("./rules/no-full-lodash-imports");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
module.exports = {
  rules: {
    'no-full-lodash-imports': noFullLodashImports
  }
};
