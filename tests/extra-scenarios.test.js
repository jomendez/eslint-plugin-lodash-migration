'use strict';

const { eslintOptions } = require('./utils/eslint-options');
const convertAndImportRuleName = 'convert-and-import';
const noFullLodashImportRuleName = 'no-full-lodash-imports';
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const convertAndImportRuleNameRule = require('../lib/index').rules[convertAndImportRuleName];
const noFullLodashImportRuleNameRule = require('../lib/index').rules[noFullLodashImportRuleName];
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const importMessage = 'Import the entired lodash module is not optimal, please consider refactor it or apply --fix';
const individualMethodsMessage = 'Use individual imports of lodash method, please consider refactor it or apply --fix';
const ruleTester = new RuleTester(eslintOptions);

ruleTester.run(convertAndImportRuleName, convertAndImportRuleNameRule, {
  valid: [
`
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import { catsArray } from 'lodash-es/catsArray';
import { uniq } from 'lodash-es/uniq';

const obj2 = {};
console.log('obj2:', uniq(catsArray(obj2)));
`
  ],

  invalid: [
    {
      code: 
`
import * as _ from 'lodash';
import test from 'test-pack';
import {test0, test1} from 'test-pack';

let aux = _(existing)
      .intersection(selection.next).value()
`,
      output: 
`
import * as _ from 'lodash';
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import intersection from 'lodash-es/intersection';

let aux = intersection(existing, selection.next)
`,
      errors: [{ message: individualMethodsMessage }]
    },
    {
      code: 
`
import * as blah from 'blah-pack';

let range = [_(currenr).first().range[0], _(current).last().rangeCar[1]];
`,
      output: 
`
import * as blah from 'blah-pack';
import first from 'lodash-es/first';

let range = [first(currenr).range[0], _(current).last().rangeCar[1]];
`,
      errors: [{  message: individualMethodsMessage }, {  message: individualMethodsMessage }]
    },
    {
      code: 
`
import * as blah from 'blah-pack';
import first from 'lodash-es/first';

let range = [first(currenr).range[0], _(current).last().rangeCar[1]];
`,
      output: 
`
import * as blah from 'blah-pack';
import first from 'lodash-es/first';
import last from 'lodash-es/last';

let range = [first(currenr).range[0], last(current).rangeCar[1]];
`,
      errors: [{  message: individualMethodsMessage }]
    },
    {
      code: 
`
import * as blah from 'blah-pack';
import first from 'lodash-es/first';

let range = [first(currenr).range[0], _.clone(test)];
`,
      output: 
`
import * as blah from 'blah-pack';
import first from 'lodash-es/first';
import clone from 'lodash-es/clone';

let range = [first(currenr).range[0], clone(test)];
`,
      errors: [{  message: individualMethodsMessage }]
    }
  ]
});
