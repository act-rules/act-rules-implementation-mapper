#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const program = require('commander')
const mkdirp = require('mkdirp-promise')
const writeFile = require('fs-writefile-promise')

const actMapGenerator = require('../src/act-map-generator')
const jsonLoader = require('../src/json-loader')

/**
 * Parse `args`
 */
program
	.option('-O, --organisation <organisation>', 'Organisation, submitting the implementation report')
	.option('-t, --tool <tool>', 'Tool which was used to generate the implementation report')
	.option('-j, --jsonReports <jsonReports>', 'Implementation report')
	.option('-t, --testcases <testcases>', 'ACT Rules testcases')
	.option('-o, --output <output>', 'Output directory for mapped results')
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
async function init({ organisation, tool, jsonReports, testcases: actTestcases, output }) {
	/**
	 * assert `args`
	 */
	assert(organisation, '`organisation` is required')
	assert(tool, '`tool` is required')
	assert(jsonReports, '`jsonReports` is required')
	assert(actTestcases, '`testcases` is required')
	assert(output, '`output` is required')

	/**
	 * ACT testcases
	 */
	const { testcases } = JSON.parse(fs.readFileSync(actTestcases, { encoding: 'utf-8' }))
	// const { testcases } = require(actTestcases)

	/**
	 * Load reports
	 */
	const reports = await jsonLoader(`./node_modules/act-rules-implementation-alfa/report.json`)

	try {
		const result = await actMapGenerator(reports, testcases, { organisation, tool })

		/**
		 * Save result
		 */
		if (output) {
			const dir = path.dirname(output)
			await mkdirp(dir)
			await writeFile(output, JSON.stringify(result, undefined, 2))
		}
	} catch (error) {
		console.error(error)
	}
}
