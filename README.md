# act-rules-implementation-mapper

The `act-rules-implementation-mapper` is a module that generates [mapping](https://act-rules.github.io/pages/implementations/mapping/) for [ACT Rules](https://act-rules.github.io/rules/) vs., the [implementations](https://act-rules.github.io/pages/implementations/reporting/) provided by parter/ implementer, so that the results can be reflected as an [implmentation metric](https://act-rules.github.io/pages/implementations/overview/).

## How to use

The module can be consumed by `javascript` or using the `CLI`.

### Javascript usage

```js
const { actMapGenerator, earlLoader } = require('act-rules-implementation-mapper')

// Unified Earl reports from the various implementations provided by the implementer
const earlReports = earlLoader(`dir/*.json`)

// ACT Rules testcases (eg: see - https://act-rules.github.io/testcases.json)
const testcases = require('dir/testcases.json')

actMapGenerator(earlReports, testcases, {
	organisation: `Deque`,
	tool: `Axe`,
})
	.then(mapping => {
		fs.writeFileSync('axeActMapping.json', JSON.stringify(mapping, null, 2)) //todo: check encoding usage
	})
	.catch(e => console.error(e))
```

### CLI usage

```sh
act-map-generator
  --organisation 'Siteimprove' # Name of the organisation
  --tool 'Alfa' # Tool used for mapping
  --earlReports 'earl-report.json' # JSON LD/ EARL report(s)
  --testcases 'testcases.json' # ACT Rules testcases
  --output 'result' # output directory
```
