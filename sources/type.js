'use strict';

const {
	unvalidTypeValidator: UNV_TYP_VAL,
	typeError: TYP_ERR,
	typeErrorDetail: TYP_ERR_DET
} = require('./settings/logs')

/**
 * @name TypeFunction
 *
 * @description A type function take a value to check the type as input,
 * returns it if the type matches but throws an error otherwise.
 */
const IS_TYPE = Symbol();

/**
 * @name type
 *
 * @description A function providing a way to generate type validation function, usable in plain JS.
 *
 * @param {...(TypeFunction|function)} validators The validators to use in order to check a value type.
 * A validator can be a other type function, or a function returning a booolean
 * (true if the type matchs, false otherwise), or throwing an error if the value doesn't match the type.
 *
 * @return {TypeFunction} A function which will check a value type, using all the validators.
 */
function type(...validators){
	/**
	 * @name Type
	 * @alias TypeFunction
	 */
	function Type(value){
		let valid = true;
		const validatorErrorMessages = [];

		validators.forEach(validator => {
			let returnedValue = undefined;

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
				returnedValue = valid = false;
				validatorErrorMessages.push(
					TYP_ERR_DET({validator, errorMessage: err.message})
				);
			}

			if (!validator[IS_TYPE] && typeof returnedValue !== 'boolean') {
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

	return Object.assign(Type, {
		[IS_TYPE]: true
	});
}

module.exports = type;