const globby = jest.genMockFromModule('globby')

globby.sync = args => {
	if (!Array.isArray(args)) {
		return [args]
	}
	return args
}

module.exports = globby
