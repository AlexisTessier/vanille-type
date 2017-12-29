'use strict';

const {
	unvalidTypeValidator: UNV_TYP_VAL,
	typeError: TYP_ERR,
	typeErrorDetail: TYP_ERR_DET
} = require('./settings/logs')

const VALUE = Symbol();
const FAILURES = Symbol();

/**
 * @private
 */
function flat(array, flatten = []) {
	array.forEach(el => el instanceof Array ? flat(el, flatten) : flatten.push(el))
	return flatten;
}

/**
 * @private
 */
function nestErrorMessage(errorMessage, i, _, nesting = '') {
	nesting = `${nesting}${i}`;

	return errorMessage instanceof Object
		? [
			`${nesting}) ${errorMessage.root}`,
			...errorMessage.children.map((m,j,k) => nestErrorMessage(m,j,k,`${nesting}.`))
		  ].join('\n\t')
		: `${nesting}) ${errorMessage}`;
}

/**
 * @private
 */
function VanilleTypeReport(value){
	const failures = [];

	function message() {
		return flat([
			TYP_ERR({ value }), failures.map(nestErrorMessage)
		]).join('\n\t')
	}

	return {
		addFailure(failure){ failures.push(failure) },
		isValid(){ return failures.length === 0 },
		toTypeError(){return Object.assign(new TypeError(message()), {
			[VALUE]: value,
			[FAILURES]: failures
		})}
	}
}

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
		const report = VanilleTypeReport(value);

		validators.forEach(validator => {
			const validatorIsType = validator[IS_TYPE] || false;
			let returnedValue = undefined;

			try{
				returnedValue = validator(value);
				if (!returnedValue) {
					report.addFailure(TYP_ERR_DET({validator}));
				}
			}
			catch(err){
				returnedValue = false;

				if(FAILURES in err){
					if (validatorIsType) {
						err[FAILURES].forEach(report.addFailure)
					}
					else {
						report.addFailure({
							root: TYP_ERR_DET({validator}),
							children:  Object.is(err[VALUE], value) ? err[FAILURES] : [{
								root: TYP_ERR({value: err[VALUE]}),
								children: err[FAILURES]
							}]
						})
					}
				}
				else{
					report.addFailure(TYP_ERR_DET({validator, errorMessage: err.message}));
				}
			}

			if (!validatorIsType && typeof returnedValue !== 'boolean') {
				throw new TypeError(UNV_TYP_VAL({validator, returnedValue}))
			}
		});

		if (!report.isValid()) { throw report.toTypeError(); }

		return value;
	}

	return Object.assign(Type, {
		[IS_TYPE]: true
	});
}

module.exports = type;