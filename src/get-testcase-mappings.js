const flat = require('flat')

/**
 * Get an outcome mapping from an assertion for a given testcase
 * @param {Object} testcase ACT testcase
 * @param {Object} assertion assertion
 * @returns {Object}
 */
function getTestcaseMappings(testcase, assertion) {
	const { expected, relativePath } = testcase
	return {
		actual: assertion.result.outcome.replace('earl:', ''),
		expected,
		title: getAssertionTitle(assertion),
		url: getAssertionSource(assertion, relativePath),
	}
}

module.exports = getTestcaseMappings

/**
 * Get source of a given assertion
 * @param {Object} assertion assertion
 * @param {String} testcaseRelativePath relative path of a given testcase
 * @returns {String}
 */
function getAssertionSource(assertion, testcaseRelativePath) {
	const flatAssertion = flat(assertion)
	const source = Object.values(flatAssertion)
		.filter(val => val && typeof val === 'string')
		.find(value => value.includes(testcaseRelativePath))
	return source
}

/**
 * Get title of a given assertion
 * @param {Object} assertion assertion
 * @returns {String|null}
 */
function getAssertionTitle(assertion) {
	const { test, EMTest } = assertion
	if (!test) {
		return EMTest || null
	}
	if (typeof test === 'string') {
		return test
	}
	if (test.title) {
		return test.title
	}
	return test['@id'] || ''
}
