class Canvas {


    private lines:Array<Line>;
    private canvas_element:HTMLCanvasElement;
    private context:CanvasRenderingContext2D;

    constructor(canvas:HTMLCanvasElement) {
        this.canvas_element = canvas;
        this.context = canvas.getContext("2d");
        this.lines = [];
    }

    public addLine(start:{x:number,y:number}, end:{x:number,y:number}):number {
        let start_point = new Point(start.x, start.y);
        let end_point = new Point(end.x, end.y);
        let line = new Line(start_point, end_point);

        this.lines.push(line);
        return this.lines.length - 1;
    }

    public getLine(id:number):Line {
        return this.lines[id];
    }

    public removeLine(id:number) {
        delete this.lines[id];
    }


    private update_id = 0;

    public autoUpdate(ms = 16):void {
        if (this.update_id != 0) {
            throw "重复运行";
        }
        this.update_id = setInterval(()=> {
            let lines = this.lines;
            for (let i in lines) {
                lines[i].update(ms);
            }
            this.update();
        }, ms);
    }

    public update():void {
        let ctx = this.context;
        let lines = this.lines;
        ctx.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
        ctx.beginPath();
        for (let i in lines) {
            let line:Line = lines[i];
            let sx = line.getStartPoint().x;
            let sy = line.getStartPoint().y;
            let ex = line.getEndPoint().x;
            let ey = line.getEndPoint().y;
            let style = line.style;
            for (let k in style) {
                ctx[k] = style[k];
            }
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
        }
        ctx.stroke();
    }


}