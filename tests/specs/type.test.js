'use strict';

const test = require('ava');
const sinon = require('sinon');

const msg = require('@alexistessier/msg');
const stringable = require('stringable');

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
		`Value (object => { valueKey2: (string => 'value value 2') }) is not of a valid type.`,
		`It doesn't match the validator (function => proxy)[spy].`
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

	const value = {valueKey3:'value value 3', multiKey: 42};

	const unvalidTypeError = t.throws(() => {
		Nothing(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, msg(
		`Value (object => {\n  valueKey3: (string => 'value value 3'),\n  multiKey: (number: integer => 42)\n}) is not of a valid type.`,
		`It doesn't match the validator (function => validator)[v => false].`
	));
});

function validatorReturningNotABooleanMacro(t, notBoolean) {
	const type = requireFromIndex('sources/type');

	const validator = v => notBoolean;
	const UnvalidType = type(validator);

	t.is(typeof UnvalidType, 'function');
	t.is(UnvalidType.name, 'Type');

	const unvalidTypeError = t.throws(() => {
		UnvalidType(true);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, msg(
		`Unvalid type validator. The validator (function => validator)[v => notBoolean]`,
		`doesn't return a boolean value. It returns ${stringable(notBoolean)}.`
	));
}

validatorReturningNotABooleanMacro.title = (providedTitle, notBoolean) => (
	`Create type function from one validator function returns anything else than a boolean - (${typeof notBoolean}) - ${providedTitle}`
)

test(validatorReturningNotABooleanMacro, 'truthy value');
test('truthy number', validatorReturningNotABooleanMacro, 1);
test('falsy number', validatorReturningNotABooleanMacro, 1);
test(validatorReturningNotABooleanMacro, 42);
test('float', validatorReturningNotABooleanMacro, 32.8);
test('empty array', validatorReturningNotABooleanMacro, []);
test(validatorReturningNotABooleanMacro, ['vale', 5]);
test(validatorReturningNotABooleanMacro, v => v);
test(validatorReturningNotABooleanMacro, {key: 'val'});
test('empty object', validatorReturningNotABooleanMacro, {});
test(validatorReturningNotABooleanMacro, /reg/);
test(validatorReturningNotABooleanMacro, Symbol());
test(validatorReturningNotABooleanMacro, null);
test(validatorReturningNotABooleanMacro, undefined);
test(validatorReturningNotABooleanMacro);
test(validatorReturningNotABooleanMacro, Symbol());
test(validatorReturningNotABooleanMacro, new Boolean(true));
test(validatorReturningNotABooleanMacro, new Boolean(false));
test(validatorReturningNotABooleanMacro, new Boolean());
test(validatorReturningNotABooleanMacro, Symbol());
test(validatorReturningNotABooleanMacro, new Error());
test(validatorReturningNotABooleanMacro, new Error('test'));
test(validatorReturningNotABooleanMacro, new TypeError('test type error'));

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
		`Value (object => { valueKey3: (string => 'value value 3') }) is not of a valid type.`,
		`It doesn't match the validator (function => validator)[${validator}].\n\tvalidator error`
	));
});

test('Create type function from one validator function throwing an error and returning a no boolean value', t => {
	const type = requireFromIndex('sources/type');

	const validator = v => {
		throw new Error('first validator error');
		return 'test'
	}
	const Errored = type(validator);

	t.is(typeof Errored, 'function');
	t.is(Errored.name, 'Type');

	const value = 'whatever';

	const ErroredTypeError = t.throws(() => {
		Errored(value);
	});

	t.true(ErroredTypeError instanceof TypeError);
	t.is(ErroredTypeError.message, msg(
		`Value ${stringable(value)} is not of a valid type.`,
		`It doesn't match the validator (function => validator)[${validator}].\n\tfirst validator error`
	));
});

test.todo('Create type from many validators');
test.todo('Create named type using string and one validator');
test.todo('Create named type using string and many validators');
test.todo('Create named type using proxy method with pascalCase and one validator');
test.todo('Create named type using proxy method with pascalCase and many validators');

test.todo('Create validator from type using type.validator function');
test.todo('Create validator from type using type.is function');
test.todo('built-in type.not function');
test.todo('built-in type.not modifier');
test.todo('built-in type.strict modifier');

test.todo('built-in helper ofType');
test.todo('built-in helper kindOf');
test.todo('built-in helper instanceOf');
test.todo('built-in helper equal');
test.todo('built-in helper strictEqual');
test.todo('built-in helper deepEqual');
test.todo('built-in helper deepStrictEqual');
test.todo('built-in helper is');
test.todo('built-in helper deepIs');
test.todo('built-in helper identity');
test.todo('built-in helper deepIdentity');
test.todo('built-in helper enum');
test.todo('built-in helper interface');
test.todo('built-in helper arrayOf');
test.todo('built-in helper tuple');
test.todo('built-in helper error');
test.todo('built-in helper maybe');

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
test.todo('built-in type Number');
test.todo('built-in type Integer');
test.todo('built-in type Float');
test.todo('built-in type Zero');
test.todo('built-in type PositiveNumber');
test.todo('built-in type NegativeNumber');
test.todo('built-in type Infinity');
test.todo('built-in type PositiveInfinity');
test.todo('built-in type NegativeInfinity');
test.todo('built-in type Function');
test.todo('built-in type Symbol');
test.todo('built-in type TypeObject');
test.todo('built-in type Object');
test.todo('built-in type Array');
test.todo('built-in type EmptyArray');
test.todo('built-in type BlankArray');
test.todo('built-in type RegExp');
test.todo('built-in type Promise');
test.todo('built-in type Set');
test.todo('built-in type Map');
test.todo('built-in type WeakSet');
test.todo('built-in type WeakMap');
test.todo('built-in type Error');
test.todo('built-in type TypeError');

test.todo('built-in type should work with any error type');
test.todo('built-in type should work with any contructor...');

test.todo('built-in type Not variants');

test.todo('Trying to create named type using proxy method without pascalCase');
test.todo('Trying to create type without parameters should throw an error');
test.todo('Trying to create type with wrong parameters should throw an error');