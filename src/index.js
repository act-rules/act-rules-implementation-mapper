const fs = require('fs')
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
	.option('-e, --earlReportPath <earlReportPath>', 'Path to EARL report')
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
async function init({
	actRulesPkg,
	org,
	tool,
	earlReportPath,
	testsJsonPath,
	dir
}) {
	/**
	 * assert `args`
	 */
	assert(actRulesPkg, '`actRulesPkg` is required')
	assert(org, '`org` is required')
	assert(tool, '`tool` is required')
	assert(earlReportPath, '`report` is required')
	assert(testsJsonPath, '`testsJsonPath` is required')
	assert(dir, '`dir` is required')

	console.info(`\nGet implementation of ${tool} by ${org}\n`)

	/**
	 * fetch `report` & `frame` as required
	 */
	const framedReport = await getFramedReport(earlReportPath)

	/**
	 * Get `implementation`
	 */
	const actRulesPkgJson = JSON.parse(fs.readFileSync(actRulesPkg, { encoding: 'utf-8' }))
	const { testcases } = JSON.parse(fs.readFileSync(testsJsonPath, { encoding: 'utf-8' }))
	const data = await getImplementationForReport(framedReport, testcases, actRulesPkgJson)

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

	await writeFile(`${dir}/${filename}.json`, JSON.stringify(report, null, 2))
}