'use strict';

const test = require('ava')

const requireFromIndex = require('../../utils/require-from-index')

test('Type', t => {
	const validList = requireFromIndex('sources/validators/path-fragment.valid-list')

	t.true(validList instanceof Array)
})

test('Usage from index', t => {
	const validListFromIndex = requireFromIndex('path-fragment.valid-list')
	const validList = requireFromIndex('sources/validators/path-fragment.valid-list')

	t.is(validListFromIndex, validList)
})