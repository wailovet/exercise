var System_1 = require("./System");
var Display = (function () {
    function Display() {
        this._data = [];
    }
    Display.prototype.clean = function () {
        console.log("clean");
    };
    Display.prototype.get = function () {
        return this._data;
    };
    Display.prototype.data = function (data) {
        this._data = data;
        return this;
    };
    Display.prototype.flush = function () {
    };
    Display.prototype.start = function () {
        var _this = this;
        setInterval(function () {
            //
            //if (window['Canvasdata']) {
            //    window['Canvasdata'](_this._data);
            //} else {
            {
                var str = "\n\n";
                for (var k = 0; k < 32; k++) {
                    for (var i = 0; i < 64; i++) {
                        if (_this._data[k * 64 + i] == 1) {
                            str += "*";
                        }
                        else {
                            str += " ";
                        }
                    }
                    str += "\n";
                }
                System_1.System.print(str);
            }
        }, 1000 / 59);
    };
    return Display;
})();
exports.Display = Display;
