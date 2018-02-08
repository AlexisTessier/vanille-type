'use strict';

const test = require('ava')
const stringable = require('stringable')

const requireFromIndex = require('../utils/require-from-index')

const logs = requireFromIndex('sources/settings/logs');

test('Type and api', t => {
	const makeEnsureTypeCheckingFunction = requireFromIndex('sources/ensure-type-checking')

	t.is(typeof makeEnsureTypeCheckingFunction, 'function')
})

test('Usage from index', t => {
	const makeEnsureTypeCheckingFunctionFromIndex = requireFromIndex('ensure-type-checking')
	const makeEnsureTypeCheckingFunction = requireFromIndex('sources/ensure-type-checking')

	t.is(makeEnsureTypeCheckingFunctionFromIndex, makeEnsureTypeCheckingFunction)
})

test('Basic usage', t => {
	const ensureTypeChecking = requireFromIndex('sources/ensure-type-checking')()

	t.is(typeof ensureTypeChecking, 'function')
})

test('Usage with custom valid value and unvalid lists map (1 type) - ensure an actually checking function', t => {
	const type = requireFromIndex('sources/type')
	const CustomType = type(v => v === 'valid')
	const unvalidCustomTypeValuesList = ['unvalid', 'not valid', 42, /regex/, {}]

	const ensureTypeChecking = requireFromIndex('sources/ensure-type-checking')(
		[CustomType, 'valid', unvalidCustomTypeValuesList]
	)

	function checkFunction(param){
		CustomType(param)
	}

	const check = ensureTypeChecking(checkFunction, [
		CustomType
	])

	t.true(check)
})

test('Usage with custom valid value and unvalid lists map (1 type) - ensure an not checking function', t => {
	const type = requireFromIndex('sources/type')
	const validator = v => v === 'valid'
	const CustomType = type(validator)
	const unvalidCustomTypeValuesList = ['unvalid', 'not valid', 42, /regex/, {}]

	const ensureTypeChecking = requireFromIndex('sources/ensure-type-checking')(
		[CustomType, 'valid', unvalidCustomTypeValuesList]
	)

	function checkFunction(param){}

	const ensureFailError = t.throws(()=>{
		ensureTypeChecking(checkFunction, [
			CustomType
		])
	})

	t.is(ensureFailError.message, [
		`Missing type checking in ${stringable(checkFunction)}.`,
		`It should throws a vanille type error when the argument`,
		`at index 0 is ${stringable('unvalid')}.`,
		`Expected type error message is:\n`,
			logs.typeError({value: 'unvalid'}),
			`\n\t0) `, logs.typeErrorDetail({
				validator
			})
	].join(' '))
})

test.todo('Usage with default unvalid lists map')
test.todo('Usage with mixed custom and default unvalid lists map')