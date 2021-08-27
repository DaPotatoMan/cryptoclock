# typescript-browserify-template

My take on a minimal template for typescript projects.

## How to use

``` bash
npm run dist     # build & browserify (for using in vanilla js)
npm run build    # build only (for developemnt)
npm run bundle   # browserify only
```

## How to reproduce this template from scratch

1. `npm init`
   (you will probably want to do `git init` and add `.gitignore` as well)
2. `npm install --save-dev typescript browserify`
3. `./node_modules/.bin/tsc --init`
4. Edit the newly created `tsconfig.json` file, uncomment the `"declaration"` and `"outDir"` line, set `"outDir"` to be `"./lib"`.
5. Edit `package.json` to contain the following `"script"`s:
``` json
  "scripts": {
    "dist": "npm run build && npm run bundle",
    "build": "./node_modules/.bin/tsc",
    "bundle": "./node_modules/.bin/browserify  ./lib/index.js --s [moduleName] -o ./dist/bundle.js",
  },
```
   where `[modunleName]` should be replaced with the name you want the bundled result (`./dist/bundle.js`) to use when creating the module instance. Also, feel free to change the `./dist/bundle.js` part if you would like to use other file names.

6. Set `"main"` in `package.json` to be `./lib/index.js`.
7. `npm run build` your package, and add the `"typing"` field in `package.json`.

## What if I don't want to use `index.ts` as the entry point?

Just switch out occurences of `index` with `[your name here]` in `package.json` and it should work.
