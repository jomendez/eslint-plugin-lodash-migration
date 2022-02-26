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

const value = _(field).map(v=> v[MY_KEY]).value();
`,
      output: 
`

import test from 'test-pack';
import {test0, test1} from 'test-pack';
import { map } from 'lodash-es/map';

const value = map(field, v=> v[MY_KEY]);
`,
      errors: [{ message }, { message }]
    },
//     {
//       code: 
// `
// import * as _ from 'lodash';

// _(jsconfig).each((value, name) => {
//   this[name] = value;
// });
// `,
//       output: 
// `

// import { each } from 'lodash-es/each';

// each(jsconfig, (value, name) => {
//   this[name] = value;
// });
// `,
//       errors: [{ message }, { message }]
//     }
  ]
});