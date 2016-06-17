class Canves {


    private lines:Array<Line>;
    private canves_element:HTMLCanvasElement;
    private context:CanvasRenderingContext2D;

    constructor(canves:HTMLCanvasElement) {
        this.canves_element = canves;
        this.context = canves.getContext("2d");
    }

    public addLine(start:{x:number,y:number}, end:{x:number,y:number}):number {
        let start_point = new Point(start);
        let end_point = new Point(end);
        this.lines.push(new Line(start_point, end_point));
        return this.lines.length - 1;
    }

    public removeLine(id:number) {
        delete this.lines[id];
    }

    public update():void {
        let ctx = this.context;
        let lines = this.lines;

        ctx.beginPath();
        for (let i in lines) {
            let line:Line = lines[i];
            let sx = line.getStartPoint().x;
            let sy = line.getStartPoint().y;
            let ex = line.getEndPoint().x;
            let ey = line.getEndPoint().y;
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
        }

        ctx.stroke();
    }
}