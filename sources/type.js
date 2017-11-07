'use strict';

const msg = require('@alexistessier/msg');

function type(validator){
	return function Type(value){
		if(validator(value) !== true){
			throw new TypeError(msg(
				`Value ${JSON.stringify(value)} doesn't is not of a valid type.`,
				`It doesn't match the validator ${validator.toString()}.`
			))
		}
		return value;
	}
}

module.exports = type;