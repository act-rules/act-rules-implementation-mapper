const getFramedReports = require('./get-framed-reports')

const getAssertions = async jsonReports => {
	if (!jsonReports || !jsonReports.length) {
		return []
	}

	/**
	 * frame given earl reports to a frame configuration
	 */
	const framedReports = await getFramedReports(jsonReports)

	/**
	 * Extrapolate `@graph` object from each report
	 */
	return framedReports.reduce((out, report) => {
		out.push(...report[`@graph`])
		return out
	}, [])
}

module.exports = getAssertions
