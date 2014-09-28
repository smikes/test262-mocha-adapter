// Copyright (C) 2014, Test262 Project Authors. All rights reserved.
// This code is governed by the BSD License found in the LICENSE file.
'use strict';

var Suite = require('mocha/lib/suite'),
    Test = require('mocha/lib/test'),
    Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    parser = require('test262-parser'),
    Runner = require('test262-harness/lib/runners/node'),
    args = { runner: 'node', threads: 1, consolePrintCommand: 'console.log' },
    runner = new Runner(args);

function makeMochaRunner(r, test) {
    return function (done) {
        r.run(test, function (arg) {
            var pass;
            if (arg) {
                if (test.attrs.negative) {
                    pass = String(arg).match(new RegExp(test.attrs.negative));
                } else {
                    pass = false;
                }
            } else {
                pass = true;
            }
            if (pass) {
                done();
            } else {
                done(new Error(String(arg)));
            }
        });
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
        if (file.match(/fixture/)) {
            suite.emit('require', undefined, file, self);
        } else {
            suite.emit('require', require(file), file, self);
        }
        suite.emit('post-require', global, file, self);
    });
}


exports.test262 = function (suite) {
    var suites = [suite];

    suite.noRequire = true;

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
        context.nextTick = process.nextTick;

        context.describe = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.file = file;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
      return suite;
    };
        context.it =  function(title, fn){
      var suite = suites[0];
      if (suite.pending) var fn = null;
      var test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);
      return test;
    };

    });
};


exports.loadFiles = loadFiles;
