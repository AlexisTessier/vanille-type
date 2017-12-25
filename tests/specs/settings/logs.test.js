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
		'typeErrorDetail'
	].sort());
});

test('unvalidTypeValidator', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidTypeValidator, 'function');
	t.is(logs.unvalidTypeValidator({ validator: 'validator test', returnedValue: 'val return' }), msg(
		`Unvalid type validator. The validator ${stringable('validator test')}`,
		`doesn't return a boolean value. It returns ${stringable('val return')}.`
	));

	t.is(logs.unvalidTypeValidator({ validator: 2, returnedValue: 92 }), msg(
		`Unvalid type validator. The validator ${stringable(2)}`,
		`doesn't return a boolean value. It returns ${stringable(92)}.`
	));

	function returnedValue() {}

	t.is(logs.unvalidTypeValidator({ validator: v => true, returnedValue }), msg(
		`Unvalid type validator. The validator (function => validator)[v => true]`,
		`doesn't return a boolean value. It returns ${stringable(returnedValue)}.`
	));
});

test('typeError', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.typeError, 'function');
	t.is(logs.typeError({value: 'val1'}),
		`Value ${stringable('val1')} is not of a valid type:`
	);

	t.is(logs.typeError({value: 'val1'}),
		`Value ${stringable('val1')} is not of a valid type:`
	);
});


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