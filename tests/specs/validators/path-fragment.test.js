'use strict';

const test = require('ava')
const stringable = require('stringable')

const requireFromIndex = require('../../utils/require-from-index')

const validList = requireFromIndex('sources/validators/path-fragment.valid-list')
const unvalidList = requireFromIndex('sources/validators/path-fragment.unvalid-list')

test('Type and api', t => {
	const pathFragmentValidator = requireFromIndex('sources/validators/path-fragment')

	t.is(typeof pathFragmentValidator, 'function')
})

test('Usage from index', t => {
	const pathFragmentValidatorFromIndex = requireFromIndex('path-fragment.validator')
	const pathFragmentValidator = requireFromIndex('sources/validators/path-fragment')

	t.is(pathFragmentValidatorFromIndex, pathFragmentValidator)
})

test('Is loggable in a type', t => {
	const pathFragmentValidator = requireFromIndex('sources/validators/path-fragment')

	if (!('NYC_CONFIG' in process.env)) {
		t.true(pathFragmentValidator.toString().length < 100)
	}

	t.true(pathFragmentValidator.toString().indexOf('\n') < 0)
	t.true(pathFragmentValidator.toString().indexOf('\r') < 0)
	t.true(pathFragmentValidator.toString().indexOf('\t') < 0)
})

function validPathFragmentMacro(t, validPathFragment){
	const pathFragmentValidator = requireFromIndex('sources/validators/path-fragment')

	t.true(pathFragmentValidator(validPathFragment))
}

validPathFragmentMacro.title = (providedTitle, validPathFragment) => (
	`${providedTitle} - usage with valid path fragment - ${stringable(validPathFragment)}`
)

function unvalidPathFragmentMacro(t, unvalidPathFragment){
	const pathFragmentValidator = requireFromIndex('sources/validators/path-fragment')

	t.false(pathFragmentValidator(unvalidPathFragment))
}

unvalidPathFragmentMacro.title = (providedTitle, unvalidPathFragment) => (
	`${providedTitle} - usage with unvalid path fragment - ${stringable(unvalidPathFragment)}`
)

validList.forEach(valid => test(validPathFragmentMacro, valid))
unvalidList.forEach(unvalid => test(unvalidPathFragmentMacro, unvalid))