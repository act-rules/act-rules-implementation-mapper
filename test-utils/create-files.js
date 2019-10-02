const path = require('path')
const mkdirp = require('mkdirp-promise')
const writeFile = require('fs-writefile-promise')

/**
 * Create file and content
 * @param {Object} files key-value pair of files and content to be created
 */
async function createFiles(files) {
	for (const [filePath, fileContent] of Object.entries(files)) {
		const dir = path.dirname(filePath)
		await mkdirp(dir)
		await writeFile(filePath, JSON.stringify(fileContent))
	}
}

module.exports = createFiles
