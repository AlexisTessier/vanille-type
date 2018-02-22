'use strict';

const test = require('ava')

const requireFromIndex = require('../utils/require-from-index')

test('Type', t => {
	const map = requireFromIndex('sources/types-validators-map')

	t.true(map instanceof WeakMap)
})