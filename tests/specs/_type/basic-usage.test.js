'use strict';

const test = require('ava');
const sinon = require('sinon');

const msg = require('@alexistessier/msg');
const stringable = require('stringable');

const requireFromIndex = require('../../utils/require-from-index');

const logs = requireFromIndex('sources/settings/logs');

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

test('Create type function from many validators function, validator throwing error - with spy', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => {throw new Error('validator1 error message')});
	const validator2 = sinon.spy(v => true);
	const validator3 = sinon.spy(v => {throw new Error('validator3 err')});
	const validator4 = sinon.spy(v => false);
	const validator5 = sinon.spy(v => {throw new Error('error message')});

	const Nothing = type(validator1, validator2, validator3, validator4, validator5);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);
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
		`\n\t1) `, logs.typeErrorDetail({validator: validator3, errorMessage: 'validator3 err'}),
		`\n\t2) `, logs.typeErrorDetail({validator: validator4}),
		`\n\t3) `, logs.typeErrorDetail({validator: validator5, errorMessage: 'error message'})
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

test('nested types', t => {
	const type = requireFromIndex('sources/type');

	const Nested = type(v => true);
	const Root = type(Nested);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {key:'value', otherKey:'blabla'};

	const typedValue = Root(value);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('nested type usage in validator function', t => {
	const type = requireFromIndex('sources/type');

	const Nested = type(v => true);
	const Root = type(v => Nested(v) && true);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {key:'value', otherKey:'blabla'};

	const typedValue = Root(value);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('many nested types', t => {
	const type = requireFromIndex('sources/type');

	const Nested1 = type(v => true);
	const Nested2 = type(v => true && true);
	const Nested3 = type(v => true && true && true);
	const Root = type(Nested1, Nested2, v => true, Nested3);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {key:'val', otherKey:'blabla'};

	const typedValue = Root(value);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('many nested types usage in valodator function', t => {
	const type = requireFromIndex('sources/type');

	const Nested1 = type(v => true);
	const Nested2 = type(v => true && true);
	const Nested3 = type(v => true && true && true);
	const Root = type(Nested1, v => Nested2(v) && Nested3(v.key) && true);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {key:'val', otherKey:'blabla'};

	const typedValue = Root(value);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('many nested types - many validators - spies', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => true && true);
	const validator3 = sinon.spy(v => true);
	const validator4 = sinon.spy(v => true && true && true);
	const validator5 = sinon.spy(v => true);
	const validator6 = sinon.spy(v => true);
	const validator7 = sinon.spy(v => true && true);
	const validator8 = sinon.spy(v => true && true && true);

	const Nested1 = type(validator1);
	const Nested2 = type(validator2, validator3);
	const Nested3 = type(validator6, validator7, validator8);
	const Root = type(Nested1, Nested2, validator4, validator5, Nested3);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);
	t.true(validator6.notCalled);
	t.true(validator7.notCalled);
	t.true(validator8.notCalled);
	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {test:'t', other:'test'};

	const typedValue = Root(value);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);

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
	t.true(validator6.calledOnce);
	t.true(validator6.withArgs(value).calledOnce);
	t.true(validator6.calledAfter(validator5));
	t.true(validator7.calledOnce);
	t.true(validator7.withArgs(value).calledOnce);
	t.true(validator7.calledAfter(validator6));
	t.true(validator8.calledOnce);
	t.true(validator8.withArgs(value).calledOnce);
	t.true(validator8.calledAfter(validator7));
});

test('nested types and error messages', t => {
	const type = requireFromIndex('sources/type');

	const validator = v => false;
	const Nested = type(validator);
	const Root = type(Nested);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {key:'val', otherKey:'blabla'};
	const unvalidTypeError = t.throws(() => {
		Root(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator})
	].join(''));
});

test('nested type usage in validator function and error message', t => {
	const type = requireFromIndex('sources/type');

	const validator = v => false;
	const Nested = type(validator);
	const validator2 = v => Nested(v) && true;
	const Root = type(validator2);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {key:'val', otherKey:'blabla'};
	const unvalidTypeError = t.throws(() => {
		Root(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator2}),
		`\n\t0.0) `, logs.typeErrorDetail({validator})
	].join(''));
});

test('many nested types and error messages', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = v => false;
	const validator2 = v => false && false;
	const validator3 = v => true && false;
	const validator4 = v => true && true;
	const validator5 = v => false && false;
	const validator6 = v => true && true && true;
	const validator7 = v => false && false && true && false;
	const validator8 = v => true;

	const Nested1 = type(validator1);
	const Nested2 = type(validator2, validator3);
	const Nested3 = type(validator6, validator7, validator8);
	const Root = type(Nested1, Nested2, validator4, validator5, Nested3);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {test:'t', tt:'test'};
	const unvalidTypeError = t.throws(() => {
		Root(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator1}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator2}),
		`\n\t2) `, logs.typeErrorDetail({validator: validator3}),
		`\n\t3) `, logs.typeErrorDetail({validator: validator5}),
		`\n\t4) `, logs.typeErrorDetail({validator: validator7})
	].join(''));
});

