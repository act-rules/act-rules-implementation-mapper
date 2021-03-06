import debug from 'debug'
import { findAssertions } from './earl/find-assertions'
import { getImplementationSet } from './get-implementation-set'
import { ruleIdFromSubject } from './utils/get-rule-id'
import { EarlAssertion } from './earl/types'
import { ImplementationSet, TestCaseJson, ToolMetadata, AssertionGroup, Consistency } from './types'

export { loadJson } from './load-json'

export async function actMapGenerator(jsonld: any, { testcases }: TestCaseJson, meta: ToolMetadata = {}) {
  const assertions = await findAssertions(jsonld)
  const assertsByRule = groupAssertionsByRule(assertions)

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

function groupAssertionsByRule(assertions: EarlAssertion[]): AssertionGroup {
  const assertsByRule: AssertionGroup = {}

  assertions.forEach(assertion => {
    const ruleId = assertion.subject && ruleIdFromSubject(assertion.subject)
    if (!ruleId) {
      debug('actMapper')(`Skipped! Could not find 'ruleId' in subject of assertion ${JSON.stringify(assertion)}`)
      return
    }
    if (!assertsByRule[ruleId]) {
      assertsByRule[ruleId] = []
    }
    assertsByRule[ruleId].push(assertion)
  })
  return assertsByRule
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
