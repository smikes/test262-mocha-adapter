// Copyright (C) 2014, Test262 Project Authors. All rights reserved.
// This code is governed by the BSD License found in the LICENSE file.
/*global it*/
'use strict';

var assert = require('assert'),
    adapter = require('..');

it('loads the test suite and runs a test', function () {
    adapter();
    assert.ok(true);
});
