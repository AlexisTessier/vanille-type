'use strict';

const msg = require('@alexistessier/msg');

module.exports = {
	unvalidTypeValidator:({validator, returnedValue})=>msg(
		`Unvalid type validator. The validator ${validator}`,
		`doesn't return a boolean value. It returns ${returnedValue}.`
	),
	typeError:({value, validator, validatorErrorMessage})=>[msg(
		`Value ${value} is not of a valid type.`,
		`It doesn't match the validator ${validator}.`
	), validatorErrorMessage ? `\n\t${validatorErrorMessage}` : ''].join('')
}