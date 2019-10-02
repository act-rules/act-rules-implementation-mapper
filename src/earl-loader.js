const fs = require('fs')
const globby = require('globby')

/**
 * Load jsonld/earl report(s)
 * - if there are multiple reports, this function concatanates them into one report
 *
 * @method earlLoader
 * @param {String|String[]} pathOrGlob file path to jsonld/earl report
 * @returns {Object[]}
 */
const earlLoader = async pathOrGlob => {
	if (!pathOrGlob) {
		throw new Error(`argument is missing`)
	}

	const reports = globby.sync(pathOrGlob).map(reportPath => {
		const fileContent = fs.readFileSync(reportPath, { encoding: 'utf-8' })
		return JSON.parse(fileContent)
	})

	return reports
}

module.exports = earlLoader
