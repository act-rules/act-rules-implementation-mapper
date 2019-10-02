const jsonld = require('jsonld')
const frameConfig = require('./config/json-ld-frame.json')

/**
 * Frame all given earl reports to
 * @param {Object[]} reports jsonld/earl implementation reports
 * @returns {Object}
 */
const getFramedReports = async reports => {
	const result = []
	for (let report of reports) {
		const framedReport = await jsonld.frame(report, frameConfig)
		result.push(framedReport)
	}
	return result
}

module.exports = getFramedReport
