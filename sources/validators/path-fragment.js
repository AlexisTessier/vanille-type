'use strict'

const pathFragment = v => typeof v === 'string' || typeof v === 'symbol' || (typeof v === 'number' && !isNaN(v))

module.exports = pathFragment