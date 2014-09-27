// Copyright (C) 2014, Test262 Project Authors. All rights reserved.
// This code is governed by the BSD License found in the LICENSE file.
'use strict';

var Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test'),
    fs = require('fs'),
    path = require('path'),
    parser = require('test262-parser'),
    Runner = require('test262-harness/lib/runners/node'),
    args = { runner: 'node', threads: 1, consolePrintCommand: 'console.log' },
    runner = new Runner(args);

function makeMochaRunner(r, test) {
    return function (done) {
        r.run(test, done);
    };
}

function makeTests(file) {
    var compiled = runner.compile(file),
        t,
        tests = [],
        linked,
        test;

    for (;;) {
        t = compiled.next();
        if (t.done) {
            break;
        }
        // use t.value
        linked = runner.link(t.value);
        test = new Test(linked.attrs.description,
                            makeMochaRunner(runner, linked));
        test.file = file.file;
        tests.push(test);
    }

    return tests;
}

function pushSuite(suites, title) {
    var suite = Suite.create(suites[0], title);
    suites.unshift(suite);
}

function popSuite(suites) {
    var suite = suites.shift();
    return suite;
}

/**
 * Override loadFiles: load (but do not raw 'require') test262 files
 *
 * @api private
 */
function loadFiles() {
    var self = this,
        suite = this.suite;
    this.files.forEach(function (file) {
        file = path.resolve(file);
        suite.emit('pre-require', global, file, self);
        suite.emit('require', undefined, file, self);
        suite.emit('post-require', global, file, self);
    });
}

exports.test262 = function (suite) {
    var suites = [suite];

    suite.on('pre-require', function (context, filename, mocha) {
        /*jslint stupid:true*/
        var file = { file: filename,
                     contents: String(fs.readFileSync(filename)) },
            tests;

        file = parser.parseFile(file);

        pushSuite(suites, file.attrs.info);

        tests = makeTests(file);
        tests.forEach(function (test) { suites[0].addTest(test); });

        popSuite(suites);

        /*jslint unparam:true*/
    });
};

exports.loadFiles = loadFiles;
