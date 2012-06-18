"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    packageJSON = require("../"),
    bypass = require("../lib/bypass.js");

describe("package.json", function () {
    it("should return the bypass function", function () {
        expect(packageJSON).to.be(bypass);
    });
});