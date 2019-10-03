const flat = require('flat')
const isUrl = require('is-url')

/**
 * Get all assertions for given testcase
 *
 * @param {Object[]} assertions assertions
 * @param {String} relativeUrl relative url of testcase
 */
function getAssertionsForTestcase(testcase, assertions) {
	const { relativePath } = testcase
	return assertions.filter(assertion => {
		return Object.values(flat(assertion)).some(value => isUrl(value) && value.includes(relativePath))
	})
}

module.exports = getAssertionsForTestcase
