'use strict';

const test = require('ava');
const sinon = require('sinon');

const msg = require('@alexistessier/msg');
const stringable = require('stringable');

const requireFromIndex = require('../utils/require-from-index');

const logs = requireFromIndex('sources/settings/logs');

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

	const value = {
		key: 'value',
		otherKey: {
			deep: {
				deep: {
					deepKey: 'deep value'
				}
			}
		}
	};
	const typedValue = Any(value);

	t.true(validator.calledOnce);
	t.true(validator.withArgs(value).calledOnce);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('Create type from many validators - both returning true', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => true);

	const EnsureAny = type(validator1, validator2);
	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.is(typeof EnsureAny, 'function');
	t.is(EnsureAny.name, 'Type');

	const value = {
		key: 'value',
		otherKey: {
			deep: {
				deep: {
					deepKey: 'deep value'
				}
			}
		}
	};
	const typedValue = EnsureAny(value);

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator2.calledAfter(validator1));

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
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator})
	].join(''));

	t.true(validator.calledOnce);
	t.true(validator.withArgs(value).calledOnce);
});

test('Create type from many validators - both returning false', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => false);
	const validator2 = sinon.spy(v => false);
	const EnsureNothing = type(validator1, validator2);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.is(typeof EnsureNothing, 'function');
	t.is(EnsureNothing.name, 'Type');

	const value = {valueKey2:'value value 2'};

	const unvalidTypeError = t.throws(() => {
		const typedValue = EnsureNothing(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator1}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator2})
	].join(''));

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator2.calledAfter(validator1));
});

test('Create type from many validators - first returning true and second returning false', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => false);
	const Nothing2 = type(validator1, validator2);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.is(typeof Nothing2, 'function');
	t.is(Nothing2.name, 'Type');

	const value = {valueKey:'value value'};

	const unvalidTypeError = t.throws(() => {
		const typedValue = Nothing2(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator2})
	].join(''));

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator2.calledAfter(validator1));
});

test('Create type from many validators - first returning false and second returning true', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => false);
	const validator2 = sinon.spy(v => true);
	const Nothing1 = type(validator1, validator2);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.is(typeof Nothing1, 'function');
	t.is(Nothing1.name, 'Type');

	const value = {valueKey:'value value'};

	const unvalidTypeError = t.throws(() => {
		const typedValue = Nothing1(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator2})
	].join(''));

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator2.calledAfter(validator1));
});

test('Create type from many validators - lot of validators - false at first', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => false);
	const validator2 = sinon.spy(v => true);
	const validator3 = sinon.spy(v => true);
	const validator4 = sinon.spy(v => false);
	const validator5 = sinon.spy(v => true);
	const Nothing5 = type(validator1, validator2, validator3, validator4, validator5);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);
	t.is(typeof Nothing5, 'function');
	t.is(Nothing5.name, 'Type');

	const value = {valueKey:'value value'};

	const unvalidTypeError = t.throws(() => {
		const typedValue = Nothing5(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator1}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator4})
	].join(''));

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator2.calledAfter(validator1));
	t.true(validator3.calledOnce);
	t.true(validator3.withArgs(value).calledOnce);
	t.true(validator3.calledAfter(validator2));
	t.true(validator4.calledOnce);
	t.true(validator4.withArgs(value).calledOnce);
	t.true(validator4.calledAfter(validator3));
	t.true(validator5.calledOnce);
	t.true(validator5.withArgs(value).calledOnce);
	t.true(validator5.calledAfter(validator4));
});

test('Create type from many validators - lot of validators - false in middle', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => false);
	const validator3 = sinon.spy(v => false);
	const validator4 = sinon.spy(v => false);
	const validator5 = sinon.spy(v => true);
	const Nothing5 = type(validator1, validator2, validator3, validator4, validator5);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);
	t.is(typeof Nothing5, 'function');
	t.is(Nothing5.name, 'Type');

	const value = {valueKey:'value value'};

	const unvalidTypeError = t.throws(() => {
		const typedValue = Nothing5(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator2}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator3}),
		`\n\t2) `, logs.typeErrorDetail({validator: validator4})
	].join(''));

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator2.calledAfter(validator1));
	t.true(validator3.calledOnce);
	t.true(validator3.withArgs(value).calledOnce);
	t.true(validator3.calledAfter(validator2));
	t.true(validator4.calledOnce);
	t.true(validator4.withArgs(value).calledOnce);
	t.true(validator4.calledAfter(validator3));
	t.true(validator5.calledOnce);
	t.true(validator5.withArgs(value).calledOnce);
	t.true(validator5.calledAfter(validator4));
});

