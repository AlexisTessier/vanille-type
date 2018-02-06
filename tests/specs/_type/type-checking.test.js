'use strict'

const test = require('ava')

const stringable = require('stringable')

const requireFromIndex = require('../../utils/require-from-index');

const ensureTypeChecking = requireFromIndex('ensure-type-checking')

test.skip('Trying to create type without parameters should throw an error', t => {
	const type = requireFromIndex('sources/type');

	ensureTypeChecking({
		method: type,
		tuple: []
	})
});
test.todo('Trying to create type with wrong parameters should throw an error');
test.todo('Trying to create a type with unvalid validators arguments');

/*-----------*/

function typePathModifierFromATypeWithUnvalidPath(t, unvalidPath) {
	const type = requireFromIndex('sources/type')

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
			validator
		})
	].join(''));
}

typePathModifierFromATypeWithUnvalidPath.title = (providedTitle, unvalidValue) => (
	`type path modifier - from a type - usage with unvalid path ${stringable(unvalidValue)}`
)

test.skip(typePathModifierFromATypeWithUnvalidPath)
test.skip(typePathModifierFromATypeWithUnvalidPath, /regex/)
test.skip(typePathModifierFromATypeWithUnvalidPath, [])
test.skip(typePathModifierFromATypeWithUnvalidPath, ['v', 30])
test.skip(typePathModifierFromATypeWithUnvalidPath, {})
test.skip(typePathModifierFromATypeWithUnvalidPath, {k: 'v'})
test.skip(typePathModifierFromATypeWithUnvalidPath, null)
test.skip(typePathModifierFromATypeWithUnvalidPath, function(){ return; })
test.skip(typePathModifierFromATypeWithUnvalidPath, true)
test.skip(typePathModifierFromATypeWithUnvalidPath, false)

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