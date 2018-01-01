'use strict';

const {
	unvalidTypeValidator: UNV_TYP_VAL,
	typeError: TYP_ERR,
	typeErrorDetail: TYP_ERR_DET
} = require('./settings/logs')

const typeErrorsMetadatas = new WeakMap();
const VALUE = Symbol();
const FAILURES = Symbol();

const types = new WeakSet();

/**
 * @private
 *
 * @description flatten an array.
 *
 * @param {Array} array The array to flatten.
 * @param {Array} flatten The flatten array to fill with elements of array.
 *
 * @return {Array} The flattened array.
 */
function flat(array, flatten = []) {
	array.forEach(el => el instanceof Array ? flat(el, flatten) : flatten.push(el))
	return flatten;
}

/**
 * @private
 *
 * @description A mapping function to prefix errors messages with a nesting path.
 *
 * @param {string | NestedErrorMessage} errorMessage The error messages to prefix with a nesting path.
 * @param {number} i The mapping index.
 * @param {Array} _ The mapped array.
 * @param {string} nesting The root nesting path.
 *
 * @return {string} The prefixed error message.
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
 *
 * @description VanilleTypeReport are used to aggregate failures and generate final TypeError.
 *
 * @param {any} value The subject of the report.
 *
 * @return {object} A vanille type report.
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
		toTypeError(){
			const err = new TypeError(message());

			typeErrorsMetadatas.set(err, {
				[VALUE]: value,
				[FAILURES]: failures
			});

			return err;
		}
	}
}

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
	 * @name TypeFunction
	 * @alias Type
	 *
	 * @description A type function take a value to check the type as input,
 	 * returns it if the type matches but throws an error otherwise.
	 *
	 * @param {any} value The value to check the type.
	 *
	 * @return {any} The value itself, unmodified if the value match the type.
	 */
	function Type(value){
		const report = VanilleTypeReport(value);

		validators.forEach(validator => {
			const validatorIsType = types.has(validator);
			let returnedValue = undefined;

			try{
				returnedValue = validator(value);
				if (!returnedValue) {
					report.addFailure(TYP_ERR_DET({validator}));
				}
			}
			catch(err){
				returnedValue = false;

				if(typeErrorsMetadatas.has(err)){
					const metadatas = typeErrorsMetadatas.get(err);

					if (validatorIsType) {
						metadatas[FAILURES].forEach(report.addFailure)
					}
					else {
						report.addFailure({
							root: TYP_ERR_DET({validator}),
							children:  Object.is(metadatas[VALUE], value) ? metadatas[FAILURES] : [{
								root: TYP_ERR({value: metadatas[VALUE]}),
								children: metadatas[FAILURES]
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

	types.add(Type);

	return Type;
}

module.exports = Object.assign(type, {
	path: path => (...validators) => type(...validators.map(validator => v => validator(v[path])))
});