'use strict';

const {
	unvalidTypeValidator: UNV_TYP_VAL,
	typeError: TYP_ERR,
	typeErrorDetail: TYP_ERR_DET
} = require('./settings/logs')

function type(...validators){
	return function Type(value){
		let valid = true;
		const validatorErrorMessages = [];

		validators.forEach(validator => {
			let returnedValue = null;

			try{
				returnedValue = validator(value);
				valid = valid && returnedValue;
				if (!returnedValue) {
					validatorErrorMessages.push(
						TYP_ERR_DET({validator})
					);
				}
			}
			catch(err){
				valid = false;
				validatorErrorMessages.push(
					TYP_ERR_DET({validator, errorMessage: err.message})
				);
			}

			if (typeof returnedValue !== 'boolean') {
				throw new TypeError(UNV_TYP_VAL({validator, returnedValue}))
			}
		});

		if(!valid){
			throw new TypeError([
				TYP_ERR({ value }), ...validatorErrorMessages.map((errorMessage, i) => `\t${i}) ${errorMessage}`)
			].join('\n'))
		}

		return value;
	}
}

module.exports = type;