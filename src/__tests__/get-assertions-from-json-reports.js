const jsonLoader = require('../json-loader')
const getAssertionsFromJsonReports = require('../get-assertions-from-json-reports')

describe(`getAssertionsFromJsonReports`, () => {
	let report

	beforeAll(async done => {
		report = await jsonLoader(
			'https://raw.githubusercontent.com/act-rules/act-rules-implementation-alfa/master/report.json'
		)
		done()
	})

	it('returns assertions from framed reports', async () => {
		const assertions = await getAssertionsFromJsonReports(report)
		expect(assertions.length).toBeGreaterThan(0)
	})
})
