const getFramedReports = require('./get-framed-reports')

const getAssertions = async earlReports => {
	if (!earlReports || !earlReports.length) {
		return []
	}

	/**
	 * frame given earl reports to a frame configuration
	 */
	const framedReports = await getFramedReports(earlReports)

	/**
	 * Extrapolate `@graph` object from each report
	 */
	const result = framedReports.reduce((out, report) => {
		out.push(...report[`@graph`])
		return out
	}, [])

	return result
}

module.exports = getAssertions
