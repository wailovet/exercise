var Base = (function () {
    function Base() {
        this.style = {
            fillStyle: "#000000",
            strokeStyle: "#000000",
            shadowColor: "#000000",
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            lineCap: "butt",
            lineJoin: "miter",
            lineWidth: 1,
            miterLimit: 10,
        };
    }
    return Base;
})();
var Canvas = (function () {
    function Canvas(canvas) {
        this.update_id = 0;
        var doubleBufferedCanvas = new DoubleBufferedCanvas(canvas);
        this.canvas_element = doubleBufferedCanvas.getCanvas();
        this.context = this.canvas_element.getContext("2d");
        this.lines = [];
    }
    Canvas.prototype.addLine = function (start, end) {
        var start_point = new Point(start.x, start.y);
        var end_point = new Point(end.x, end.y);
        var line = new Line(start_point, end_point);
        this.lines.push(line);
        return this.lines.length - 1;
    };
    Canvas.prototype.getLine = function (id) {
        return this.lines[id];
    };
    Canvas.prototype.removeLine = function (id) {
        delete this.lines[id];
    };
    Canvas.prototype.autoUpdate = function (ms) {
        var _this = this;
        if (ms === void 0) { ms = 16; }
        if (this.update_id != 0) {
            throw "重复运行";
        }
        this.update_id = setInterval(function () {
            var lines = _this.lines;
            for (var i in lines) {
                lines[i].update(ms);
            }
            _this.update();
        }, ms);
    };
    Canvas.prototype.update = function () {
        var ctx = this.context;
        var lines = this.lines;
        ctx.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
        ctx.beginPath();
        for (var i in lines) {
            var line = lines[i];
            var sx = line.getStartPoint().x;
            var sy = line.getStartPoint().y;
            var ex = line.getEndPoint().x;
            var ey = line.getEndPoint().y;
            var style = line.style;
            for (var k in style) {
                ctx[k] = style[k];
            }
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
        }
        ctx.stroke();
    };
    return Canvas;
})();
var DoubleBufferedCanvas = (function () {
    function DoubleBufferedCanvas(canvas) {
        var _this = this;
        this.hash = {};
        this.origin_canvas = canvas;
        this.clone_canvas = document.createElement("canvas");
        this.clone_canvas.width = canvas.width;
        this.clone_canvas.height = canvas.height;
        var content = this.clone_canvas.getContext("2d");
        content._stroke = content.stroke;
        content.stroke = function () {
            content.clearRect(0, 0, _this.clone_canvas.width, _this.clone_canvas.height);
            console.log("content.stroke");
            content._stroke();
            //this.origin_canvas.getContext("2d").stroke();
            _this.write();
        };
    }
    DoubleBufferedCanvas.prototype.write = function () {
        var write_map = this.cutting();
        for (var i = 0; i < write_map.length; i++) {
            var map = write_map[i];
            this.origin_canvas.getContext("2d").drawImage(this.clone_canvas, map.x, map.y, 100, 100, map.x, map.y, 100, 100);
        }
        //console.log(md5(this.clone_canvas.getContext("2d").getImageData(0,0,100,100).data));
        //console.log((this.clone_canvas.getContext("2d").getImageData(0,0,100,100)).data);
        //this.origin_canvas.getContext("2d").clearRect(0,0,this.clone_canvas.width,this.clone_canvas.height);
        //this.origin_canvas.getContext("2d").drawImage(this.clone_canvas,0,0,this.clone_canvas.width,this.clone_canvas.height);
    };
    DoubleBufferedCanvas.prototype.getCanvas = function () {
        return this.clone_canvas;
    };
    DoubleBufferedCanvas.prototype.cutting = function () {
        var width = this.clone_canvas.width;
        var height = this.clone_canvas.height;
        var ret = [];
        for (var y = 0; y < height; y += height / 2) {
            for (var x = 0; x < width; x += width / 2) {
                if (!this.hash[y * width + x]) {
                    this.hash[y * width + x] = "0";
                }
                else {
                    var data = this.clone_canvas.getContext("2d").getImageData(x, y, height / 2, width / 2).data;
                    var md5_data = md5(data);
                    if (md5_data != this.hash[y * width + x]) {
                        this.hash[y * width + x] = md5_data;
                        ret.push({ x: x, y: y });
                    }
                    else {
                        console.log(y + "|" + x);
                    }
                }
            }
        }
        return ret;
    };
    return DoubleBufferedCanvas;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(start_point, end_point) {
        _super.call(this);
        this.animations_fun = [];
        this.start_point = start_point;
        this.end_point = end_point;
    }
    Line.prototype.getStartPoint = function () {
        return this.start_point;
    };
    Line.prototype.getEndPoint = function () {
        return this.end_point;
    };
    //距离上一次更新毫秒数
    Line.prototype.update = function (ms) {
        for (var i in this.animations_fun) {
            this.start_point.x += (this.animations_fun[i].dsp.x * ms);
            this.start_point.y += (this.animations_fun[i].dsp.y * ms);
            this.end_point.x += (this.animations_fun[i].dep.x * ms);
            this.end_point.y += (this.animations_fun[i].dep.y * ms);
            var dstyle = this.animations_fun[i].dstyle;
            for (var k in dstyle) {
                if (System.isNumber(this.style[k])) {
                    this.style[k] += dstyle[k] * ms;
                }
            }
            this.animations_fun[i].step += ms;
            if (this.animations_fun[i].step >= this.animations_fun[i].ms) {
                if (this.animations_fun[i].new_arg.start_point) {
                    this.start_point.x = this.animations_fun[i].new_arg.start_point.x;
                    this.start_point.y = this.animations_fun[i].new_arg.start_point.y;
                }
                if (this.animations_fun[i].new_arg.end_point) {
                    this.end_point.x = this.animations_fun[i].new_arg.end_point.x;
                    this.end_point.y = this.animations_fun[i].new_arg.end_point.y;
                }
                if (this.animations_fun[i].callback) {
                    this.animations_fun[i].callback();
                }
                delete this.animations_fun[i];
            }
        }
    };
    Line.prototype.animationStyle = function (style, ms, callback) {
        if (style === void 0) { style = {}; }
        if (ms === void 0) { ms = 1000; }
        if (callback === void 0) { callback = null; }
        var new_arg = {
            start_point: null,
            end_point: null,
            style: style
        };
        this.animation(new_arg, ms, callback);
    };
    Line.prototype.move = function (start_point, end_point, ms, callback) {
        if (start_point === void 0) { start_point = null; }
        if (end_point === void 0) { end_point = null; }
        if (ms === void 0) { ms = 1000; }
        if (callback === void 0) { callback = null; }
        var new_arg = {
            start_point: start_point,
            end_point: end_point,
            style: {}
        };
        this.animation(new_arg, ms, callback);
    };
    Line.prototype.animation = function (new_arg, ms, callback) {
        if (new_arg === void 0) { new_arg = {
            start_point: null,
            end_point: null,
            style: {}
        }; }
        if (ms === void 0) { ms = 1000; }
        if (callback === void 0) { callback = null; }
        var dstyle = {};
        for (var i in new_arg.style) {
            if (System.isNumber(this.style[i])) {
                dstyle[i] = (new_arg.style[i] - this.style[i]) / ms;
            }
        }
        var dsp = {
            x: 0,
            y: 0
        };
        if (new_arg.start_point) {
            dsp.x = (new_arg.start_point.x - this.start_point.x) / ms;
            dsp.y = (new_arg.start_point.y - this.start_point.y) / ms;
        }
        var dep = {
            x: 0,
            y: 0
        };
        if (new_arg.end_point) {
            dep.x = (new_arg.end_point.x - this.end_point.x) / ms;
            dep.y = (new_arg.end_point.y - this.end_point.y) / ms;
        }
        this.animations_fun.push({
            new_arg: new_arg,
            dstyle: dstyle,
            dsp: dsp,
            dep: dep,
            ms: ms,
            step: 0,
            callback: callback
        });
    };
    return Line;
})(Base);
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
})();
/**
 * Created by Administrator on 2016/6/17.
 */
var System = (function () {
    function System() {
    }
    System.rand = function (min, max) {
        var t;
        System.x ^= System.x << 16;
        System.x ^= System.x >> 5;
        System.x ^= System.x << 1;
        t = System.x;
        System.x = System.y;
        System.y = System.z;
        System.z = t ^ System.x ^ System.y;
        var rand = Math.abs(System.z);
        return rand % (max + 1 - min) + min;
    };
    System.isNumber = function (obj) {
        return obj === +obj;
    };
    System.x = (new Date()).valueOf();
    System.y = 362436069;
    System.z = 521288629;
    return System;
})();
