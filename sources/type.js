'use strict';

const msg = require('@alexistessier/msg');

function type(validator){
	const loggableValidator = validator.toString();

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
			const loggableValidValue = `(${typeof valid} => ${valid})`;

			throw new TypeError(msg(
				`Unvalid type validator.`,
				`The validator ${loggableValidator}`,
				`doesn't return a boolean value.`,
				`It returns ${loggableValidValue}.`
			));
		}
		if(!valid){
			let typeErrorMessage = msg(
				`Value ${JSON.stringify(value)} is not of a valid type.`,
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