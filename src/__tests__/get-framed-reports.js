const jsonLoader = require('../json-loader')
const getFramedReports = require('../get-framed-reports')

describe(`getFramedReports`, () => {
	let report

	beforeAll(async done => {
		report = await jsonLoader(
			'https://raw.githubusercontent.com/act-rules/act-rules-implementation-alfa/master/report.json'
		)
		done()
	})

	it('returns empty array when no reports are given as arguments', async () => {
		const actual = await getFramedReports()
		expect(actual).toBeArrayOfSize(0)
	})

	it('returns framed report from given url', async () => {
		const framedReport = await getFramedReports(report)
		expect(framedReport).toBeDefined()
		expect(Object.keys(framedReport[0])).toEqual(['@context', '@graph'])
	})
})
