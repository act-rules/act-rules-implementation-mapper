const getTestcaseMappings = require('../get-testcase-mappings')

const testcase = {
	testcaseId: '15b0afb2496c5e7bf5ff0409cb5b39a8d5ae234b',
	url: 'https://act-rules.github.io/testcases/2779a5/15b0afb2496c5e7bf5ff0409cb5b39a8d5ae234b.html',
	relativePath: 'testcases/2779a5/15b0afb2496c5e7bf5ff0409cb5b39a8d5ae234b.html',
	expected: 'passed',
	ruleId: '2779a5',
	ruleName: 'HTML page has title',
	rulePage: 'https://act-rules.github.io/rules/2779a5',
	ruleAccessibilityRequirements: {
		'wcag20:2.4.2': {
			forConformance: true,
			failed: 'not satisfied',
			passed: 'further testing needed',
			inapplicable: 'further testing needed',
		},
	},
}
const assertion = {
	'@type': 'earl:Assertion',
	result: {
		'@type': 'earl:TestResult',
		outcome: 'passed',
		pointer: {
			'@type': ['ptr:Pointer', 'ptr:XPathPointer'],
			expression: '/',
			reference: {},
		},
	},
	subject: {
		'@id': 'https://act-rules.github.io/testcases/2779a5/15b0afb2496c5e7bf5ff0409cb5b39a8d5ae234b.html',
	},
}

describe(`getTestcaseMappings`, () => {
	test(`get testcase mapping from assertion`, () => {
		const actual = getTestcaseMappings(testcase, assertion)
		expect(actual).toContainKeys(['actual', 'expected', 'title', 'url'])
		expect(actual.url).toBe(assertion.subject['@id'])
		expect(actual.title).toBeNil()
	})
})
