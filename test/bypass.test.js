"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    bypass = require("../lib/bypass.js"),
    browserify = require("browserify"),
    fs = require("fs"),
    vm = require("vm");

describe("bypass", function () {
    it("should replace the require in testModules/js/entry.js", function () {
        var b = browserify(),
            context = {},
            src;

        b.use(bypass);
        b.require(__dirname + "/testModules/js/entry.js");
        b.append("var testString = require('/entry.js');");
        src = b.bundle();
        vm.runInNewContext(src, context);
        expect(context.testString).to.be(require("./testModules/js/browser.js"));
    });
});

