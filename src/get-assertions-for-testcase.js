const flat = require('flat')

/**
 * Get all assertions for given testcase
 *
 * @param {Object[]} assertions assertions
 * @param {String} relativeUrl relative url of testcase
 */
function getAssertionsForTestcase(testcase, assertions) {
	const { relativePath } = testcase
	return assertions.filter(assertion => {
		const flatAssertion = flat(assertion)
		return Object.values(flatAssertion)
			.filter(val => val && typeof val === 'string')
			.some(value => value.includes(relativePath))
	})
}

module.exports = getAssertionsForTestcase
