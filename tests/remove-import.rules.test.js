'use strict';
const { eslintOptions } = require('./utils/eslint-options');
const noFullLodashImportRuleName = 'no-full-lodash-imports';
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const noFullLodashImportRuleNameRule = require('../lib/index').rules[noFullLodashImportRuleName];
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const importMessage = 'Import the entired lodash module is not optimal, please consider refactor it or apply --fix';
const ruleTester = new RuleTester(eslintOptions);

ruleTester.run(noFullLodashImportRuleName, noFullLodashImportRuleNameRule, {
  valid: [
    `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
`
  ],

  invalid: [
    {
      code:
        `
import * as _ from 'lodash';
import test from 'test-pack';
import {test0, test1} from 'test-pack';

const obj2 = {};
`,
      output:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';

const obj2 = {};
`,
      errors: [{ message: importMessage }]
    }
  ]
});