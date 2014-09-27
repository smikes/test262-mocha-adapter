// Copyright (C) 2014, Test262 Project Authors. All rights reserved.
// This code is governed by the BSD License found in the LICENSE file.
/*global it*/
'use strict';

var assert = require('assert'),
    adapter = require('..'),
    Mocha = require('mocha'),
    mocha = new Mocha();

it('loads the test suite and runs a test', function () {
    adapter();
    assert.ok(true);
});

Mocha.interfaces['test262'] = adapter.test262;
mocha.ui('test262');

mocha.files = ['test/fixtures/S7.6_A1.2_T1.js'];

mocha.run();
