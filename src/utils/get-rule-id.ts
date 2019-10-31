import { EarlTestSubject } from '../earl/types'
import { sourceFromSubject } from './get-source'

export function ruleIdFromSubject(subject?: EarlTestSubject | string): string | void {
	const source = sourceFromSubject(subject)
	if (source === '3040ba5bd3485b7328c1cea8b5909982a10e4089') {
		console.log(subject)
	}
	if (source) {
		return ruleIdFromUri(source)
	}
}

export function ruleIdFromUri(url: string): string {
	const match = url.match(/\/([a-z0-9]{6})\/([a-z0-9]{40})\.[a-z]{3,4}/)
	if (!match) {
		throw new Error(`Unable to find rule ID in ${url}`)
	}
	return match[1]
}
