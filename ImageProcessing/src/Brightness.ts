class Brightness implements PluginsInterface {
    id:string = "brightness";
    name:string = "亮度";

    public run(canvas:HTMLCanvasElement) {
        var context = canvas.getContext("2d");
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        var canvas_tmp = document.createElement("canvas");
        canvas_tmp.width = canvas.width;
        canvas_tmp.height = canvas.height;
        canvas_tmp.getContext("2d").putImageData(imageData, 0, 0);


        if ($("#brightness_range").length > 0) {
            $("#brightness_range").show();
        } else {
            $("body").append('<input id="brightness_range" type="range">');
            $("body").append('<button id="brightness_reset">重置</button>');
        }
        $("#brightness_range").change(()=> {
            imageData = canvas_tmp.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
            let delta = $("#brightness_range").val();
            this.core(imageData, parseInt(delta) - 50);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.putImageData(imageData, 0, 0);
        });
        $("#brightness_reset").click(()=> {
            $("#brightness_range").val(50);
            $("#brightness_range").change();
        });
    }


    private core(pixels, delta) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            d[i] += delta;     // red
            d[i + 1] += delta; // green
            d[i + 2] += delta; // blue
        }
        return pixels;
    }


}