test('many nested types usage in validator function and error messages', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = v => true;
	const validator2 = v => true && false;
	const validator3 = v => false && true;
	const validator4 = v => false && true && true;
	const validator5 = v => true && false && true;
	const validator6 = v => true && false && true;
	const validator7 = v => true;
	const validator8 = v => false && true && true;
	const validator9 = v => false && false;

	const Nested1 = type(validator1);
	const Nested2 = type(validator2);
	const Nested3 = type(validator3);
	const Nested4 = type(validator4, validator5);
	const Nested5 = type(validator6);
	const Nested6 = type(validator8, validator3, validator7);
	const nestedValidator6 = v => Nested6(v);
	const validator10 = v => type(validator5, nestedValidator6, Nested5)(v) && true;
	const Nested7 = type(validator10);
	const validatorNested3 = v => Nested3(v) && true;
	const validatorNested4 = v => Nested4(v) && true;
	const validatorNested5 = v => Nested5(v) && true;
	const validatorNested7 = v => Nested7(v) && true;

	const Root = type(Nested1, validator9, Nested2, validatorNested3, validatorNested4,
		validatorNested5, Nested6, validatorNested7);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {key:'val', otherKey:'blabla'};
	const unvalidTypeError = t.throws(() => {
		Root(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator9}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator2}),
		`\n\t2) `, logs.typeErrorDetail({validator: validatorNested3}),
		`\n\t2.0) `, logs.typeErrorDetail({validator: validator3}),
		`\n\t3) `, logs.typeErrorDetail({validator: validatorNested4}),
		`\n\t3.0) `, logs.typeErrorDetail({validator: validator4}),
		`\n\t3.1) `, logs.typeErrorDetail({validator: validator5}),
		`\n\t4) `, logs.typeErrorDetail({validator: validatorNested5}),
		`\n\t4.0) `, logs.typeErrorDetail({validator: validator6}),
		`\n\t5) `, logs.typeErrorDetail({validator: validator8}),
		`\n\t6) `, logs.typeErrorDetail({validator: validator3}),
		`\n\t7) `, logs.typeErrorDetail({validator: validatorNested7}),
		`\n\t7.0) `, logs.typeErrorDetail({validator: validator10}),
		`\n\t7.0.0) `, logs.typeErrorDetail({validator: validator5}),
		`\n\t7.0.1) `, logs.typeErrorDetail({validator: nestedValidator6}),
		`\n\t7.0.1.0) `, logs.typeErrorDetail({validator: validator8}),
		`\n\t7.0.1.1) `, logs.typeErrorDetail({validator: validator3}),
		`\n\t7.0.2) `, logs.typeErrorDetail({validator: validator6}),
	].join(''));
});

