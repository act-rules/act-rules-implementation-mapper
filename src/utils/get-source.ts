import { EarlTestSubject } from '../earl/types'

export function sourceFromSubject(subject?: EarlTestSubject | string): string | void {
	if (typeof subject === 'string') {
		return subject
	}

	if (typeof subject !== 'object') {
		throw new TypeError(`Assertion.subject must be a TestSubject or string, got '${JSON.stringify(subject)}'`)
	}

	if (typeof subject.source === 'string') {
		return subject.source
	} else if (typeof subject.source === 'object') {
		const { source } = subject
		if (typeof source['@id'] === 'string' && source['@id'].substr(0, 2) !== '_:') {
			return source['@id']
		}
	}

	// TODO: should be temporary
	if (typeof subject['earl:source'] === 'string') {
		return subject['earl:source']
	}

	if (typeof subject['@id'] === 'string' && subject['@id'].substr(0, 2) !== '_:') {
		return subject['@id']
	}

	if (typeof subject.title === 'string') {
		return subject.title
	}

	// throw new Error(`Unable to find valid ruleId in '${JSON.stringify(subject)}'`)
}
