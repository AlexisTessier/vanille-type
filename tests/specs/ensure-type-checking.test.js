'use strict';

const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

test('Type and api', t => {
	const ensureTypeChecking = requireFromIndex('sources/ensure-type-checking')

	t.is(typeof ensureTypeChecking, 'function')
})

test('Usage from index', t => {
	const ensureTypeCheckingFromIndex = requireFromIndex('ensure-type-checking')
	const ensureTypeChecking = requireFromIndex('sources/ensure-type-checking')

	t.is(ensureTypeCheckingFromIndex, ensureTypeChecking)
})