'use strict';

const test = require('ava');

const fs = require('fs');
const path = require('path');

const pathFromIndex = require('../utils/path-from-index');
const requireFromIndex = require('../utils/require-from-index');

function featureHasTestFileMacro(t, testFilename) {
	t.plan(1);

	return new Promise(resolve => {
		fs.access(path.join(__dirname, '_type', `${testFilename}.test.js`), err => {
			if (err) {t.fail(`The feature should be tested in a specific file. "${testFilename}" wasn't found (${err.message})`);}
			t.pass();
			resolve();
		});
	});
}

featureHasTestFileMacro.title = providedTitle => (
	`Feature has a test file - ${providedTitle}`)

/*-----------------------*/

test('Type and API', t => {
	const type = requireFromIndex('sources/type');
	const typeFromIndex = requireFromIndex('index');

	t.is(typeof type, 'function');
	t.is(typeFromIndex, type);
});

/*-----------------------*/

test('Basic usage', featureHasTestFileMacro, 'basic-usage');
test('Path modifier', featureHasTestFileMacro, 'path-modifier');
test('Named types', featureHasTestFileMacro, 'named-types');
test('Not modifier', featureHasTestFileMacro, 'not-modifier');
test('Validator and match helpers', featureHasTestFileMacro, 'validator-and-match-helpers');
test('Type creation helpers', featureHasTestFileMacro, 'type-creation-helpers');
test('Built in types', featureHasTestFileMacro, 'built-in-types');
test('Type checking', featureHasTestFileMacro, 'type-checking');