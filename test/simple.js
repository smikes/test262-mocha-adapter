// Copyright (C) 2014, Test262 Project Authors. All rights reserved.
// This code is governed by the BSD License found in the LICENSE file.
/*global it, describe*/
'use strict';

var assert = require('assert'),
    adapter = require('..'),
    Mocha = require('mocha'),
    mocha;

describe('overview', function () {
    it('loads the test suite and runs a test', function () {
        assert.ok(true);
    });
});

Mocha.interfaces.test262 = adapter.test262;

mocha = new Mocha();
mocha.ui('test262');
mocha.loadFiles = adapter.loadFiles;

mocha.files = ['test/fixtures/S7.6_A1.2_T1.js',
               'test/fixtures/dumb-async.js'];

mocha.run();
