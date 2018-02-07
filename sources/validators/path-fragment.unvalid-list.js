'use strict'

module.exports = [
	undefined,
	null,
	/* istanbul ignore next */
	()=>{return;},
	{},
	{key: 'value'},
	[],
	['value', 42],
	/* istanbul ignore next */
	// eslint-disable-next-line func-names
	function(){return;},
	/* istanbul ignore next */
	function named(){return;},
	/regex/,
	NaN,
	true,
	false
]