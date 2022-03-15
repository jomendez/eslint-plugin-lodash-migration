'use strict';
const { eslintOptions } = require('./utils/eslint-options');
const unifyIntoOneCall = 'unify-imports-into-one-call';
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const unifyIntoOneCallRule = require('../lib/index').rules[unifyIntoOneCall];
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const importMessage = '--fix';
const ruleTester = new RuleTester(eslintOptions);

ruleTester.run(unifyIntoOneCall, unifyIntoOneCallRule, {
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
import test from 'test-pack';
import map from 'lodash-es/map';
import {test0, test1} from 'test-pack';
import each from 'lodash-es/each';
import remove from 'lodash-es/remove';

const obj2 = {};
`,
      output:
`
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import { map, each, remove } from 'lodash-es';

const obj2 = {};
`,
      errors: [{ message: importMessage }, { message: importMessage }, { message: importMessage }]
    }
  ]
});