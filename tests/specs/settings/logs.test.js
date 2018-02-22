'use strict';

const test = require('ava');

const msg = require('@alexistessier/msg');
const stringable = require('stringable');

const requireFromIndex = require('../../utils/require-from-index');

test.todo('Add type assertions to check parameters');

test('Type and content', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs, 'object');

	t.deepEqual(Object.keys(logs).sort(), [
		'unvalidTypeValidator',
		'typeError',
		'typeErrorDetail',
		'pathTypeErrorDetail',
		'missingTypeChecking'
	].sort())
})

test('unvalidTypeValidator', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidTypeValidator, 'function');
	t.is(logs.unvalidTypeValidator({ validator: 'validator test', returnedValue: 'val return' }), msg(
		`Unvalid type validator. The validator ${stringable('validator test')}`,
		`doesn't return a boolean value. It returns ${stringable('val return')}.`
	))

	t.is(logs.unvalidTypeValidator({ validator: 2, returnedValue: 92 }), msg(
		`Unvalid type validator. The validator ${stringable(2)}`,
		`doesn't return a boolean value. It returns ${stringable(92)}.`
	))

	function returnedValue() {return;}

	t.is(logs.unvalidTypeValidator({ validator: v => true, returnedValue }), msg(
		`Unvalid type validator. The validator (function => validator)[v => true]`,
		`doesn't return a boolean value. It returns ${stringable(returnedValue)}.`
	))

	t.is(logs.unvalidTypeValidator({ validator: v => {throw new Error('err')}, returnedValue: 32 }), [
		`Unvalid type validator. The validator (function => validator)[v => {`,
		`\n\t\t\tthrow new Error('err');`,
		`\n\t\t}] doesn't return a boolean value. It returns ${stringable(32)}.`
	].join(''))
})

test('typeError', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.typeError, 'function');
	t.is(logs.typeError({value: 'val1'}),
		`Value ${stringable('val1')} is not of a valid type:`
	)

	t.is(logs.typeError({value: 'val1'}),
		`Value ${stringable('val1')} is not of a valid type:`
	)
})

test('typeErrorDetail', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.typeErrorDetail, 'function');
	t.is(logs.typeErrorDetail({validator: 32}),
		`It doesn't match the validator ${stringable(32)}.`
	);

	t.is(logs.typeErrorDetail({validator: v => false}),
		`It doesn't match the validator (function => validator)[v => false].`
	);

	t.is(logs.typeErrorDetail({validator: 32, errorMessage: 'an error message'}),
		`It doesn't match the validator ${stringable(32)} - an error message`
	);

	t.is(logs.typeErrorDetail({validator: v => true, errorMessage: 'other message'}),
		`It doesn't match the validator (function => validator)[v => true] - other message`
	);
});

test('pathTypeErrorDetail', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.pathTypeErrorDetail, 'function');
	t.is(logs.pathTypeErrorDetail({path: 'akey', validator: 32}),
		`akey value doesn't match the validator ${stringable(32)}.`
	);

	t.is(logs.pathTypeErrorDetail({path: 'bkey', validator: v => false}),
		`bkey value doesn't match the validator (function => validator)[v => false].`
	);

	t.is(logs.pathTypeErrorDetail({path: 'name.length', validator: 32, errorMessage: 'an error message'}),
		`name.length value doesn't match the validator ${stringable(32)} - an error message`
	);

	t.is(logs.pathTypeErrorDetail({path: 'age.number', validator: v => true, errorMessage: 'other message'}),
		`age.number value doesn't match the validator (function => validator)[v => true] - other message`
	);
});

test('missingTypeChecking', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.missingTypeChecking, 'function');
	t.is(logs.missingTypeChecking({
		checkingFunction: 'check',
		index: 2,
		validator: 'validator',
		unvalidValue: 32
	}), [
		`Missing type checking in (string => 'check').`,
		`It should throws a vanille type error when the`,
		`argument at index 2 is (number: integer => 32).`,
		`Expected type error message is:\n`,
		`Value (number: integer => 32) is not of a valid type:`,
		`\n\t0)  It doesn't match the validator (string => 'validator').`
	].join(' '));

	t.is(logs.missingTypeChecking({
		checkingFunction: '42',
		index: 0,
		validator: 'test',
		unvalidValue: 12
	}), [
		`Missing type checking in (string => '42').`,
		`It should throws a vanille type error when the`,
		`argument at index 0 is (number: integer => 12).`,
		`Expected type error message is:\n`,
		`Value (number: integer => 12) is not of a valid type:`,
		`\n\t0)  It doesn't match the validator (string => 'test').`
	].join(' '));
});