'use strict'

const {
	unvalidTypeValidator: UNV_TYP_VAL,
	typeError: TYP_ERR,
	typeErrorDetail: TYP_ERR_DET,
	pathTypeErrorDetail: PAT_TYP_ERR_DET
} = require('./settings/logs')

const typeErrorsMetadatas = new WeakMap()
const VALUE = Symbol()
const FAILURES = Symbol()

const validatorsMetadatas = new WeakMap()
const PATH = Symbol()
const VALIDATOR = Symbol()

const types = new WeakSet()

function typeErrorDetail(params) {
	const validator = params.validator

	if (validatorsMetadatas.has(validator)) {
		return PAT_TYP_ERR_DET(Object.assign(params, {
			path: validatorsMetadatas.get(validator)[PATH],
			validator: validatorsMetadatas.get(validator)[VALIDATOR]
		}))
	}

	return TYP_ERR_DET(params)
}

function flat(array, flatten = []) {
	array.forEach(el => el instanceof Array ? flat(el, flatten) : flatten.push(el))
	return flatten;
}

function Failure(data, validator) {
	return {
		data,
		validator
	}
}

function mapFailureToMessage(failure, i, _, nesting = '') {
	const {
		data,
		validator
	} = failure

	nesting = `${nesting}${i}`;

	if (validatorsMetadatas.has(validator)) {
		nesting = `${nesting} - ${validatorsMetadatas.get(validator)[PATH]}`
	}

	return data instanceof Object
		? [
			`${nesting}) ${data.root}`,
			...data.children.map((m,j,k) => mapFailureToMessage(m,j,k,`${nesting}.`))
		  ].join('\n\t')
		: `${nesting}) ${data}`;
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
			TYP_ERR({ value }), failures.map(mapFailureToMessage)
		]).join('\n\t')
	}

	return {
		addFailure(failure){
			failures.push(failure)
		},
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

function getValuePath(value, ...path){
	let v = value;
	const fragments = [...path];

	while(fragments.length > 0){
		v = v[fragments.shift()];
	}

	return v;
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
					report.addFailure(Failure(
						typeErrorDetail({validator}),
						validator
					));
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
						report.addFailure(Failure(
							{
								root: typeErrorDetail({validator}),
								children:  Object.is(metadatas[VALUE], value) ? metadatas[FAILURES] : [{
									root: TYP_ERR({value: metadatas[VALUE]}),
									children: metadatas[FAILURES]
								}].map(child => Failure(child, validator))
							},
							validator
						))
					}
				}
				else{
					report.addFailure(Failure(
						typeErrorDetail({validator, errorMessage: err.message}),
						validator
					));
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

	return assignPathModifier(Type, validators)
}

const PathFragment = v => typeof v === 'string' || typeof v === 'symbol' || typeof v === 'number'
const PathFragmentInterface = type(PathFragment)

function assignPathModifier(rootType, validators, ...rootPaths){
	return Object.assign(rootType, {
		path: (...path) => {
			path.forEach(PathFragmentInterface)

			const fullPath = [...rootPaths, ...path]
			const withPathType = type(...validators.map(validator => {
				const withPathValidator = v => validator(
					getValuePath(v, ...fullPath)
				)
				validatorsMetadatas.set(withPathValidator, {
					[PATH]: fullPath.join('.'),
					[VALIDATOR]: validator
				})
				return withPathValidator
			}))

			return assignPathModifier(withPathType, validators, ...fullPath)
		}
	});
}

module.exports = Object.assign(type, {
	path: (...path) => (...validators) => type(...validators).path(...path)
});