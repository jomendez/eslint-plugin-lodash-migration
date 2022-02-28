module.exports = {
  "root": true,    
  "env": {
    "browser": true,
    "es2021": true
},
"parser": "@typescript-eslint/parser",
    "overrides": [
      {
        "files": [ "./**/*.ts" ],
        "plugins": ["lodash-migration"],
        "rules": {
          "lodash-migration/convert-and-import": 1,
        }
      }
    ]
}
