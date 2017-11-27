'use strict';

const test = require('ava');
const sinon = require('sinon');

const msg = require('@alexistessier/msg');

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
	t.is(Any.name, 'Type');

	const value = {valueKey:'value value'};
	const typedValue = Any(value);

	t.true(validator.calledOnce);
	t.true(validator.withArgs(value).calledOnce);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('Create type function from one validator function returns false', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => false);
	const Nothing = type(validator);

	t.true(validator.notCalled);
	t.is(typeof Nothing, 'function');
	t.is(Nothing.name, 'Type');

	const value = {valueKey2:'value value 2'};

	const unvalidTypeError = t.throws(() => {
		const typedValue = Nothing(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, msg(
		`Value {"valueKey2":"value value 2"} is not of a valid type.`,
		`It doesn't match the validator spy.`
	));

	t.true(validator.calledOnce);
	t.true(validator.withArgs(value).calledOnce);
});

test('Create type function from one validator function returns false - without spy', t => {
	const type = requireFromIndex('sources/type');

	const validator = v => false;
	const Nothing = type(validator);

	t.is(typeof Nothing, 'function');
	t.is(Nothing.name, 'Type');

	const value = {valueKey3:'value value 3'};

	const unvalidTypeError = t.throws(() => {
		Nothing(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, msg(
		`Value {"valueKey3":"value value 3"} is not of a valid type.`,
		`It doesn't match the validator v => false.`
	));
});

test('Create type function from one validator function returns anything else than a boolean', t => {
	const type = requireFromIndex('sources/type');

	const validator = v => 'truthy value';
	const UnvalidType = type(validator);

	t.is(typeof UnvalidType, 'function');
	t.is(UnvalidType.name, 'Type');
	
	const unvalidTypeError = t.throws(() => {
		UnvalidType(true);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, msg(
		`Unvalid type validator. The validator v => 'truthy value'`,
		`doesn't return a boolean value. It returns (string => truthy value).`
	));
});

test('Create type function from one validator function throwing an error', t => {
	const type = requireFromIndex('sources/type');

	const validator = v => {throw new Error('validator error')};
	const Nothing = type(validator);

	t.is(typeof Nothing, 'function');
	t.is(Nothing.name, 'Type');

	const value = {valueKey3:'value value 3'};

	const unvalidTypeError = t.throws(() => {
		Nothing(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, msg(
		`Value {"valueKey3":"value value 3"} is not of a valid type.`,
		`It doesn't match the validator ${validator}.`
	)+`\n\tvalidator error`);
});

test.todo('Create type function from one validator function throwing an error and returning a no boolean value');

test.todo('Create type from many validators');
test.todo('Create named type using string and one validator');
test.todo('Create named type using string and many validators');
test.todo('Create named type using proxy method with pascalCase and one validator');
test.todo('Create named type using proxy method with pascalCase and many validators');

test.todo('built-in type.strict modifier');

test.todo('built-in type Type');
test.todo('built-in type Any');
test.todo('built-in type Nothing');
test.todo('built-in type Truthy');
test.todo('built-in type Falsy');
test.todo('built-in type Null');
test.todo('built-in type Undefined');
test.todo('built-in type Boolean');
test.todo('built-in type True');
test.todo('built-in type False');
test.todo('built-in type String');
test.todo('built-in type EmptyString');
test.todo('built-in type BlankString');
test.todo('built-in type TypeNumber');
test.todo('built-in type NaN');
test.todo('built-in type Infinity');
test.todo('built-in type PositiveInfinity');
test.todo('built-in type NegativeInfinity');
test.todo('built-in type Number');
test.todo('built-in type Zero');
test.todo('built-in type PositiveNumber');
test.todo('built-in type NegativeNumber');
test.todo('built-in type Function');
test.todo('built-in type Symbol');
test.todo('built-in type TypeObject');
test.todo('built-in type Object');
test.todo('built-in type InstanceOf');
test.todo('built-in type Equal');
test.todo('built-in type DeepEqual');
test.todo('built-in type Is');
test.todo('built-in type DeepIs');
test.todo('built-in type Identity');
test.todo('built-in type DeepIdentity');
test.todo('built-in type Enum');
test.todo('built-in type Struct');
test.todo('built-in type Interface');
test.todo('built-in type should work with any contructor...');
test.todo('built-in type Array');
test.todo('built-in type EmptyArray');
test.todo('built-in type BlankArray');
test.todo('built-in type ArrayOf');
test.todo('built-in type Tuple');
test.todo('built-in type RegExp');
test.todo('built-in type Promise');
test.todo('built-in type Set');
test.todo('built-in type Map');
test.todo('built-in type WeakSet');
test.todo('built-in type WeakMap');
test.todo('built-in type Error');
test.todo('built-in type Maybe');


test.todo('Trying to create named type using proxy method without pascalCase');
test.todo('Trying to create type without parameters should throw an error');
test.todo('Trying to create type with wrong parameters should throw an error');