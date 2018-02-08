'use strict'

module.exports = function makeEnsureTypeCheckingFunction(...typeValidUnvalidsMatrix) {
	const validMap = new WeakMap()
	const unvalidsListMap = new WeakMap()

	typeValidUnvalidsMatrix.forEach(([type, valid, unvalidsList]) => {
		validMap.set(type, valid)
		unvalidsListMap.set(type, unvalidsList)
	})

	return function ensureTypeChecking(checkingFunction, signature){
		console.log(signature)

		return true
	}
}