test('nested types with usage in validators functions to check an other value than the root value', t => {
	const type = requireFromIndex('sources/type');

	const validator = v => true;
	const Nested = type(validator);
	const Root = type(v => Nested(v.keyTest) && true);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {keyTest: 'value test'};

	const typedValue = Root(value);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('nested types with usage in validators functions to check an other value than the root value - error message', t => {
	const type = requireFromIndex('sources/type');

	const validator = v => false;
	const Nested = type(validator);
	const nestedValidator = v => Nested(v.keyTest) && true;
	const Root = type(nestedValidator);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const value = {keyTest: 'value test'};

	const unvalidTypeError = t.throws(() => {
		Root(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: nestedValidator}),
		`\n\t0.0) `, logs.typeError({value: value.keyTest}),
		`\n\t0.0.0) `, logs.typeErrorDetail({validator})
	].join(''));
});

function nestedTypeUsageInValidatorsFunctionToCheckOtherValueThanRootValue(t, rootValue, checkedValue) {
	const type = requireFromIndex('sources/type');

	const validator1 = v => true;
	const validator2 = v => true;
	const Nested = type(validator1);
	const nestedValidator = v => (Nested(checkedValue) && true) || true;
	const Root = type(validator2, nestedValidator);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const typedValue = Root(rootValue);

	t.is(typedValue, rootValue);
	t.deepEqual(typedValue, rootValue);
}

nestedTypeUsageInValidatorsFunctionToCheckOtherValueThanRootValue.title = (providedTitle, rootValue, checkedValue) => (
	`nested types usage in validators function to check an other value than the root value - ${providedTitle} - root: ${stringable(rootValue)} - checked: ${stringable(checkedValue)}`
)

function nestedTypeUsageInValidatorsFunctionToCheckOtherValueThanRootValueWithErrorMessage(t, rootValue, checkedValue) {
	const type = requireFromIndex('sources/type');

	const validator1 = v => false;
	const validator2 = v => false;
	const Nested = type(validator1);
	const nestedValidator = v => (Nested(checkedValue) && true) && false;
	const Root = type(validator2, nestedValidator);

	t.is(typeof Root, 'function');
	t.is(Root.name, 'Type');

	const unvalidTypeError = t.throws(()=>{
		Root(rootValue);
	});

	const isSame =
		(rootValue === false && checkedValue === false) ||
		(rootValue === true && checkedValue === true) ||
		(rootValue === null && checkedValue === null) ||
		(rootValue === undefined && checkedValue === undefined);

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value: rootValue}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator2}),
		`\n\t1) `, logs.typeErrorDetail({validator: nestedValidator}),
		`\n\t1.0) `, isSame ? '' : logs.typeError({value: checkedValue}),
		isSame ? '' : `\n\t1.0.0) `, logs.typeErrorDetail({validator: validator1}),
	].join(''));
}

nestedTypeUsageInValidatorsFunctionToCheckOtherValueThanRootValueWithErrorMessage.title = (providedTitle, rootValue, checkedValue) => (
	`nested types usage in validators function to check an other value than the root value and error message - ${providedTitle} - root: ${stringable(rootValue)} - checked: ${stringable(checkedValue)}`
)

const rootValues = [
	'string', 'other string', 42, 0, -12, [], ['not', 'empty', 'array'],
	NaN, {}, {not: 'empty', object: 42}, false, true, null, undefined, /regex/, function t(){return;},
	Symbol(), Symbol('hello')
];

const checkedValues = ['a string', 'other string 2', 43, -1, 12, [], ['not', 'empty', 'array', 2],
	Infinity, {}, new Object(), {not: 'empty', object: 42}, {not2: 'empty object', key: 13}, /regex/,
	function t() {return;}, Symbol(), Symbol('hello'), false, true, null, undefined
];

for(const rootValue of rootValues){
	for(const checkedValue of checkedValues){
		test(nestedTypeUsageInValidatorsFunctionToCheckOtherValueThanRootValue, rootValue, checkedValue);
		test(nestedTypeUsageInValidatorsFunctionToCheckOtherValueThanRootValueWithErrorMessage, rootValue, checkedValue);
	}
}
/*-------*/

