# eslint-plugin-lodash-migration

## Description:

This eslint plugin migrates your code from importing and using the entire lodash code `import * as _ from 'lodash'` to import individual modules, like for example `import map from 'lodash-es/map'`.
It also migrates from using code like `_.map(...)` to `map(...)`.

### Limitations and constraints:
This migration has only been tested on angular projects with typescript.

This eslint plugin can be used in two ways mainly
 - As an eslint rule configured in your .eslintrc.* file in your angular project
 - Using the cli specifying the path to the project you want to migrate (recommended)

## System requirements:
Install node, we recommend v14.16.1
The plugin has only been tested with node v14.16.1
make sure npm is installed. 

# installation into an Angular project as an eslint rule

## Download and install

run npm install in the root folder.

```
$ npm install 
```

## Plugin Installation 

in the root of the project where you want to apply the plugin

``` 
npm i file:../eslint-plugin-lodash-migration/ --save
```

## Running unit test

`npm run test`

## Usage

Add eslint to an angular project:

```
ng add @angular-eslint/schematics
```

Add `lodash-migration` to the plugins seccion `convert-and-import` to the plugins section of your `.eslintrc` or `.eslintrc.json` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
      "plugins": ["lodash-migration"],
      "rules": {
        "lodash-migration/convert-and-import": 1,
}
```

To migrate you need to run the following command 
```
npm run lint --fix
```

# lodash migration from the cli

After installing all the dependencies `npm i` to be able to start a migration from the cli run:

```npm link```

or run this command (only use it the first time you are setting the project)

``` npm run prep ```

**You might need admin privileges to run `npm link`**

Now you are going to be able to run the `migrate-lodash` command specifiying the path to the project that you want to migrate.

```
migrate-lodash --path <path-to-yout-project>/src
```
or 
```
migrate-lodash -p <path-to-yout-project>/src
```

### Other flags:
By default the imports are generated like:
```javascript
import { findIndex, catsArray, uniq } from 'lodash-es';
```

If you use flag `--individual-imports` or `-i` in the cli when running the `migrate-lodash` command, then the output is going to be:
```javascript
import findIndex from 'lodash-es/findIndex';
import catsArray from 'lodash-es/catsArray';
import uniq from 'lodash-es/uniq';
```

**Note:**
Please make sure you select a folder with the ts files that are using ladash the old fashion and you want to migrate, for example:
`angular-project/src`
If you specify `angular-project` only the plugin will try to apply the migration to all directories within your angular project including the node_module folder, this might throw some error.  

## What to spect 

This solution is not 100% effective since there are too many scenarios and combinations, but at least it will save you 90% of the effort of going manually file by file applying the changes.
We recommend having as much unit test coverage as possible, this way you'll be able to catch as many potential errors as possible from the refactor.

### Common cases for refactor

Simple cases:

```
// from:
_.isEmpty(collection)

// to:
isEmpty(collection)
```

or 

```
// from:
_(collection).isEmpty()

// to:
isEmpty(collection)
```


A little bit more complex cases
```
// from:
_(collectionTest).catsArray().uniq().value()

// to:
uniq(castArray(collectionTest))
```