test('Create type from many validators - lot of validators - false at last', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => true);
	const validator3 = sinon.spy(v => true);
	const validator4 = sinon.spy(v => false);
	const validator5 = sinon.spy(v => false);
	const Nothing5 = type(validator1, validator2, validator3, validator4, validator5);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);
	t.is(typeof Nothing5, 'function');
	t.is(Nothing5.name, 'Type');

	const value = {valueKey:'value value'};

	const unvalidTypeError = t.throws(() => {
		const typedValue = Nothing5(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator4}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator5})
	].join(''));

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator2.calledAfter(validator1));
	t.true(validator3.calledOnce);
	t.true(validator3.withArgs(value).calledOnce);
	t.true(validator3.calledAfter(validator2));
	t.true(validator4.calledOnce);
	t.true(validator4.withArgs(value).calledOnce);
	t.true(validator4.calledAfter(validator3));
	t.true(validator5.calledOnce);
	t.true(validator5.withArgs(value).calledOnce);
	t.true(validator5.calledAfter(validator4));
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
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator})
	].join(''));
});

test('Create type from many validators - no spy', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = v => true;
	const validator2 = v => false;
	const validator3 = v => true && true;
	const validator4 = v => true && false;
	const validator5 = v => true && true;
	const validator6 = v => false && true;
	const Unvalid = type(validator1, validator2, validator3, validator4, validator5, validator6);

	t.is(typeof Unvalid, 'function');
	t.is(Unvalid.name, 'Type');

	const value = {test:'val-test'};

	const unvalidTypeError = t.throws(() => {
		Unvalid(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator2}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator4}),
		`\n\t2) `, logs.typeErrorDetail({validator: validator6})
	].join(''));
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
	t.is(unvalidTypeError.message, logs.unvalidTypeValidator({validator, returnedValue: notBoolean}));
}

validatorReturningNotABooleanMacro.title = (providedTitle, notBoolean) => (
	`Create type function from one validator function not returning a boolean - (${stringable(notBoolean)}) - ${providedTitle}`
)

test(validatorReturningNotABooleanMacro, 'truthy value');
test('truthy number', validatorReturningNotABooleanMacro, 1);
test('falsy number', validatorReturningNotABooleanMacro, 0);
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
test(validatorReturningNotABooleanMacro, Symbol('hello'));
test(validatorReturningNotABooleanMacro, new Boolean(true));
test(validatorReturningNotABooleanMacro, new Boolean(false));
test(validatorReturningNotABooleanMacro, new Boolean());
test(validatorReturningNotABooleanMacro, new Error());
test(validatorReturningNotABooleanMacro, new Error('test'));
test(validatorReturningNotABooleanMacro, new TypeError('test type error'));

