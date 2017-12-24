'use strict';

const stringable = require('stringable');

const {
	unvalidTypeValidator: UNV_TYP_VAL,
	typeError: TYP_ERR
} = require('./settings/logs')

function validatorFormatter(data) {
	const {
		type,
		stringifiedValue,
		defaultFormatter
	} = data;
	const functionBody = type === 'function' ? `[${stringifiedValue}]` : '';
	return `${defaultFormatter(data)}${functionBody}`;
}

function type(...validators){
	return function Type(value){
		validators.forEach(validator => {
			const loggableValidator = stringable(validator, validatorFormatter);

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
				throw new TypeError(UNV_TYP_VAL({validator: loggableValidator, returnedValue: stringable(valid)}));
			}
			if(!valid){
				throw new TypeError(TYP_ERR({
					value: stringable(value),
					validator: loggableValidator,
					validatorErrorMessage
				}))
			}
		});

		return value;
	}
}

module.exports = type;