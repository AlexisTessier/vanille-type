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

test('type path modifier - from type function - validator returns true - usage with 2 fragments path', t=>{
	const type = requireFromIndex('sources/type')

	const validator = sinon.spy(v => true)

	const TypeWithPath = type.path('k2', 'k3')

	t.is(typeof TypeWithPath, 'function')
	t.is(TypeWithPath.name, '')

	const Type = TypeWithPath(validator)

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const k3 = { test: 42 }
	const k2 = { test: 't', k3 }
	const value = {
		k2, t: { other: 'key' }
	}
	const expectedTypedValue = clone(value)

	t.true(validator.notCalled)

	const typedValue = Type(value)
	t.is(typedValue, value)
	t.deepEqual(typedValue, expectedTypedValue)

	t.true(validator.calledOnce)
	t.true(validator.withArgs(k3).calledOnce)
})

test('type path modifier - from type function - validator returns false - usage with 2 fragments path', t=>{
	const type = requireFromIndex('sources/type')

	const validator = v => false

	const TypeWithPath = type.path('akey', 'anotherkey')

	t.is(typeof TypeWithPath, 'function')
	t.is(TypeWithPath.name, '')

	const Type = TypeWithPath(validator)

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const anotherkey = { test: 42 }
	const akey = { test: 't', anotherkey }
	const value = { akey }

	const unvalidTypeError = t.throws(()=>{
		Type(value)
	})
	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - akey.anotherkey) `, logs.pathTypeErrorDetail({
			path: 'akey.anotherkey',
			validator
		})
	].join(''));
})

test('type path modifier - from type function - validator throws error - usage with 2 fragments path', t=>{
	const type = requireFromIndex('sources/type')

	const validator = v => {
		throw new Error('err msg')
	}

	const TypeWithPath = type.path('akey', 'anotherkey')

	t.is(typeof TypeWithPath, 'function')
	t.is(TypeWithPath.name, '')

	const Type = TypeWithPath(validator)

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const anotherkey = { test: 42 }
	const akey = { test: 't', anotherkey }
	const value = { akey }

	const unvalidTypeError = t.throws(()=>{
		Type(value)
	})
	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - akey.anotherkey) `, logs.pathTypeErrorDetail({
			path: 'akey.anotherkey',
			validator,
			errorMessage: 'err msg'
		})
	].join(''));
})

/*---------------*/

test('type path modifier - from a type - validator returns true - usage with deep path', t => {
	const type = requireFromIndex('sources/type')

	const validator = sinon.spy(v => true)

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const Type = BaseType.path('a', 'b', 'c', 'd', 'e')

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const e = { n: 'test' }
	const value = { a: { b: { c: { d: { e } } } } };
	const expectedTypedValue = clone(value)

	t.true(validator.notCalled)

	const typedValue = Type(value)
	t.is(typedValue, value)
	t.deepEqual(typedValue, expectedTypedValue)

	t.true(validator.calledOnce)
	t.true(validator.withArgs(e).calledOnce)
});

test('type path modifier - from a type - validator returns false - usage with deep path', t => {
	const type = requireFromIndex('sources/type')

	const validator = v => false

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const Type = BaseType.path('i', 'j', 'k', 'l', 'm')

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const m = { n: 'test' }
	const value = { i: { j: { k: { l: { m } } } } }

	const unvalidTypeError = t.throws(()=>{
		Type(value)
	});
	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - i.j.k.l.m) `, logs.pathTypeErrorDetail({
			path: 'i.j.k.l.m',
			validator
		})
	].join(''));
});

test('type path modifier - from a type - validator throws error - usage with deep path', t => {
	const type = requireFromIndex('sources/type')

	const validator = v => {
		throw new Error('validator err msg')
	}

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const Type = BaseType.path('n', 'o', 'p', 'q', 'r')

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const r = { s: 'test' }
	const value = { n: { o: { p: { q: { r } } } } }

	const unvalidTypeError = t.throws(()=>{
		Type(value)
	});
	t.true(unvalidTypeError instanceof TypeError)
	t.is(unvalidTypeError.message, [
		logs.typeError({value}),
		`\n\t0 - n.o.p.q.r) `, logs.pathTypeErrorDetail({
			path: 'n.o.p.q.r',
			validator,
			errorMessage: 'validator err msg'
		})
	].join(''));
});
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test('type path modifier - from a type - validator returns true - chained usage', t => {
	const type = requireFromIndex('sources/type')

	const validator = sinon.spy(v => true)

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const Type = BaseType.path('one').path('two', 'three')

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const three = { t: 42 }
	const value = { one : { two : { three } } }
	const expectedTypedValue = clone(value)

	t.true(validator.notCalled)

	const typedValue = Type(value)
	t.is(typedValue, value)
	t.deepEqual(typedValue, expectedTypedValue)

	t.true(validator.calledOnce)
	t.true(validator.withArgs(three).calledOnce)
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test('type path modifier - from a type - validator returns true - deep chained usage', t => {
	const type = requireFromIndex('sources/type')

	const validator = sinon.spy(v => true)

	const BaseType = type(validator)

	t.is(typeof BaseType, 'function')
	t.is(BaseType.name, 'Type')

	const Type = BaseType
		.path('a', 'b')
		.path('c', 'd', 'e')
		.path('f', 'g')
		.path('h', 'i', 'j', 'k')
		.path('l', 'm', 'n')
		.path('o')

	t.is(typeof Type, 'function')
	t.is(Type.name, 'Type')

	const o = { n: 32 }
	const value = {a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{l:{m:{n:{o}}}}}}}}}}}}}}}
	const expectedTypedValue = clone(value)

	t.true(validator.notCalled)

	const typedValue = Type(value)
	t.is(typedValue, value)
	t.deepEqual(typedValue, expectedTypedValue)

	t.true(validator.calledOnce)
	t.true(validator.withArgs(o).calledOnce)
});
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.todo('type path modifier - from a type - validator returns true - usage with unvalid path')
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.todo('type path modifier - from a type - validator returns true - usage with empty path')
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.todo('type path modifier - from a type - validator returns true - usage with blank path')
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.todo('type path modifier - from a type - validator returns true - usage with simple key - undefined key')
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.todo('type path modifier - from a type - validator returns true - usage with 2 fragment path - inexistent path')
test.todo('validator returns false variant')
test.todo('validator throws error variant')
test.todo('from type function variant')
test.todo('validator returns false variant')
test.todo('validator throws error variant')

/*---------------*/

test.todo('type path modifier - from a type - validator returns true - usage with deep path - inexistent path')
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