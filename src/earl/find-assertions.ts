import { frame as jsonldFrame } from 'jsonld'
import * as earlContext from './earl-context.json'
import { AssertionGraph, EarlAssertion } from './types'
import debug from 'debug'

const assertionFrame = {
  ...earlContext,
  '@type': 'earl:Assertion',
}

export async function findAssertions(jsonReports: object | object[]): Promise<EarlAssertion[]> {
  if (typeof jsonReports !== 'object') {
    throw new TypeError(`JSON report must be an object or array, got '${jsonReports}'`)
  }

  const reports: object[] = Array.isArray(jsonReports) ? jsonReports : [jsonReports]
  const framedReports: AssertionGraph[] = []
  for (const report of reports) {
    try {
      const framedReport = (await jsonldFrame(report, assertionFrame)) as AssertionGraph
      framedReports.push(framedReport)
    } catch (e) {
      debug('findAssertions')(`Unable to frame JSON file. Got error:\n${e}`)
    }
  }

  /**
   * Extrapolate `@graph` object from each report
   */
  return framedReports.reduce((assertions: EarlAssertion[], framedReports): EarlAssertion[] => {
    const newAssertions = framedReports[`@graph`]
    return assertions.concat(newAssertions)
  }, [])
}
