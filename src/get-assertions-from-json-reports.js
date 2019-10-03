const getFramedReports = require('./get-framed-reports')

const getAssertionsFromJsonReports = async jsonReports => {
	if (!jsonReports || !jsonReports.length) {
		return []
	}

	const framedReports = await getFramedReports(jsonReports)
	/**
	 * Extrapolate `@graph` object from each report
	 */
	return framedReports.reduce((out, report) => {
		out.push(...report[`@graph`])
		return out
	}, [])
}

module.exports = getAssertionsFromJsonReports
