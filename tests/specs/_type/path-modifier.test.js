'use strict';

const test = require('ava');
const sinon = require('sinon');
const clone = require('clone');

const requireFromIndex = require('../../utils/require-from-index');

test('type path modifier - from a Type - type and api', t => {
	const type = requireFromIndex('sources/type');

	const TypeFunction = type(v => true);

	t.is(typeof TypeFunction.path, 'function');
});

test('type path modifier - from type function - type and api', t => {
	const type = requireFromIndex('sources/type');

	t.is(typeof type.path, 'function');
});

/*---------------*/

test('type path modifier - from a Type - validator returns true - usage with simple key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);

	const BaseType = type(validator);

	t.is(typeof BaseType, 'function');
	t.is(BaseType.name, 'Type');

	const Type = BaseType.path('OKey');

	t.is(typeof Type, 'function');
	t.is(Type.name, 'Type');

	const OKey = { test: 't', keykey: 'key val' };
	const value = {
		OKey, otherKey: { other: 'key' }
	};
	const expectedTypedValue = clone(value);

	t.true(validator.notCalled);

	const typedValue = Type(value);
	t.is(typedValue, value);
	t.deepEqual(typedValue, expectedTypedValue);

	t.true(validator.calledOnce);
	t.true(validator.withArgs(OKey).calledOnce);
});

test('type path modifier - from type function - validator returns true - usage with simple key', t => {
	const type = requireFromIndex('sources/type');

	const typeOfPath = type.path('aKey');

	t.is(typeof typeOfPath, 'function');

	const validator = sinon.spy(v => true);

	const Type = typeOfPath(validator);

	t.is(typeof Type, 'function');
	t.is(Type.name, 'Type');

	const aKey = { key: 'name', test: 'test' };
	const value = Object.freeze({
		aKey, bKey: { other: 'key' }
	});
	const expectedTypedValue = clone(value);

	t.true(validator.notCalled);

	const typedValue = Type(value);
	t.is(typedValue, value);
	t.deepEqual(typedValue, expectedTypedValue);

	t.true(validator.calledOnce);
	t.true(validator.withArgs(aKey).calledOnce);
});

/*---------------*/

test('type path modifier - from a Type - validator returns true - usage with 2 fragment path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);

	const BaseType = type(validator);

	t.is(typeof BaseType, 'function');
	t.is(BaseType.name, 'Type');

	const Type = BaseType.path('AK', 'nestKey');

	t.is(typeof Type, 'function');
	t.is(Type.name, 'Type');

	const nestKey = { test: 42 };
	const AK = { test: 't', nestKey };
	const value = Object.freeze({
		AK, t: { other: 'key' }
	});
	const expectedTypedValue = clone(value);

	t.true(validator.notCalled);

	const typedValue = Type(value);
	t.is(typedValue, value);
	t.deepEqual(typedValue, expectedTypedValue);

	t.true(validator.calledOnce);
	t.true(validator.withArgs(nestKey).calledOnce);
});

/*---------------*/

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

test.todo('ensure path is not modified');
test.todo('many types variants');
test.todo('many validators variants');
test.todo('unvalid path arguments');

/*----------------------------------*/



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