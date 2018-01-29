'use strict';

const test = require('ava');
const sinon = require('sinon');
const clone = require('clone');

const requireFromIndex = require('../../utils/require-from-index');

const logs = requireFromIndex('sources/settings/logs');

test('type path modifier - from a type - type and api', t => {
	const type = requireFromIndex('sources/type');

	const AType = type(v => true);

	t.is(typeof AType.path, 'function');
});

test('type path modifier - from type function - type and api', t => {
	const type = requireFromIndex('sources/type');

	t.is(typeof type.path, 'function');
});

/*---------------*/

test('type path modifier - from a type - validator returns true - usage with simple key', t => {
	const type = requireFromIndex('sources/type')

	const validator = sinon.spy(v => true)

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const Type = BaseType.path('OKey')

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const OKey = { test: 't', keykey: 'key val' }
	const value = {
		OKey, otherKey: { other: 'key' }
	}
	const expectedTypedValue = clone(value)

	t.true(validator.notCalled)

	const typedValue = Type(value)
	t.is(typedValue, value)
	t.deepEqual(typedValue, expectedTypedValue)

	t.true(validator.calledOnce)
	t.true(validator.withArgs(OKey).calledOnce)
})

test('type path modifier - from a type - validator returns false - usage with simple key', t => {
	const type = requireFromIndex('sources/type')

	const validator = v => false

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const Type = BaseType.path('BKey')

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const BKey = { test: 't', num: 42 }
	const value = {
		BKey, otherKey: { other2: 'key2' }
	}

	const unvalidTypeError = t.throws(()=>{
		Type(value)
	});

	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - BKey) `, logs.pathTypeErrorDetail({path: 'BKey', validator})
	].join(''));
})

test('type path modifier - from a type - validator throws error - usage with simple key', t => {
	const type = requireFromIndex('sources/type')

	const validator = v => {
		throw new Error('An error message test')
	}

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const Type = BaseType.path('k')

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const k = { test: 't', num: 42 }
	const value = {
		k, test: { t: 'tv' }
	}

	const unvalidTypeError = t.throws(()=>{
		Type(value)
	});

	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - k) `, logs.pathTypeErrorDetail({
			path: 'k',
			validator,
			errorMessage: 'An error message test'
		})
	].join(''));
})

test('type path modifier - from type function - validator returns true - usage with simple key', t => {
	const type = requireFromIndex('sources/type')

	const typeOfPath = type.path('aKey')

	t.is(typeof typeOfPath, 'function')

	const validator = sinon.spy(v => true)

	const Type = typeOfPath(validator)

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const aKey = { key: 'name', test: 'test' }
	const value = {
		aKey, bKey: { other: 'key' }
	}
	const expectedTypedValue = clone(value)

	t.true(validator.notCalled)

	const typedValue = Type(value)
	t.is(typedValue, value)
	t.deepEqual(typedValue, expectedTypedValue)

	t.true(validator.calledOnce)
	t.true(validator.withArgs(aKey).calledOnce)
})

test('type path modifier - from type function - validator returns false - usage with simple key', t => {
	const type = requireFromIndex('sources/type')

	const typeOfPath = type.path('bk')

	t.is(typeof typeOfPath, 'function')

	const validator = v => false

	const Type = typeOfPath(validator)

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const bk = { kn: 42, t: 'value' }
	const value = {
		ak: { test: 'test' }, bk
	}

	const unvalidTypeError = t.throws(()=>{
		Type(value)
	});

	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - bk) `, logs.pathTypeErrorDetail({
			path: 'bk',
			validator
		})
	].join(''));
})

test('type path modifier - from type function - validator throws error - usage with simple key', t => {
	const type = requireFromIndex('sources/type')

	const typeOfPath = type.path('keyname')

	t.is(typeof typeOfPath, 'function')

	const validator = v => {
		throw new Error('A test error message test')
	}

	const Type = typeOfPath(validator)

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const keyname = { kn: 42, t: 'value' }
	const value = {
		keyname, t: 42
	}

	const unvalidTypeError = t.throws(()=>{
		Type(value)
	});

	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - keyname) `, logs.pathTypeErrorDetail({
			path: 'keyname',
			validator,
			errorMessage: 'A test error message test'
		})
	].join(''));
})

/*---------------*/

test('type path modifier - from a type - validator returns true - usage with 2 fragments path', t => {
	const type = requireFromIndex('sources/type')

	const validator = sinon.spy(v => true)

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const AType = BaseType.path('AK', 'nestKey')

	t.is(typeof AType, 'function')
	t.is(AType.name, 'Type')

	const nestKey = { test: 42 }
	const AK = { test: 't', nestKey }
	const value = {
		AK, t: { other: 'key' }
	}
	const expectedTypedValue = clone(value)

	t.true(validator.notCalled)

	const typedValue = AType(value)
	t.is(typedValue, value)
	t.deepEqual(typedValue, expectedTypedValue)

	t.true(validator.calledOnce)
	t.true(validator.withArgs(nestKey).calledOnce)
})

test('type path modifier - from a type - validator returns false - usage with 2 fragments path', t => {
	const type = requireFromIndex('sources/type')

	const validator = v => false

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const AType = BaseType.path('BK', 'bNestKey')

	t.is(typeof AType, 'function')
	t.is(AType.name, 'Type')

	const bNestKey = { val: 'test' }
	const BK = { n: 38, bNestKey }
	const value = {
		BK, t: 56
	}

	const unvalidTypeError = t.throws(()=>{
		AType(value)
	});

	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - BK.bNestKey) `, logs.pathTypeErrorDetail({
			path: 'BK.bNestKey',
			validator
		})
	].join(''));
})

test('type path modifier - from a type - validator throws error - usage with 2 fragments path', t => {
	const type = requireFromIndex('sources/type')

	const validator = v => {
		throw new Error('error message test')
	}

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const AType = BaseType.path('other', 'nesting')

	t.is(typeof AType, 'function')
	t.is(AType.name, 'Type')

	const nesting = 13
	const other = { n: 38, nesting }
	const value = { other }

	const unvalidTypeError = t.throws(()=>{
		AType(value)
	});

	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - other.nesting) `, logs.pathTypeErrorDetail({
			path: 'other.nesting',
			validator,
			errorMessage: 'error message test'
		})
	].join(''));
})

test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - usage with deep path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - chained usage', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - deep chained usage', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - usage with unvalid path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - usage with empty path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - usage with blank path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - usage with simple key - undefined key', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - usage with 2 fragment path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.skip('type path modifier - from a type - validator returns true - usage with deep path - inexistent path', t => {
	const type = requireFromIndex('sources/type');

	const validator = sinon.spy(v => true);
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.todo('ensure path is not modified')
test.todo('many types variants')
test.todo('many validators variants')
test.todo('nested types variants')
test.todo('unvalid path arguments')
test.todo('complex usage without error')
test.todo('complex usage with an error')