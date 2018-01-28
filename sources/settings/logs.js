'use strict';

const stringable = require('stringable');
const msg = require('@alexistessier/msg');

function validatorFormatter(data) {
	const {
		type,
		stringifiedValue,
		defaultFormatter
	} = data;
	const functionBody = type === 'function' ? `[${stringifiedValue}]` : '';
	return `${defaultFormatter(data)}${functionBody}`;
}

module.exports = {
	unvalidTypeValidator:({validator, returnedValue})=>msg(
		`Unvalid type validator. The validator ${stringable(validator, validatorFormatter)}`,
		`doesn't return a boolean value. It returns ${stringable(returnedValue)}.`
	),
	typeError:({value, validator})=>`Value ${stringable(value)} is not of a valid type:`,
	typeErrorDetail:({validator, errorMessage})=>[
		`It doesn't match the validator ${stringable(validator, validatorFormatter)}`,
		errorMessage ? ` - ${errorMessage}` : '.'
	].join(''),
	pathTypeErrorDetail:({path, validator, errorMessage})=>[
		`${path} value doesn't match the validator ${stringable(validator, validatorFormatter)}`,
		errorMessage ? ` - ${errorMessage}` : '.'
	].join(''),
}