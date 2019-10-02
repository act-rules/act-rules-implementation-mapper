const fs = require('fs-extra')
const createFiles = require('../../test-utils/create-files')
const jsonLoader = require('../json-loader')

/**
 * temporary files created and cleaned up for tests
 */
const testFiles = {
	[`${__dirname}/tmp/file1.json`]: { organisation: 'Deque' },
	[`${__dirname}/tmp/file2.json`]: { organisation: 'Siteimprove' },
}

describe(`jsonLoader`, () => {
	beforeAll(async done => {
		await createFiles(testFiles)
		done()
	})

	afterAll(async () => {
		await fs.remove(`${__dirname}/tmp`)
	})

	it(`throws when no argument is specified`, async () => {
		const jsonLoader = require('../json-loader')
		let error
		try {
			await jsonLoader()
		} catch (e) {
			error = e
		}
		expect(error).to
	})

	it('returns json data from a given url', async () => {
		const actual = await jsonLoader(
			'https://raw.githubusercontent.com/act-rules/act-rules-implementation-alfa/master/report.json'
		)
		expect(actual).toBeArray()
	})

	it('returns json data from a single file path specified', async () => {
		const actual = await jsonLoader(`${__dirname}/tmp/file1.json`)
		expect(actual).toEqual([{ organisation: 'Deque' }])
	})

	it('returns combined json data from multiple file paths specified', async () => {
		const actual = await jsonLoader([`${__dirname}/tmp/file1.json`, `${__dirname}/tmp/file2.json`])
		expect(actual).toBeArrayOfSize(2)
		expect(actual).toEqual([{ organisation: 'Deque' }, { organisation: 'Siteimprove' }])
	})

	it('returns combined json data from all files in a glob specified', async () => {
		const actual = await jsonLoader(`${__dirname}/tmp/*.json`)

		expect(actual).toBeArrayOfSize(2)
		expect(actual).toEqual([{ organisation: 'Deque' }, { organisation: 'Siteimprove' }])
	})
})
