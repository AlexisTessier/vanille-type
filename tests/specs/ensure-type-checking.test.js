'use strict';

const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

test('Type and api', t => {
	const makeEnsureTypeCheckingFunction = requireFromIndex('sources/ensure-type-checking')

	t.is(typeof makeEnsureTypeCheckingFunction, 'function')
})

test('Usage from index', t => {
	const makeEnsureTypeCheckingFunctionFromIndex = requireFromIndex('ensure-type-checking')
	const makeEnsureTypeCheckingFunction = requireFromIndex('sources/ensure-type-checking')

	t.is(makeEnsureTypeCheckingFunctionFromIndex, makeEnsureTypeCheckingFunction)
})

test('Basic usage', t => {
	const ensureTypeChecking = requireFromIndex('sources/ensure-type-checking')()

	t.is(typeof ensureTypeChecking, 'function')
})

test.todo('Usage with custom unvalid lists map')
test.todo('Usage with default unvalid lists map')
test.todo('Usage with mixed custom and default unvalid lists map')