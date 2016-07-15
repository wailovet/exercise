"use strict";
var System = (function () {
    function System() {
    }
    System.print = function (str) {
        console.log(str);
    };
    System.load = function (filename) {
        var fs = require("fs");
        var data;
        if (fs.readFileSync) {
            data = fs.readFileSync(filename);
        }
        else {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", filename, false);
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
            xhr.send(null);
            function str2ab(str) {
                var buf = new ArrayBuffer(str.length); // 2 bytes for each char
                for (var i = 0, strLen = str.length; i < strLen; i++) {
                    buf[i] = str.charCodeAt(i) & 0x00FF;
                }
                return buf;
            }
            data = str2ab(xhr.response);
        }
        return data;
    };
    System.run_num = 0;
    return System;
}());
exports.System = System;
