'use strict';

const test = require('ava');
const sinon = require('sinon');

const requireFromIndex = require('../../utils/require-from-index');

test('type path modifier - type and api', t => {
	const type = requireFromIndex('sources/type');

	t.is(typeof type.path, 'function');
});

test('type path modifier - from type - validator returns true - usage with simple key', t => {
	const type = requireFromIndex('sources/type');

	const typeOfPath = type.path('aKey');

	t.is(typeof typeOfPath, 'function');

	const validator = sinon.spy(v => true);

	const Type = typeOfPath(validator);

	t.is(typeof Type, 'function');
	t.is(Type.name, 'Type');

	const aKey = { key: 'name', test: 'test' };
	const value = {
		aKey, bKey: { other: 'key' }
	};

	t.true(validator.notCalled);

	const typedValue = Type(value);
	t.is(typedValue, value);
	t.deepEqual(typedValue, value);

	t.true(validator.calledOnce);
	t.true(validator.withArgs(aKey).calledOnce);
});

test.skip('type path modifier - from type - validator returns true - usage with 2 fragment path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns true - usage with deep path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns true - usage with unvalid path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns true - usage with empty path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns true - usage with blank path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns true - usage with simple key - undefined key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns true - usage with 2 fragment path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns true - usage with deep path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

/*----*/

test.skip('type path modifier - from type - validator returns false - usage with simple key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns false - usage with 2 fragments path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns false - usage with deep path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns false - usage with unvalid path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns false - usage with empty path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns false - usage with blank path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns false - usage with simple key - undefined key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns false - usage with 2 fragment path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator returns false - usage with deep path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

/*----*/

test.skip('type path modifier - from type - validator throws error - usage with simple key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator throws error - usage with unvalid path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator throws error - usage with empty path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator throws error - usage with blank path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator throws error - usage with 2 fragment path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator throws error - usage with deep path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator throws error - usage with simple key - undefined key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator throws error - usage with 2 fragment path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type - validator throws error - usage with deep path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.todo('many types variants');
test.todo('many validators variants');
test.todo('unvalid path arguments');

/*----------------------------------*/

test.skip('type path modifier - from type function - type and api', t => {
	const type = requireFromIndex('sources/type');

	const TypeFunction = type(v => true);

	t.is(typeof TypeFunction.path, 'function');
});

test.skip('type path modifier - from type function - validator returns true - usage with simple key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns true - usage with unvalid path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns true - usage with empty path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns true - usage with blank path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns true - usage with 2 fragment path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns true - usage with deep path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns true - usage with simple key - undefined key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns true - usage with 2 fragment path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns true - usage with deep path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with simple key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with unvalid path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with empty path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with blank path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with 2 fragment path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with deep path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with simple key - undefined key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with 2 fragment path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator returns false - usage with deep path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with simple key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with unvalid path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with empty path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with blank path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with 2 fragment path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with deep path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with simple key - undefined key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with 2 fragment path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.skip('type path modifier - from type function - validator throws error - usage with deep path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});

test.todo('many types variants');
test.todo('many validators variants');
test.todo('unvalid path arguments');