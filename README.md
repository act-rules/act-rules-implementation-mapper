# act-rules-implementation-mapper

The `act-rules-implementation-mapper` is a module that generates [mapping](https://act-rules.github.io/pages/implementations/mapping/) for [ACT Rules](https://act-rules.github.io/rules/) vs., the [implementations](https://act-rules.github.io/pages/implementations/reporting/) provided by tool and methodology authors, so that the results can be reflected as an [implmentation metric](https://act-rules.github.io/pages/implementations/overview/).

## Installation

The ACT Map Generator is not available on NPM, but can be installed directly from GitHub:

```sh
npm install act-rules/act-rules-implementation-mapper
```

## How to use

The ACT Map Generator can be used from the command line or inside a NodeJS application.

### CLI usage

```sh
$ act-map-generator --help

Options:
  --jsonReports, -j   Implementation report                   [array] [required]
  --testcases, -t     ACT Rules testcases
                         [default: "https://act-rules.github.io/testcases.json"]
  --output, -o        Output directory for mapped results
                                              [default: "./{tool}-mapping.json"]
  --organisation, -O  Organisation, submitting the implementation report
  --toolName, -T      Tool which was used to generate the implementation report
                                                            [default: "unknown"]
  --toolVersion, -V   Version of the tool
  --help              Show help                                        [boolean]
  --version           Show version number                              [boolean]
```

Example of how to use:

Example:

```sh
act-map-generator
  --organisation 'MyOrg' # Name of the organisation
  --toolName 'MyTool' # Tool used for mapping
  --toolVersion '1.2.3' # Version number of the tool
  --jsonReports 'reports/*.json' # JSON LD/ EARL report(s), you can also use a URL
  --testcases 'testcases.json' # ACT Rules testcases, you can also use a URL
  --output 'mapping.json' # output file
```

### Javascript usage

```js
const { actMapGenerator, loadJson } = require('act-rules-implementation-mapper')

// Unified Earl reports from the various implementations provided by the implementer
const earlReports = loadJson(`earl-reports/*.json`)

// ACT Rules testcases (eg: see - https://act-rules.github.io/testcases.json)
const testcases = loadJson('https://act-rules.github.io/testcases.json')

actMapGenerator(earlReports, testcases, {
  organisation: `MyOrg`,
  toolName: `MyTool`,
  toolVersion: '3.4.0',
})
  .then(mapping => {
    fs.writeFileSync('myActMapping.json', JSON.stringify(mapping, null, 2))
  })
  .catch(e => console.error(e))
```

### Debugging

ACT mapper comes with a debugger, to use it set the environment varible before running (OSX Example):

```sh
DEBUG=* act-map-generator --jsonReports reports/*.json
```

For more information, see [debugger documentation](https://www.npmjs.com/package/debug).
