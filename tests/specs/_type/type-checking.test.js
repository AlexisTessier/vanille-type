'use strict'

const test = require('ava')
const sinon = require('sinon')

const stringable = require('stringable')

const requireFromIndex = require('../../utils/require-from-index')

const logs = requireFromIndex('sources/settings/logs')
const ensureTypeChecking = requireFromIndex('ensure-type-checking')

test.skip('Trying to create type without parameters should throw an error', t => {
	const type = requireFromIndex('sources/type')
});
test.todo('Trying to create type with wrong parameters should throw an error');
test.todo('Trying to create a type with unvalid validators arguments');

/*-----------*/

function typePathModifierFromATypeWithUnvalidPath(t, unvalidPath) {
	const type = requireFromIndex('sources/type')
	const PathFragment = requireFromIndex('sources/validators/path-fragment')

	const validator = sinon.spy(v => true)

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const unvalidPathError = t.throws(()=>{
		BaseType.path(unvalidPath)
	})

	t.true(unvalidPathError instanceof TypeError)
	t.is(unvalidPathError.message, [
		logs.typeError({value: unvalidPath}),
		`\n\t0) `, logs.typeErrorDetail({
			validator: PathFragment
		})
	].join(''));
}

typePathModifierFromATypeWithUnvalidPath.title = (providedTitle, unvalidValue) => (
	`type path modifier - from a type - usage with unvalid path ${stringable(unvalidValue)}`
)

test(typePathModifierFromATypeWithUnvalidPath)
test(typePathModifierFromATypeWithUnvalidPath, /regex/)
test(typePathModifierFromATypeWithUnvalidPath, [])
test(typePathModifierFromATypeWithUnvalidPath, ['v', 30])
test(typePathModifierFromATypeWithUnvalidPath, {})
test(typePathModifierFromATypeWithUnvalidPath, {k: 'v'})
test(typePathModifierFromATypeWithUnvalidPath, null)
// eslint-disable-next-line func-names
test(typePathModifierFromATypeWithUnvalidPath, function(){ return; })
test(typePathModifierFromATypeWithUnvalidPath, true)
test(typePathModifierFromATypeWithUnvalidPath, false)

test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

test.todo('type path modifier - from a type - validator returns true - usage with empty path')
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

test.todo('type path modifier - from a type - validator returns true - usage with blank path')
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')