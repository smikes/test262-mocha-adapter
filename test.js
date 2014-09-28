var assert = require('assert'),
    adapter = require('./'),
    Mocha = require('mocha'),
    mocha;

Mocha.interfaces.test262 = adapter.test262;

mocha = new Mocha();

mocha.loadFiles = adapter.loadFiles;

mocha.suite = new Mocha.Suite(undefined, 'parent');
var parentSuite = mocha.suite;
mocha.suite = new Mocha.Suite(mocha.suite, 'standard tests');
mocha.ui('bdd');
mocha.files = ['test/simple.js'];

mocha.suite = new Mocha.Suite(parentSuite, 'test262 fixtures');
mocha.ui('test262');

mocha.files.push('test/fixtures/S7.6_A1.2_T1.js',
               'test/fixtures/syntaxerror.js',
               'test/fixtures/dumb-async.js',
               'test/fixtures/failing.js');


mocha.run();
