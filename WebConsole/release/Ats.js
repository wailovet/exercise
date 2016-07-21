var _Ats = (function () {
    function _Ats() {
        this.fcs = [];
    }
    _Ats.prototype.then = function (fc) {
        this.fcs.unshift(fc);
        return this;
    };
    _Ats.prototype.next = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var fc = this.fcs.pop();
        if (fc)
            fc.apply(this, args);
    };
    return _Ats;
})();
function Ats(func) {
    var ats = new _Ats();
    func(ats);
    ats.next();
}
exports.Ats = Ats;
