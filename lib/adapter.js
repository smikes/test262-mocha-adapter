// Copyright (C) 2014, Test262 Project Authors. All rights reserved.
// This code is governed by the BSD License found in the LICENSE file.
'use strict';

var Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test'),
    fs = require('fs'),
    parser = require('test262-parser'),
    Runner = require('test262-harness/lib/runners/node'),
    args = { runner: 'node', threads: 1, consolePrintCommand: 'console.log' },
    runner = new Runner(args);

module.exports = function () {
}

module.exports.test262 = function (suite) {
    var suites = [suite];

    suite.on('pre-require', function (context, filename, mocha) {
        var file = { file: filename,
                     contents: String(fs.readFileSync(filename)) };

        file = parser.parseFile(file);

        var suite = Suite.create(suites[0], file.attrs.info);
        console.log('pre-require ' + file + " " + file.attrs.info);

        var tests = makeTests(file);
        tests.forEach(function (test) { suite.addTest(test); });
    });
};

function makeTests(file) {
    var compiled = runner.compile(file),
        t,
        tests = [];

    for (;;) {
        t = compiled.next();
        if (t.done) {
            break;
        }
        // use t.value
        var linked = runner.link(t.value);
        var test = new Test(linked.attrs.description,
                            makeMochaRunner(runner, linked));
        test.file = file.file;
        tests.push(test);
    }
    
    return tests;
}

function makeMochaRunner(r, test) {
    return function(done) {
        r.run(test, done);
    };
}


