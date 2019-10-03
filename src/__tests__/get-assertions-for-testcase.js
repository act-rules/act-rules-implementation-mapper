const getAssertionsForTestcase = require('../get-assertions-for-testcase')

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
const noMatchingAssertions = [
	{
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
			'@id': 'https://act-rules.github.io/testcases/NO_RULE_ID/a49a08353a9370e068946b4089b5cdb51ff09a11.html',
		},
	},
]
const matchingAssertions = [
	{
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
	},
	{
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
			'@id': 'https://act-rules.github.io/testcases/ANOTHER_RULE/bf1b811b607247364c2322dd45c047f2e3211229.html',
		},
	},
	{
		'@type': 'earl:Assertion',
		result: {
			'@type': 'earl:TestResult',
			outcome: 'failed',
			pointer: {
				'@type': ['ptr:Pointer', 'ptr:XPathPointer'],
				expression: '/',
				reference: {},
			},
		},
		subject: {
			'@id': 'https://act-rules.github.io/testcases/SOME_OTHER_RULE/37528789a63203943f689afa90a400a99c4f861d.html',
		},
	},
]

describe(`getAssertionsForTestcase`, () => {
	test(`returns empty array when there is no assertion for a given testcase`, () => {
		const actual = getAssertionsForTestcase(testcase, noMatchingAssertions)
		expect(actual).toBeArrayOfSize(0)
	})

	test(`returns matching assertion for a given testcase`, () => {
		const actual = getAssertionsForTestcase(testcase, matchingAssertions)
		expect(actual).toBeArrayOfSize(1)
	})
})
