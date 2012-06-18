"use strict"; // run code in ES5 strict mode

var regExp = /\/\/ *@browser (.+?)\s+(.*)require\(.*\)([^\s]*)/g;

function replace(src) {
     // Reset the regular expression.
     // Needed because of the global flag
    regExp.lastIndex = 0;

    return src.replace(regExp, '$2require("$1")$3');
}

exports.replace = replace;
exports.regExp = regExp;