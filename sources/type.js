'use strict';

const msg = require('@alexistessier/msg');
const stringable = require('stringable');

function validatorFormatter(data) {
	const {
		type,
		stringifiedValue,
		defaultFormatter
	} = data;
	const functionBody = type === 'function' ? `[${stringifiedValue}]` : '';
	return `${defaultFormatter(data)}${functionBody}`;
}

function type(validator){
	const loggableValidator = stringable(validator, validatorFormatter);

	return function Type(value){
		let valid = true;
		let validatorErrorMessage = null;

		try{
			valid = validator(value);
		}
		catch(err){
			valid = false;
			validatorErrorMessage = err.message;
		}

		if (typeof valid !== 'boolean') {
			const loggableValidValue = stringable(valid);

			throw new TypeError(msg(
				`Unvalid type validator.`,
				`The validator ${loggableValidator}`,
				`doesn't return a boolean value.`,
				`It returns ${loggableValidValue}.`
			));
		}
		if(!valid){
			const loggableValue = stringable(value);
			let typeErrorMessage = msg(
				`Value ${loggableValue} is not of a valid type.`,
				`It doesn't match the validator ${loggableValidator}.`
			);

			if (validatorErrorMessage) {
				typeErrorMessage += `\n\t${validatorErrorMessage}`;
			}

			throw new TypeError(typeErrorMessage)
		}
		return value;
	}
}

module.exports = type;