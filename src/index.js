const assert = require('assert')
const program = require('commander')
const writeFile = require('fs-writefile-promise')
const getFramedReport = require('./get-framed-report')
const getImplementationForReport = require('./get-implementation-for-report')

/**
 * Parse `args`
 */
program
	.option('-p, --actRulesPkg <actRulesPkg>', 'Root Directory of ACT Rules Repo')
	.option('-o, --org <org>', 'Organisation, which created the EARL report')
	.option('-t, --tool <tool>', 'Tool used by EARL report')
	.option('-r, --report <report>', 'Path to EARL report')
	.option('-t, --testsJsonPath <testsJsonPath>', 'Path to JSON file containing all ACT Rules testcases')
	.option('-d, --dir <dir>', 'Output directory of generated implementation report')
	.parse(process.argv)

/**
* Invoke
*/
init(program)
	.catch(e => {
		console.error(e)
		process.write(1)
	})
	.finally(() => console.info('Completed'))

/**
 * Init
 * @param {Object} program program
 */
async function init({ org, tool, path, testsJsonPath, dir: outputDir }) {
	/**
	 * assert `args`
	 */
	assert(org, '`Organisation` is required')
	assert(tool, '`tool` is required')
	assert(path, '`path` is required')

	console.info(`\nGet implementation of ${tool} by ${org}\n`)

	/**
	 * fetch `report` & `frame` as required
	 */
	const framedReport = await getFramedReport(path)

	/**
	 * Get `implementation`
	 */
	const testcases = fs.readFileSync(testsJsonPath, { encoding: 'utf-8' })
	const data = await getImplementationForReport(framedReport, testcases)

	/**
	 * create report
	 */
	const report = {
		organisation: org,
		tool,
		data,
	}

	/**
	 * Save `implementation` to `_data/implementations`
	 */
	const filename = tool
		.split(' ')
		.join('-')
		.toLowerCase()

	await writeFile(`_data/implementations/${filename}.json`, JSON.stringify(report, null, 2))
}