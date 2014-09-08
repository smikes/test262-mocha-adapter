// Copyright (C) 2014, Test262 Project Authors. All rights reserved.
// This code is governed by the BSD License found in the LICENSE file.
/*global it*/
'use strict';

var assert = require('assert'),
    adapter = require('..'),
    Mocha = require('mocha'),
    mocha = new Mocha(),
    test262Bdd;

it('loads the test suite and runs a test', function () {
    adapter();
    assert.ok(true);
});

test262Bdd = function (suite) {
    suite.on('pre-require', function (context, file, mocha) {

        context.it = function (title, fn) {
        };
    });
};

Mocha.interfaces['test262-bdd'] = test262Bdd;
mocha.ui('test262-bdd');

