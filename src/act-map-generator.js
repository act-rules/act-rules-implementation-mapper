const groupBy = require('lodash.groupby')
const getAssertionsFromJsonReports = require('./get-assertions-from-json-reports')
const getRuleImplementation = require('./get-rule-implementation')

const actMapGenerator = async (jsonReports, testcases, { organisation, tool }) => {
	const assertions = await getAssertionsFromJsonReports(jsonReports)
	const groupedTestcasesByRuleId = groupBy(testcases, 'ruleId')

	const mapping = []
	for (const [ruleId, ruleTestcases] of Object.entries(groupedTestcasesByRuleId)) {
		const implementation = getRuleImplementation(ruleTestcases, assertions)
		if (!implementation || !implementation.length) {
			continue
		}
		mapping.push({
			ruleId,
			ruleName: ruleTestcases[0].ruleName,
			implementation,
		})
	}

	return {
		organisation,
		tool,
		mapping,
	}
}

module.exports = actMapGenerator
