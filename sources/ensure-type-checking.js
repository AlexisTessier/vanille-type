'use strict'

const {
	missingTypeChecking: MIS_TYP_CHK
} = require('./settings/logs')

const typesValidatorsMap = require('./types-validators-map')

module.exports = function makeEnsureTypeCheckingFunction(...typeValidUnvalidsMatrix) {
	const validMap = new WeakMap()
	const unvalidsListMap = new WeakMap()

	typeValidUnvalidsMatrix.forEach(([type, valid, unvalidsList]) => {
		validMap.set(type, valid)
		unvalidsListMap.set(type, unvalidsList)
	})

	return function ensureTypeChecking(checkingFunction, ...signature){
		signature.forEach((testedArgumentType, i) => {
			unvalidsListMap.get(testedArgumentType).forEach(unvalidValue => {
				const checkingArguments = signature.map((argumentsType, j) => (
					i === j ? unvalidValue : validMap.get(argumentsType)
				))

				let err = null
				try{
					checkingFunction(...checkingArguments)
				} catch(_err){
					err = _err
				}

				if (err === null) {
					throw new Error(MIS_TYP_CHK({
						checkingFunction,
						index: i,
						validator: typesValidatorsMap.get(testedArgumentType)[0],
						unvalidValue
					}))
				}
			})
		})

		return true
	}
}