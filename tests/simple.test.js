'use strict';

const { eslintOptions } = require('./utils/eslint-options');
const convertAndImportRuleName = 'convert-and-import';
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const convertAndImportRuleNameRule = require('../lib/index').rules[convertAndImportRuleName];
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const individualMethodsMessage = 'Use individual imports of lodash method, please consider refactor it or apply --fix';
const ruleTester = new RuleTester(eslintOptions);

ruleTester.run(convertAndImportRuleName, convertAndImportRuleNameRule, {
  valid: [
`
import * as _ from 'lodash';
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import clone from 'lodash-es/clone';

const obj2 = {};
const aux = clone(data) || {}
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
const aux = _.clone(data) || {}
          `,
      output: 
`
import * as _ from 'lodash';
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import clone from 'lodash-es/clone';

const obj2 = {};
const aux = clone(data) || {}
          `,
      errors: [{ message: individualMethodsMessage }]
    }
  ]
});