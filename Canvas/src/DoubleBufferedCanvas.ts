class DoubleBufferedCanvas {


    private origin_canvas:HTMLCanvasElement;
    private clone_canvas:HTMLCanvasElement;


    private hash:any = {

    };

    constructor(canvas:HTMLCanvasElement) {
        this.origin_canvas = canvas;
        this.clone_canvas = document.createElement("canvas");
        this.clone_canvas.width = canvas.width;
        this.clone_canvas.height = canvas.height;
        let content:any = this.clone_canvas.getContext("2d");
        content._stroke = content.stroke;

        content.stroke = ()=> {
            content.clearRect(0,0,this.clone_canvas.width,this.clone_canvas.height);
            console.log("content.stroke");
            content._stroke();

            //this.origin_canvas.getContext("2d").stroke();
            this.write();
        }
    }


    private write() {
        //this.origin_canvas.getContext("2d").clearRect(0,0,this.clone_canvas.width,this.clone_canvas.height);
        //this.origin_canvas.getContext("2d").drawImage(this.clone_canvas,0,0,this.clone_canvas.width,this.clone_canvas.height);
    }

    public getCanvas():HTMLCanvasElement {
        return this.clone_canvas;
    }

}