const mockFiles = {
	'/dir/file1.json': '{ "organisation": "Deque" }',
	'/dir/file2.json': '{ "organisation": "Siteimprove" }',
}

describe(`earlLoader`, () => {
	jest.mock('fs')

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
	})

	it(`throws when NO argument is specified`, async () => {
		const earlLoader = require('../earl-loader')
		let error
		try {
			await earlLoader()
		} catch (e) {
			error = e
		}
		expect(error).toEqual(new Error('argument is missing'))
	})

	it('returns report when a single file path is specified', async () => {
		require('fs').__createMockFiles(mockFiles)
		const earlLoader = require('../earl-loader')
		const actual = await earlLoader('/dir/file1.json')

		expect(actual).toBeArray()
		expect(actual).toBeArrayOfSize(1)
		expect(actual[0]).toContainEntry(['organisation', 'Deque'])
	})

	it('returns report when a multiple file paths are specified', async () => {
		require('fs').__createMockFiles(mockFiles)
		const earlLoader = require('../earl-loader')
		const actual = await earlLoader(['/dir/file1.json', '/dir/file2.json'])

		expect(actual).toBeArray()
		expect(actual).toBeArrayOfSize(2)
		expect(actual[0]).toContainEntry(['organisation', 'Deque'])
		expect(actual[1]).toContainEntry(['organisation', 'Siteimprove'])
	})
})