test('deep nested types', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => true);
	const validator3 = sinon.spy(v => true);
	const validator4 = sinon.spy(v => true);
	const validator5 = sinon.spy(v => true);
	const nested1 = type(validator1, validator2);
	const nested2 = type(validator3, nested1, validator4);
	const nested3 = type(nested2, validator5);
	const Root = type(nested3);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);

	const value = {key: 'test'};

	const typedValue = Root(value);

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator3.calledOnce);
	t.true(validator3.withArgs(value).calledOnce);
	t.true(validator4.calledOnce);
	t.true(validator4.withArgs(value).calledOnce);
	t.true(validator5.calledOnce);
	t.true(validator5.withArgs(value).calledOnce);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('deep nested types usage in validator functions', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => true);
	const validator3 = sinon.spy(v => true);
	const validator4 = sinon.spy(v => true);
	const validator5 = sinon.spy(v => true);
	const nested1 = type(v => validator1(v) && validator2(v));
	const nested2 = type(v => validator3(v) && nested1(v) && validator4(v));
	const nested3 = type(v => nested2(v) && validator5(v));
	const Root = type(v => nested3(v) && true);

	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);

	const value = {key: 'test'};

	const typedValue = Root(value);

	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator3.calledOnce);
	t.true(validator3.withArgs(value).calledOnce);
	t.true(validator4.calledOnce);
	t.true(validator4.withArgs(value).calledOnce);
	t.true(validator5.calledOnce);
	t.true(validator5.withArgs(value).calledOnce);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('many deep nested types', t => {
	const type = requireFromIndex('sources/type');

	const validator0 = sinon.spy(v => true);
	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => true);
	const validator3 = sinon.spy(v => true);
	const validator4 = sinon.spy(v => true);
	const validator5 = sinon.spy(v => true);
	const validator6 = sinon.spy(v => true);
	const validator7 = sinon.spy(v => true);
	const validator8 = sinon.spy(v => true);
	const validator9 = sinon.spy(v => true);
	const nested0 = type(validator0);
	const nested1 = type(validator1);
	const nested2 = type(validator2, nested0);
	const nested3 = type(validator3, validator4);
	const nested4 = type(nested1, nested2);
	const nested5 = type(nested3, validator5, validator6);
	const nested6 = type(validator7, validator8, validator9);
	const nested7 = type(nested4, nested5);
	const Root = type(nested6, nested7);

	t.true(validator0.notCalled);
	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);
	t.true(validator6.notCalled);
	t.true(validator7.notCalled);
	t.true(validator8.notCalled);
	t.true(validator9.notCalled);

	const value = {key: 'test'};

	const typedValue = Root(value);

	t.true(validator0.calledOnce);
	t.true(validator0.withArgs(value).calledOnce);
	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator3.calledOnce);
	t.true(validator3.withArgs(value).calledOnce);
	t.true(validator4.calledOnce);
	t.true(validator4.withArgs(value).calledOnce);
	t.true(validator5.calledOnce);
	t.true(validator5.withArgs(value).calledOnce);
	t.true(validator6.calledOnce);
	t.true(validator6.withArgs(value).calledOnce);
	t.true(validator7.calledOnce);
	t.true(validator7.withArgs(value).calledOnce);
	t.true(validator8.calledOnce);
	t.true(validator8.withArgs(value).calledOnce);
	t.true(validator9.calledOnce);
	t.true(validator9.withArgs(value).calledOnce);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('many deep nested types usage in validator functions', t => {
	const type = requireFromIndex('sources/type');

	const validator0 = sinon.spy(v => true);
	const validator1 = sinon.spy(v => true);
	const validator2 = sinon.spy(v => true);
	const validator3 = sinon.spy(v => true);
	const validator4 = sinon.spy(v => true);
	const validator5 = sinon.spy(v => true);
	const validator6 = sinon.spy(v => true);
	const validator7 = sinon.spy(v => true);
	const validator8 = sinon.spy(v => true);
	const validator9 = sinon.spy(v => true);
	const nested0 = type(v => validator0(v));
	const nested1 = type(v => validator1(v));
	const nested2 = type(v => validator2(v) && nested0(v) && true);
	const nested3 = type(v => validator3(v) && validator4(v));
	const nested4 = type(v => nested1(v) && nested2(v) && true);
	const nested5 = type(v => nested3(v) && validator5(v) && validator6(v));
	const nested6 = type(v => validator7(v) && validator8(v) && validator9(v));
	const nested7 = type(v => nested4(v) && nested5(v) && true);
	const Root = type(v => nested6(v) && nested7(v) && true);

	t.true(validator0.notCalled);
	t.true(validator1.notCalled);
	t.true(validator2.notCalled);
	t.true(validator3.notCalled);
	t.true(validator4.notCalled);
	t.true(validator5.notCalled);
	t.true(validator6.notCalled);
	t.true(validator7.notCalled);
	t.true(validator8.notCalled);
	t.true(validator9.notCalled);

	const value = {key: 'test'};

	const typedValue = Root(value);

	t.true(validator0.calledOnce);
	t.true(validator0.withArgs(value).calledOnce);
	t.true(validator1.calledOnce);
	t.true(validator1.withArgs(value).calledOnce);
	t.true(validator2.calledOnce);
	t.true(validator2.withArgs(value).calledOnce);
	t.true(validator3.calledOnce);
	t.true(validator3.withArgs(value).calledOnce);
	t.true(validator4.calledOnce);
	t.true(validator4.withArgs(value).calledOnce);
	t.true(validator5.calledOnce);
	t.true(validator5.withArgs(value).calledOnce);
	t.true(validator6.calledOnce);
	t.true(validator6.withArgs(value).calledOnce);
	t.true(validator7.calledOnce);
	t.true(validator7.withArgs(value).calledOnce);
	t.true(validator8.calledOnce);
	t.true(validator8.withArgs(value).calledOnce);
	t.true(validator9.calledOnce);
	t.true(validator9.withArgs(value).calledOnce);

	t.is(typedValue, value);
	t.deepEqual(typedValue, value);
});

