const jsonLoader = require('../json-loader')
const getAssertions = require('../get-assertions')

describe(`getAssertions`, () => {
	let report

	beforeAll(async done => {
		report = await jsonLoader(
			'https://raw.githubusercontent.com/act-rules/act-rules-implementation-alfa/master/report.json'
		)
		done()
	})

	it('returns assertions from framed reports', async () => {
		const assertions = await getAssertions(report)
		expect(assertions.length).toBeGreaterThan(0)
	})
})
