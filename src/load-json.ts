import request from 'request-promise'
import globby from 'globby'
import debug from 'debug'
import { promisify } from 'util'
import fs from 'fs'

const readFile = promisify(fs.readFile)

export async function loadJson(filePath: string): Promise<object[]> {
  if (/^https?:\/\//.test(filePath)) {
    debug('load:request')(`fetching ${filePath}`)
    const data = await request({ uri: filePath, json: true })
    return [data]
  } else {
    const filePaths = await globby(filePath)
    const sources: string[] = await Promise.all(
      filePaths.map((filePath: string) => {
        debug('load:readFile')(`Loading ${filePath}`)
        return readFile(filePath, 'utf8')
      })
    )
    return sources.map(source => JSON.parse(source))
  }
}
