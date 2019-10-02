const groupBy = require('lodash.groupby')
const getAssertions = require('./get-assertions')

const actMapGenerator = (earlReports, testcases, { organisation, tool }) => {
	const assertions = getAssertions(earlReports)
	const actTestcasesGroupedByRuleId = groupBy(testcases, 'ruleId')

	const mapping = actTestcasesGroupedByRuleId.map(({ ruleId, testcases }) => {
		return getRuleMapping(testcases, assertions)
	})

	return {
		organisation,
		tool,
		mapping,
	}
}

module.exports = actMapGenerator
