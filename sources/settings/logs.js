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

const logs = {
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
	missingTypeChecking:({checkingFunction, validator, unvalidValue, index})=>[
		`Missing type checking in ${stringable(checkingFunction)}.`,
		`It should throws a vanille type error when the argument`,
		`at index ${index} is ${stringable(unvalidValue)}.`,
		`Expected type error message is:\n`,
		logs.typeError({value: unvalidValue}),
		`\n\t0) `, logs.typeErrorDetail({
			validator
		})
	].join(' ')
}

module.exports = logs