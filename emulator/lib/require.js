// Usage
//
//   require.register("browser/debug.js", function(module, exports, require){
//     // Module code goes here
//   });
//
//   var debug = require("browser/debug.js");

function require(p) {
    console.log(    window.exports[p.split("/")[1]]);
    return window.exports[p.split("/")[1]];
}
window.exports = {};