var Brightness = (function () {
    function Brightness() {
        this.id = "brightness";
        this.name = "亮度";
    }
    Brightness.prototype.run = function (canvas) {
        var _this = this;
        var context = canvas.getContext("2d");
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var canvas_tmp = document.createElement("canvas");
        canvas_tmp.width = canvas.width;
        canvas_tmp.height = canvas.height;
        canvas_tmp.getContext("2d").putImageData(imageData, 0, 0);
        if ($("#brightness_range").length > 0) {
            $("#brightness_range").show();
        }
        else {
            $("body").append('<input id="brightness_range" type="range">');
            $("body").append('<button id="brightness_reset">重置</button>');
        }
        $("#brightness_range").change(function () {
            imageData = canvas_tmp.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
            var delta = $("#brightness_range").val();
            _this.core(imageData, parseInt(delta) - 50);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.putImageData(imageData, 0, 0);
        });
        $("#brightness_reset").click(function () {
            $("#brightness_range").val(50);
            $("#brightness_range").change();
        });
    };
    Brightness.prototype.core = function (pixels, delta) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            d[i] += delta; // red
            d[i + 1] += delta; // green
            d[i + 2] += delta; // blue
        }
        return pixels;
    };
    return Brightness;
}());
///<reference path="../d.ts/zepto.d.ts"/>
var ImageProcessing = (function () {
    function ImageProcessing(node) {
        this.canvas_node = node;
        this.effects = [];
    }
    ImageProcessing.prototype.plugins = function (obj) {
        this.effects.push(obj);
    };
    ImageProcessing.prototype.init = function (select_image) {
        var _this = this;
        select_image.change(function (evt) {
            var file = evt.target['files'][0];
            var reader = new FileReader();
            reader.onload = function (res) {
                var image = new Image();
                image.src = res.target['result'];
                image.onload = function () {
                    console.log(_this.canvas_node);
                    var canvas = _this.canvas_node.get(0);
                    var cxt = canvas.getContext("2d");
                    var width = image.width;
                    var height = image.height;
                    canvas.width = width;
                    canvas.height = height;
                    cxt.clearRect(0, 0, width, height);
                    cxt.drawImage(image, 0, 0);
                };
            };
            reader.readAsDataURL(file);
        });
        for (var i in this.effects) {
        }
    };
    return ImageProcessing;
}());
