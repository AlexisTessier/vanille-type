'use strict';

const test = require('ava')

const requireFromIndex = require('../../utils/require-from-index')

test('Type', t => {
	const unvalidList = requireFromIndex('sources/validators/path-fragment.unvalid-list')

	t.true(unvalidList instanceof Array)
})

test('Usage from index', t => {
	const unvalidListFromIndex = requireFromIndex('path-fragment.unvalid-list')
	const unvalidList = requireFromIndex('sources/validators/path-fragment.unvalid-list')

	t.is(unvalidListFromIndex, unvalidList)
})