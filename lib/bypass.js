"use strict"; // run code in ES5 strict mode

var replaceInJsFiles = require("./replaceInJsFiles.js");

function bypass(browserify) {
    browserify.register(".js", replaceInJsFiles.replace);
}

module.exports = bypass;