const flat = require('flat')

// todo: jsdocs
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

// todo: jsdocs
function getAssertionSource(assertion, testcaseRelativePath) {
	const flatAssertion = flat(assertion)
	const source = Object.values(flatAssertion).find(value => value.includes(testcaseRelativePath))
	return source
}

// todo:docs
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
