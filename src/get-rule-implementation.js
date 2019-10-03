const getAssertionsForTestcase = require('./get-assertions-for-testcase')
const getTestcaseMappings = require('./get-testcase-mappings')
const getRuleImplementationState = require('./get-rule-implementation-state')
const getBestMatchingRules = require('./get-best-matching-rules')

/**
 * Get implementation for a given ACT rule
 * @param {Object[]} ruleTestcases all testcases of a given ACT rule
 * @param {Object[]} assertions all assertions from a given report
 * @returns {Object}
 */
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
	for (const testcase of ruleTestcases) {
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

	const implementation = Object.values(ruleData).map(ruleTestcaseMappings =>
		getRuleImplementationState(ruleTestcaseMappings)
	)

	return getBestMatchingRules(implementation)
}

module.exports = getRuleImplementation
