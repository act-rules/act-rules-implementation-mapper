const fs = jest.genMockFromModule('fs')
const path = require('path')

let mockFiles = Object.create(null)

/**
 * Helper fn to mock files in filesystem
 * @param {Object} newMockFiles mock files
 * @returns {Object}
 */
function __createMockFiles(newMockFiles) {
	mockFiles = Object.create(null)
	for (const file in newMockFiles) {
		const dir = path.dirname(file)
		if (!mockFiles[dir]) {
			mockFiles[dir] = []
		}
		mockFiles[dir][path.basename(file)] = newMockFiles[file]
	}
}

/**
 * Override fn of `fs.readFileSync`
 */
function readFileSync(filePath, options) {
	const dir = path.dirname(filePath)
	const filename = path.basename(filePath)
	return mockFiles[dir][filename]
}

fs.readFileSync = readFileSync
fs.__createMockFiles = __createMockFiles

module.exports = fs
