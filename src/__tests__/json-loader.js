const fs = require('fs-extra')
const createFiles = require('../../test-utils/create-files')
const earlLoader = require('../json-loader')

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
		const earlLoader = require('../json-loader')
		let error
		try {
			await earlLoader()
		} catch (e) {
			error = e
		}
		expect(error).to
	})

	it('returns json data from a given url', async () => {
		const actual = await earlLoader(
			'https://raw.githubusercontent.com/act-rules/act-rules-implementation-alfa/master/report.json'
		)
		expect(actual).toBeArray()
	})

	it('returns json data from a single file path specified', async () => {
		const actual = await earlLoader(`${__dirname}/tmp/file1.json`)
		expect(actual).toEqual([{ organisation: 'Deque' }])
	})

	it('returns combined json data from multiple file paths specified', async () => {
		const actual = await earlLoader([`${__dirname}/tmp/file1.json`, `${__dirname}/tmp/file2.json`])
		expect(actual).toBeArrayOfSize(2)
		expect(actual).toEqual([{ organisation: 'Deque' }, { organisation: 'Siteimprove' }])
	})

	it('returns combined json data from all files in a glob specified', async () => {
		const actual = await earlLoader(`${__dirname}/tmp/*.json`)

		expect(actual).toBeArrayOfSize(2)
		expect(actual).toEqual([{ organisation: 'Deque' }, { organisation: 'Siteimprove' }])
	})

	// it('returns report when a multiple file paths are specified', async () => {
	// 	require('fs').__createMockFiles(mockFiles)
	// 	const earlLoader = require('../json-loader')
	// 	const actual = await earlLoader(['/dir/file1.json', '/dir/file2.json'])

	// 	expect(actual).toBeArray()
	// 	expect(actual).toBeArrayOfSize(2)
	// 	expect(actual[0]).toContainEntry(['organisation', 'Deque'])
	// 	expect(actual[1]).toContainEntry(['organisation', 'Siteimprove'])
	// })
})
