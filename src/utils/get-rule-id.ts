import { EarlTestSubject } from '../earl/types'
import { sourceFromSubject } from './get-source'
import debug from 'debug'

export function ruleIdFromSubject(subject: EarlTestSubject | string): string | void {
  const source = sourceFromSubject(subject)
  if (source) {
    return ruleIdFromUri(source)
  }
}

export function ruleIdFromUri(url: string): string | undefined {
  const match = url.match(/\/([a-z0-9]{6})\/([a-z0-9]{40})\.[a-z]{2,4}/)
  if (!match) {
    debug('ruleIdFromUri')(`Unable to find rule ID in ${url}`)
    return undefined
  }
  return match[1]
}
