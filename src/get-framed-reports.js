const jsonld = require('jsonld')
const frameConfig = require('./config/json-ld-frame.json')

/**
 * Frame all given earl reports to agiven frame context
 * - see `config/json-ld-frame.json` for context
 *
 * @param {Object[]} reports jsonld/earl implementation reports
 * @returns {Object}
 */
async function getFramedReports(reports) {
	const result = []

	if (!reports || !reports.length) {
		return result
	}

	for (let report of reports) {
		const framedReport = await jsonld.frame(report, frameConfig)
		result.push(framedReport)
	}
	return result
}

module.exports = getFramedReports