test('deep nested types and error messages', t => {
	const type = requireFromIndex('sources/type');

	const validator1 = v => true
	const validator2 = v => false
	const validator3 = v => false
	const validator4 = v => false
	const validator5 = v => false
	const nested1 = type(validator1, validator2);
	const nested2 = type(validator3, nested1, validator4);
	const nested3 = type(nested2, validator5);
	const Root = type(nested3);

	const value = {key: 'test'};

	const unvalidTypeError = t.throws(()=>{
		Root(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: validator3}),
		`\n\t1) `, logs.typeErrorDetail({validator: validator2}),
		`\n\t2) `, logs.typeErrorDetail({validator: validator4}),
		`\n\t3) `, logs.typeErrorDetail({validator: validator5})
	].join(''));
});

test('deep nested types usage in validator functions and error messages', t=>{
	const type = requireFromIndex('sources/type');

	const validator1 = v => true
	const validator2 = v => false
	const validator3 = v => false
	const validator4 = v => true
	const validator5 = v => false
	const nested1Validator = v => validator1(v) && validator2(v) && true
	const nested1 = type(nested1Validator)
	const nested2Validator = v => validator3(v) && true
	const nested2 = type(nested2Validator)
	const nested3Validator = v => validator1(v) && validator4(v) && true
	const nested3 = type(nested3Validator)
	const nested4Validator = v => validator5(v) && true
	const nested4 = type(nested4Validator)
	const nested5Validator = v => nested3(v) && nested1(v) && true
	const nested5 = type(nested5Validator)
	const deep1 = v => nested1(v) && true
	const deep2 = v => nested2(v) && true
	const deep3 = v => nested3(v) && true
	const deep4 = v => nested4(v) && true
	const deep5 = v => nested5(v) && true
	const Root = type(
		type(deep1),
		type(deep2),
		type(deep3),
		type(deep4),
		type(deep5, deep2)
	);

	const value = 42;

	const unvalidTypeError = t.throws(()=>{
		Root(value);
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0) `, logs.typeErrorDetail({validator: deep1}),
		`\n\t0.0) `, logs.typeErrorDetail({validator: nested1Validator}),
		`\n\t1) `, logs.typeErrorDetail({validator: deep2}),
		`\n\t1.0) `, logs.typeErrorDetail({validator: nested2Validator}),
		`\n\t2) `, logs.typeErrorDetail({validator: deep4}),
		`\n\t2.0) `, logs.typeErrorDetail({validator: nested4Validator}),
		`\n\t3) `, logs.typeErrorDetail({validator: deep5}),
		`\n\t3.0) `, logs.typeErrorDetail({validator: nested5Validator}),
		`\n\t3.0.0) `, logs.typeErrorDetail({validator: nested1Validator}),
		`\n\t4) `, logs.typeErrorDetail({validator: deep2}),
		`\n\t4.0) `, logs.typeErrorDetail({validator: nested2Validator})
	].join(''));
});

test.todo('many deep nested types and error messages');

test.todo('many deep nested types usage in validator functions and error messages');

test.todo('complex deep nested types with type validation on properties');

test.todo('complex deep nested types with type validation on properties and error messages');

/*-------------------------*/

test('ensure that internal TypeError symbols and properties are not enumerable', t => {
	const type = requireFromIndex('sources/type');

	const Type = type(v => false);

	const unvalidTypeError = t.throws(()=>{
		Type('whatever');
	});

	t.true(unvalidTypeError instanceof TypeError);
	t.deepEqual(Object.getOwnPropertyNames(unvalidTypeError), Object.getOwnPropertyNames(new TypeError('whatever')));
	t.deepEqual(Object.getOwnPropertySymbols(unvalidTypeError), Object.getOwnPropertySymbols(new TypeError('whatever')));
});

test('ensure that internal Type symbols are not enumerable', t => {
	const type = requireFromIndex('sources/type');

	const Type = type(v => false);

	t.deepEqual(Object.getOwnPropertyNames(Type), [
		...Object.getOwnPropertyNames(function test(){return;}),
		'path'
	]);
	t.deepEqual(Object.getOwnPropertySymbols(Type), Object.getOwnPropertySymbols(function test(){return;}));
});

/*-------------------------*/

test.todo('Trying to create type without parameters should throw an error');
test.todo('Trying to create type with wrong parameters should throw an error');
test.todo('Trying to create a type with unvalid validators arguments');