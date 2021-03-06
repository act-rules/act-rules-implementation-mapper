import { EarlAssertion } from './earl/types'

export type SatisfiedRequirement = 'satisfied' | 'further testing needed'

export type UnsatisfiedRequirement = 'not satisfied'

export type AccessibilityRequirement = {
  forConformance: boolean
  failed: UnsatisfiedRequirement
  passed: SatisfiedRequirement
  inapplicable: SatisfiedRequirement
}

export type ExpectedOutcome = 'passed' | 'failed' | 'inapplicable'

export type Testcase = {
  ruleId: string
  url: string
  testcaseId: string
  testcaseTitle: string
  expected: ExpectedOutcome
  ruleName: string
  rulePage: string
  ruleAccessibilityRequirements: {
    [propName: string]: AccessibilityRequirement
  }
}

export type TestCaseJson = {
  testcases: Testcase[]
}

export type ActualOutcome = ExpectedOutcome | 'cantTell' | 'untested'

export type TestFindings = {
  url: string
  expected: ExpectedOutcome
  actual: ActualOutcome
  correct: boolean
  testcase?: string
}

export type Consistency = 'consistent' | 'partially-consistent' | 'inconsistent'

export type SemiImplementation = {
  complete: boolean
  consistency: Consistency
  findings: TestFindings[]
}

export type Implementation = SemiImplementation & {
  implementationId: string
}

export type SemiImplementationSet = {
  complete: boolean
  consistency: Consistency
  implementations: Implementation[]
}

export type ImplementationSet = SemiImplementationSet & {
  ruleId: string
  ruleName: string
}

export type AssertionGroup = {
  [propName: string]: EarlAssertion[]
}

export type ToolMetadata = {
  organisation?: string
  toolName?: string
  toolVersion?: string
}
