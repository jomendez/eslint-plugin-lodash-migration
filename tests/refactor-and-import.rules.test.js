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

const obj2 = {};
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
console.log('obj2:', _(obj2).keyBy(name).value());
`,
      output:
        `
import * as _ from 'lodash';
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import keyBy from 'lodash-es/keyBy';

const obj2 = {};
console.log('obj2:', keyBy(obj2, name));
`,
      errors: [{ message: individualMethodsMessage }]
    },
    {
      code:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';

const obj2 = {};
console.log('obj2:', _(obj2).keyBy(name));
`,
      output:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import keyBy from 'lodash-es/keyBy';

const obj2 = {};
console.log('obj2:', keyBy(obj2, name));
`,
      errors: [{ message: individualMethodsMessage }]
    },
    {
      code:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';

const obj2 = {};
console.log('array1:', _(array1).isEmpty());
`,
      output:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import isEmpty from 'lodash-es/isEmpty';

const obj2 = {};
console.log('array1:', isEmpty(array1));
`,
      errors: [{ message: individualMethodsMessage }]
    },
    {
      code:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';

const obj2 = {};
if(_(myTest.filter(x=> x)).last()){
  const aux = 'a';
}
`,
      output:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import last from 'lodash-es/last';

const obj2 = {};
if(last(myTest.filter(x=> x))){
  const aux = 'a';
}
`,
      errors: [{ message: individualMethodsMessage }]
    },
    {
      code:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';

const obj2 = {};
const aux = _.map(this.arg, 'test');
`,
      output:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import map from 'lodash-es/map';

const obj2 = {};
const aux = map(this.arg, 'test');
`,
      errors: [{ message: individualMethodsMessage }]
    },
    {
      code:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';

const obj2 = {};
console.log('obj2:', _(obj2).catsArray().uniq().value());
`,
      output:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import catsArray from 'lodash-es/catsArray';
import uniq from 'lodash-es/uniq';

const obj2 = {};
console.log('obj2:', uniq(catsArray(obj2)));
`,
      errors: [{ message: individualMethodsMessage }]
    },
    {
      code:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
_(obj).forEach((links: string)=>{
  this.test = 'test'
});
const obj2 = {};
`,
      output:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import forEach from 'lodash-es/forEach';
forEach(obj, (links: string)=>{
  this.test = 'test'
});
const obj2 = {};
`,
      errors: [{ message: individualMethodsMessage }]
    },
    {
      code:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import map from 'lodash-es/map';

const obj2 = {};
const aux = map(this.arg, 'test');
const aux1 = _.map(this.arg, 'test');
`,
      output:
        `
import test from 'test-pack';
import {test0, test1} from 'test-pack';
import map from 'lodash-es/map';

const obj2 = {};
const aux = map(this.arg, 'test');
const aux1 = map(this.arg, 'test');
`,
      errors: [{ message: individualMethodsMessage }]
    }
  ]
});
