const getAssertionsForTestcase = require('./get-assertions-for-testcase')
const getTestcaseMappings = require('./get-testcase-mappings')
const getRuleImplementationState = require('./get-rule-implementation-state')
// const getBestMatchingRules = require('./get-best-matching-rules')

// todo: jsdocs
function getRuleImplementation(ruleTestcases, assertions) {
	const ruleData = {}

	/**
	 * Iterate each `testcase` for a rule &
	 * create mapping against each assertion for a given `testcase`
	 */
	ruleTestcases.forEach(testcase => {
		const testcaseAssertions = getAssertionsForTestcase(testcase, assertions)

		testcaseAssertions.forEach(assertion => {
			const testMapping = getTestcaseMappings(testcase, assertion)
			if (!testMapping || testMapping.actual === 'untested') {
				return
			}
			if (!ruleData[testMapping.title]) {
				ruleData[testMapping.title] = []
			}
			ruleData[testMapping.title].push(testMapping)
		})
	})

	/**
	 * Push `untested` results for every testcase without an `assertion`
	 */
	for (testcase of ruleTestcases) {
		const { url, expected } = testcase

		Object.values(ruleData).forEach(ruleTestcaseMappings => {
			const testcaseAssertions = Object.values(ruleTestcaseMappings).some(testcaseMapping => {
				const { url } = testcaseMapping
				return url.includes(testcase.relativePath)
			})

			if (!testcaseAssertions) {
				ruleTestcaseMappings.push({
					actual: 'untested',
					expected,
					title: ruleTestcaseMappings[0].title,
					url,
				})
			}
		})
	}

	return Object.values(ruleData).map(ruleTestcaseMappings => getRuleImplementationState(ruleTestcaseMappings))

	// return getBestMatchingRules(ruleAsserts)
}

module.exports = getRuleImplementation
