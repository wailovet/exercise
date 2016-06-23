class DoubleBufferedCanvas {


    private origin_canvas:HTMLCanvasElement;
    private clone_canvas:HTMLCanvasElement;


    private hash:any = {};

    constructor(canvas:HTMLCanvasElement) {
        this.origin_canvas = canvas;
        this.clone_canvas = document.createElement("canvas");
        this.clone_canvas.width = canvas.width;
        this.clone_canvas.height = canvas.height;
        let content:any = this.clone_canvas.getContext("2d");
        content._stroke = content.stroke;

        content.stroke = ()=> {
            content.clearRect(0, 0, this.clone_canvas.width, this.clone_canvas.height);
            console.log("content.stroke");
            content._stroke();

            //this.origin_canvas.getContext("2d").stroke();
            this.write();

        };
    }


    private write() {
        let write_map = this.cutting();
        for (let i = 0; i < write_map.length; i++) {
            let map = write_map[i];
            this.origin_canvas.getContext("2d").drawImage(this.clone_canvas, map.x, map.y, 100, 100, map.x, map.y, 100, 100);
        }
        //console.log(md5(this.clone_canvas.getContext("2d").getImageData(0,0,100,100).data));
        //console.log((this.clone_canvas.getContext("2d").getImageData(0,0,100,100)).data);
        //this.origin_canvas.getContext("2d").clearRect(0,0,this.clone_canvas.width,this.clone_canvas.height);
        //this.origin_canvas.getContext("2d").drawImage(this.clone_canvas,0,0,this.clone_canvas.width,this.clone_canvas.height);
    }

    public getCanvas():HTMLCanvasElement {
        return this.clone_canvas;
    }

    private cutting() {
        const width = this.clone_canvas.width;
        const height = this.clone_canvas.height;
        let ret = [];
        for (let y = 0; y < height; y += height / 2) {
            for (let x = 0; x < width; x += width / 2) {
                if (!this.hash[y * width + x]) {
                    this.hash[y * width + x] = "0";
                } else {
                    let data = this.clone_canvas.getContext("2d").getImageData(x, y, height / 2, width / 2).data;
                    let md5_data = md5(data);
                    if (md5_data != this.hash[y * width + x]) {
                        this.hash[y * width + x] = md5_data;
                        ret.push({x: x, y: y});
                    } else {
                        console.log(y + "|" + x);
                    }
                }
            }
        }
        return ret;
    }


}