import debug from 'debug'
import { findAssertions } from './earl/find-assertions'
import { getImplementationSet } from './get-implementation-set'
import { ruleIdFromSubject } from './utils/get-rule-id'
import { EarlAssertion } from './earl/types'
import { PartialTestcase, Consistency, Implementation } from './get-implementation'

export { loadJson } from './load-json'

export type Testcase = {
	ruleId: string
	url: string
	testcaseId: string
	testcaseTitle: string
	expected: 'passed' | 'failed' | 'inapplicable'
	ruleName: string
	rulePage: string
	ruleAccessibilityRequirements: {
		[propName: string]: {
			forConformance: boolean
			failed: 'not satisfied'
			passed: 'satisfied' | 'further testing needed'
			inapplicable: 'satisfied' | 'further testing needed'
		}
	}
}

export type TestCaseJson = {
	testcases: PartialTestcase[]
}

export type AssertionGroup = {
	[propName: string]: EarlAssertion[]
}

export type ToolMetadata = {
	organisation?: string
	toolName?: string
	toolVersion?: string
}

export type ImplementationSet = {
	ruleId: string
	ruleName?: string
	complete: boolean
	consistency: Consistency
	implementations: Implementation[]
}

export async function actMapGenerator(jsonld: any, { testcases }: TestCaseJson, meta: ToolMetadata = {}) {
	const assertions = await findAssertions(jsonld)

	// Group assertions by rule
	const assertsByRule = assertions.reduce((assertsByRule: AssertionGroup, assertion) => {
		const ruleId = ruleIdFromSubject(assertion.subject)
		if (!ruleId) {
			debug('actMapper')(`Skipped! Could not find 'ruleId' in subject of assertion ${JSON.stringify(assertion)}`)
			return assertsByRule
		}
		if (!assertsByRule[ruleId]) {
			assertsByRule[ruleId] = []
		}
		assertsByRule[ruleId].push(assertion)
		return assertsByRule
	}, {})

	// Get an implementationSet for each rule
	const actMapping: ImplementationSet[] = Object.entries(assertsByRule)
		.map(
			([ruleId, ruleAssertions]): ImplementationSet => {
				const ruleTestCases = testcases.filter(testcase => testcase.ruleId === ruleId)
				if (ruleTestCases.length === 0) {
					throw new Error(`Unable to find testcases for rule ${ruleId}`)
				}

				return {
					ruleId,
					ruleName: ruleTestCases[0].ruleName,
					...getImplementationSet(ruleAssertions, ruleTestCases),
				}
			}
		)
		.sort(implementationSetSort)

	return {
		...meta,
		summary: {
			consistent: countPropMatch(actMapping, 'consistency', 'consistent'),
			partiallyConsistent: countPropMatch(actMapping, 'consistency', 'partially-consistent'),
			inconsistent: countPropMatch(actMapping, 'consistency', 'inconsistent'),
			incomplete: countPropMatch(actMapping, 'complete', false),
		},
		actMapping,
	}
}

const consistencyWeight: Consistency[] = ['inconsistent', 'partially-consistent', 'consistent']
function implementationSetSort(setA: ImplementationSet, setB: ImplementationSet): number {
	const weightA = consistencyWeight.indexOf(setA.consistency)
	const weightB = consistencyWeight.indexOf(setB.consistency)
	if (weightA !== weightB) {
		return weightB - weightA
	}
	if (setA.complete !== setB.complete) {
		return Number(setA.complete) - Number(setB.complete)
	}
	return 0
}

function countPropMatch(actMapping: ImplementationSet[], prop: 'consistency' | 'complete', value: any): number {
	return actMapping.reduce((count: number, set: ImplementationSet) => {
		return count + Number(set[prop] === value)
	}, 0)
}
