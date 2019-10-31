#!/usr/bin/env node
import { cliProgram, CliArgs } from './cli-program'
import yargs from 'yargs'

// @ts-ignore
const { argv }: { argv: CliArgs } = yargs
	.usage('Usage: $0 --jsonReports ./reports/**.json [options]')
	.option('jsonReports', {
		alias: 'j',
		describe: 'Implementation report',
		demand: true,
		array: true,
	})
	.option('testcases', {
		alias: 't',
		describe: 'ACT Rules testcases',
		default: 'https://act-rules.github.io/testcases.json',
	})
	.option('output', {
		alias: 'o',
		describe: 'Output directory for mapped results',
		default: './{tool}-mapping.json',
	})
	.option('organisation', {
		alias: 'O',
		describe: 'Organisation, submitting the implementation report',
	})
	.option('toolName', {
		alias: 'T',
		describe: 'Tool which was used to generate the implementation report',
		default: 'unknown',
	})
	.option('toolVersion', {
		alias: 'V',
		describe: 'Version of the tool',
	})
	.help()
	.version()

cliProgram(argv, console.log.bind(console)).catch((e: Error) => {
	console.error(e)
	process.exit(1)
})
