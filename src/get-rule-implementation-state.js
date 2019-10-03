const assert = require('assert')
const outcomeMapping = require('./config/outcome-mapping')

// todo: jsdocs
const getRuleImplementationState = ruleTestcaseMappings => {
	// @wilco - why?
	// const mapping = ruleTestcaseMappings.some(({ actual, expected }) => {
	// 	return expected === 'failed' && outcomeMapping['failed'].includes(actual)
	// })
	// if (!mapping) {
	// 	return { mapping: false }
	// }

	const incorrect = ruleTestcaseMappings
		.filter(({ expected, actual }) => {
			assert(outcomeMapping[expected], `Unknown result type ${expected}`)
			return !outcomeMapping[expected].includes(actual)
		})
		.map(({ url }) => url)

	const complete = ruleTestcaseMappings.every(
		({ expected, actual }) => outcomeMapping[expected].includes(actual) && !incorrect.length
	)

	return {
		id: ruleTestcaseMappings[0].title,
		complete,
		incorrect,
		assertions: ruleTestcaseMappings,
	}
}

module.exports = getRuleImplementationState
