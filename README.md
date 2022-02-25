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

Add `lodash-migration` to the plugins seccion `no-full-lodash-imports` to the plugins section of your `.eslintrc` or `.eslintrc.json` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
      "plugins": ["lodash-migration"],
      "rules": {
        "lodash-migration/no-full-lodash-imports": 1,
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

Now you are going to be able to run the `migrate-lodash` command specifiying the path to the project that you want to migrate.

```
migrate-lodash --path <path-to-yout-project>/src
```
or 
```
migrate-lodash -p <path-to-yout-project>/src
```

**Note:**
Please make sure you select a folder with the ts files that are using ladash the old fashion and you want to migrate, for example:
`angular-project/src`
If you specify `angular-project` only the plugin will try to apply the migration to all directories within your angular project including the node_module folder, this my trhrow some error.  


