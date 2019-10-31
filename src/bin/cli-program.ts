import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { actMapper, TestCaseJson, ToolMetadata } from '../act-map-generator'
import { flatMap } from '../utils/flat-map'
import { loadJson } from '../load-json'

const writeFile = promisify(fs.writeFile)

export type CliArgs = ToolMetadata & {
	jsonReports: string[]
	testcases: string
	output: string
}
type Log = (...str: any[]) => void

export async function cliProgram(
	{ organisation, toolName, jsonReports, testcases, output, toolVersion }: CliArgs,
	log: Log
) {
	output = output.replace('{organisation}', organisation || '{organisation}').replace('{tool}', toolName || '{tool}')
	const outputPath = path.resolve(process.cwd(), output)
	const meta = { organisation, toolName, toolVersion }

	// Load all the JSON files
	const jsonldFiles = flatMap(await Promise.all(jsonReports.map(loadJson)))
	const testcaseFile = <TestCaseJson>await loadJson(testcases)

	log('Loading files')
	const implementationMapping = await actMapper(jsonldFiles, testcaseFile, meta)
	const fileContent = JSON.stringify(implementationMapping, null, 2)

	// Save the report
	log(`Saved report to ${outputPath}`)
	await writeFile(outputPath, fileContent)
}
