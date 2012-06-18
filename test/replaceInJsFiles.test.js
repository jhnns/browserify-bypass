"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    replaceInJsFiles = require("../lib/replaceInJsFiles.js"),
    vm = require("vm");

function resetRegExp() {
    replaceInJsFiles.regExp.lastIndex = 0;
}

describe("replaceInJsFiles", function () {
    var testCases = {
            "default": [
                "// @browser a/b with whitespace/c.js\n" +
                "var test1 = require('c/b/a.js');",

                // expected
                "a/b with whitespace/c.js", "var test1 = ", ";"
            ],

            "no semicolon at the end": [
                "// @browser a/b with whitespace/c.js\n" +
                "var test2 = require('c/b/a.js')",

                // expected
                "a/b with whitespace/c.js", "var test2 = ", ""
            ],

            "no whitespace after //": [
                "//@browser a/b with whitespace/c.js\n" +
                "var test3 = require('c/b/a.js');",

                // expected
                "a/b with whitespace/c.js", "var test3 = ", ";"
            ],

            "whitespace within the browser module id": [
                "// @browser a/b with whitespace/c.js\n" +
                "var test4 = require('c/b/a.js');",

                // expected
                "a/b with whitespace/c.js", "var test4 = ", ";"
            ],

            "declaration without var and a comma at the end": [
                "var someVar,\n" +
                "// @browser a/b with whitespace/c.js\n" +
                "test5 = require('c/b/a.js')," +
                "someOtherVar;",

                // expected
                "a/b with whitespace/c.js", "test5 = ", ",someOtherVar;"
            ],

            "windows line breaks": [
                "// @browser a/b with whitespace/c.js\r\n" +
                "var test6 = require('c/b/a.js');",

                // expected
                "a/b with whitespace/c.js", "var test6 = ", ";"
            ]
        },
        numOfTests = 0,
        concatenatedTestCases;

    before(function () {
        var testCase,
            testCaseName,
            str = "";

        // Concatenate all strings
        for (testCaseName in testCases) {
            if (testCases.hasOwnProperty(testCaseName)) {
                numOfTests++;
                testCase = testCases[testCaseName];
                str += testCase[0] + "\n";
            }
        }

        concatenatedTestCases = str;
    });
    describe("#regExp", function () {
        it("should match all test cases", function () {
            var result,
                testCase,
                testCaseName,
                str;

            for (testCaseName in testCases) {
                if (testCases.hasOwnProperty(testCaseName)) {
                    resetRegExp();
                    testCase = testCases[testCaseName];
                    str = testCase[0];
                    result = replaceInJsFiles.regExp.exec(str);
                    //console.log(testCaseName);
                    //console.log(result);
                    expect(result[1]).to.be(testCase[1]);
                    expect(result[2]).to.be(testCase[2]);
                    expect(result[3]).to.be(testCase[3]);
                }
            }
        });
        it("should match all test cases if they are concatenated", function () {
            var result,
                testCase,
                testCaseName;

            resetRegExp();
            for (testCaseName in testCases) {
                if (testCases.hasOwnProperty(testCaseName)) {
                    testCase = testCases[testCaseName];
                    result = replaceInJsFiles.regExp.exec(concatenatedTestCases);
                    expect(result[1]).to.be(testCase[1]);
                    expect(result[2]).to.be(testCase[2]);
                    expect(result[3]).to.be(testCase[3]);
                }
            }
        });
    });
    describe("#replace", function () {
        it("should just replace the require path and keep the rest as it is", function () {
            var result,
                i,
                fakeModule = {},
                context = {
                    require: function (path) {
                        expect(path).to.be("a/b with whitespace/c.js"); // every require should now be called with "a/b with whitespace/c.js"
                        return fakeModule;
                    }
                };

            // no regExp reset here, because replace() should do this for us
            result = replaceInJsFiles.replace(concatenatedTestCases);
            vm.runInNewContext(result, context);    // if the JavaScript is not valid, this will throw a SyntaxError
            for (i = 1; i <= numOfTests; i++) {
                expect(context["test" + i]).to.be(fakeModule); // check if every require returned the fake module
            }
        });
    });
});