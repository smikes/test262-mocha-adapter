// Copyright 2014 Ecma International.  All rights reserved.
// Ecma International makes this code available under the terms and conditions set
// forth on http://hg.ecmascript.org/tests/test262/raw-file/tip/LICENSE (the
// "Use Terms").   Any redistribution of this code must retain the above
// copyright and this notice and otherwise comply with the Use Terms.

/*---
description: Async tests work under mocha
info: simple async test
es5id: 25.4.4.1_A2.3_T3
author: Sam Mikes
---*/

setTimeout(function () {
    $DONE();
}, 100);