function manyValidatorsReturningNotABooleanMacro(t, unvalidValidatorIndex, notBooleans) {
	const type = requireFromIndex('sources/type');

	const validators = notBooleans.map(notBoolean => v => notBoolean);
	const UnvalidType = type(...validators);

	t.is(typeof UnvalidType, 'function');
	t.is(UnvalidType.name, 'Type');

	const unvalidTypeError = t.throws(() => {
		UnvalidType(true);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, logs.unvalidTypeValidator({
		validator: validators[unvalidValidatorIndex],
		returnedValue: notBooleans[unvalidValidatorIndex]
	}));
}

manyValidatorsReturningNotABooleanMacro.title = (providedTitle, unvalidValidatorIndex, notBooleans) => msg(
	`Create type function from many validator function not returning a boolean -`,
	`(unvalid at index ${unvalidValidatorIndex} - ${stringable(notBooleans)}) - ${providedTitle}`
)

test(manyValidatorsReturningNotABooleanMacro, 2, [true, false, 'truthy value', 32]);
test('truthy number', manyValidatorsReturningNotABooleanMacro, 1, [false, 1]);
test('falsy number', manyValidatorsReturningNotABooleanMacro, 0, [0, 1]);
test(manyValidatorsReturningNotABooleanMacro, 0, [42, true]);
test('float', manyValidatorsReturningNotABooleanMacro, 2, [true, true, 32.8]);
test('empty array', manyValidatorsReturningNotABooleanMacro, 0, [[]]);
test(manyValidatorsReturningNotABooleanMacro, 1, [false, ['vale', 5]]);
test(manyValidatorsReturningNotABooleanMacro, 0, [v => v]);
test(manyValidatorsReturningNotABooleanMacro, 1, [true, {key: 'val'}]);
test('empty object', manyValidatorsReturningNotABooleanMacro, 4, [true, false, true, true, {}]);
test(manyValidatorsReturningNotABooleanMacro, 0, [/reg/]);
test(manyValidatorsReturningNotABooleanMacro, 0, [Symbol()]);
test(manyValidatorsReturningNotABooleanMacro, 1, [true, null]);
test(manyValidatorsReturningNotABooleanMacro, 3, [true, false, true, undefined]);
test(manyValidatorsReturningNotABooleanMacro, 1, [false, Symbol()]);
test(manyValidatorsReturningNotABooleanMacro, 0, [new Boolean(true)]);
test(manyValidatorsReturningNotABooleanMacro, 1, [false, new Boolean(false)]);
test(manyValidatorsReturningNotABooleanMacro, 0, [new Boolean()]);
test(manyValidatorsReturningNotABooleanMacro, 2, [true, true, Symbol(), 89]);
test(manyValidatorsReturningNotABooleanMacro, 1, [false, new Error()]);
test(manyValidatorsReturningNotABooleanMacro, 0, [new Error('test'), false]);
test(manyValidatorsReturningNotABooleanMacro, 1, [true, new TypeError('test type error')]);

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
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator, errorMessage: 'validator error'})
	].join(''));
});

test('Create type function from many validators function, all throwing an error', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = v => {throw new Error('validator1 error')};
	const validator2 = v => {throw new Error('validator2 error content')};
	const validator3 = v => {throw new Error('validator3 error message')};
	const Nothing = type(validator1, validator2, validator3);

	t.is(typeof Nothing, 'function');
	t.is(Nothing.name, 'Type');

	const value = {valueKey3:'value value 3'};

	const unvalidTypeError = t.throws(() => {
		Nothing(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator1, errorMessage: 'validator1 error'}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator2, errorMessage: 'validator2 error content'}),
		`\n\t2) `, logs.typeErrorDetail({validator: validator3, errorMessage: 'validator3 error message'})
	].join(''));
});

test('Create type function from many validators function, one throwing an error the other false', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = v => true;
	const validator2 = v => {throw new Error('validator2 error content')};
	const validator3 = v => false;
	const Nothing = type(validator1, validator2, validator3);

	t.is(typeof Nothing, 'function');
	t.is(Nothing.name, 'Type');

	const value = {valueKey3:'value value 3'};

	const unvalidTypeError = t.throws(() => {
		Nothing(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator2, errorMessage: 'validator2 error content'}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator3})
	].join(''));
});

test('Create type function from many validators function, one throwing an error the other true', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = v => {throw new Error('validator1 error message')};
	const validator2 = v => true;
	const Nothing = type(validator1, validator2);

	t.is(typeof Nothing, 'function');
	t.is(Nothing.name, 'Type');

	const value = {valueKey3:'value value 3'};

	const unvalidTypeError = t.throws(() => {
		Nothing(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator1, errorMessage: 'validator1 error message'}),
	].join(''));
});

test.todo('Create type function from many validators function, validator throwing error - with spy');
test.todo('nested error messages');
test.todo('deep nested error messages');

/*-------------------------*/

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

test.todo('Trying to create a type with unvalid validators arguments');