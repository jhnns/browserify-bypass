browserify-bypass
=================

A node.js [browserify](https://github.com/substack/node-browserify) middleware to declare alternative requires for
the browser.

-----------------------------------------------------------------
<br />

Installation
------------

`npm install browserify-bypass`

-----------------------------------------------------------------
<br />

Example
--------

To declare an alternative require for the browser write `// @browser ./path/to/browserModule.js` one line above the
 require statement:

```javascript

// @browser ./browserModule.js
var myModule = require("./nodeModule.js");
```

To generate the browserified module just do this:

```javascript

var b = require("browserify");

b(); // init browserify with default options
b.use(require("browserify-bypass"));
b.require("./testModule.js");
```

The browserified module will now look like this:

```javascript

var myModule = require("./browserModule.js");
```