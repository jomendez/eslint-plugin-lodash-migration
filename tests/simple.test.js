'use strict';

const { eslintOptions } = require('./utils/eslint-options');
const ruleName = 'no-full-lodash-imports';
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../lib/index').rules[ruleName];
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const message = 'Import the entired lodash module is not optimal, please consider refactor it or apply --fix';
const ruleTester = new RuleTester(eslintOptions);

ruleTester.run(ruleName, rule, {
  valid: [
    'let a = 1'
  ],

  invalid: [
    {
      code: 
`
import * as _ from 'lodash';
import test from 'test-pack';
import {test0, test1} from 'test-pack';

const obj2 = {};
console.log('obj2:', _(obj2).catsArray().uniq().value());
          `,
      output: 
`

import test from 'test-pack';
import {test0, test1} from 'test-pack';
import { catsArray } from 'lodash-es/catsArray';
import { uniq } from 'lodash-es/uniq';

const obj2 = {};
console.log('obj2:', uniq(catsArray(obj2)));
          `,
      errors: [{ message }, { message }]
    }
  ]
});