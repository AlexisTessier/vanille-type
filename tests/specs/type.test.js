'use strict';

const test = require('ava');
const sinon = require('sinon');

const requireFromIndex = require('../utils/require-from-index');

test('Type and API', t => {
	const type = requireFromIndex('sources/type');
	const typeFromIndex = requireFromIndex('index');

	t.is(typeof type, 'function');
	t.is(typeFromIndex, type);
});

test('Create type function from one validator function returns true', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
	const Any = type(validator);

	t.true(validator.notCalled);
	t.is(typeof Any, 'function');

	const value = {valueKey:'value value'};
	const typedValue = Any(value);

	t.true(validator.calledOnce);
	t.true(validator.withArgs(value).calledOnce);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test.todo('Create type function from one validator function returns false');
test.todo('Create type function from one validator function returns anything else than true');
test.todo('Create type function from one validator function throws an error');

test.todo('Trying to create type without parameters should throw an error');
test.todo('Trying to create type with wrong parameters should throw an error');