import { frame as jsonldFrame } from 'jsonld'
import * as earlContext from './earl-context.json'
import { AssertionGraph, EarlAssertion } from './types'

const assertionFrame = {
	...earlContext,
	'@type': 'earl:Assertion',
}

export async function findAssertions(jsonReports: any): Promise<EarlAssertion[]> {
	if (typeof jsonReports !== 'object') {
		throw new TypeError(`JSON report must be an object or array, got '${jsonReports}'`)
	}
	if (!Array.isArray(jsonReports)) {
		jsonReports = [jsonReports]
	}

	const framedReports: AssertionGraph[] = []
	for (const report of jsonReports) {
		const framedReport = <AssertionGraph>await jsonldFrame(report, assertionFrame)
		framedReports.push(framedReport)
	}

	/**
	 * Extrapolate `@graph` object from each report
	 */
	return framedReports.reduce((assertions: EarlAssertion[], framedReports): EarlAssertion[] => {
		const newAssertions = framedReports[`@graph`]
		return assertions.concat(newAssertions)
	}, [])
}
