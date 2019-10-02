const groupBy = require('lodash.groupby')

const getAssertions = require('./get-assertions')
const getRuleMapping = require('./get-rule-mapping')

/**
 * Get implementation metric from submitted report
 *
 * @param {Object|Array<Objects>} reports implementation reports
 * @param {Object} testcases ACT Rules testcases
 * @param {Object} actRulesPkgJson ACT Rules actRulesPkgJson
 */
const getImplementationForReport = async (reports, testcases, actRulesPkgJson) => {
	const assertions = getAssertions(reports)
	const testcasesGroupedByRuleId = groupBy(testcases, 'ruleId')

	return Object.keys(testcasesGroupedByRuleId)
		.map(ruleId => {
			const ruleTestcases = testcasesGroupedByRuleId[ruleId]
			const implementation = getRuleMapping(ruleTestcases, assertions, actRulesPkgJson)
			return {
				ruleId,
				ruleName: ruleTestcases[0].ruleName,
				implementation,
			}
		})
		.filter(result => result.implementation && result.implementation.length)
}

module.exports = getImplementationForReport
