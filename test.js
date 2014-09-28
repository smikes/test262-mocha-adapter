var assert = require('assert'),
    adapter = require('./'),
    Mocha = require('mocha'),
    mocha;

Mocha.interfaces.test262 = adapter.test262;

mocha = new Mocha();
mocha.loadFiles = adapter.loadFiles;
mocha.ui('test262');

mocha.files = ['test/fixtures/S7.6_A1.2_T1.js',
               'test/fixtures/syntaxerror.js',
               'test/fixtures/dumb-async.js'];


mocha.run();
