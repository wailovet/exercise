class Line extends Base {

    private start_point:Point;
    private end_point:Point;


    constructor(start_point, end_point) {
        super();
        this.start_point = start_point;
        this.end_point = end_point;
    }

    public getStartPoint():Point {
        return this.start_point;
    }

    public getEndPoint():Point {
        return this.end_point;
    }


    private animations_fun:Array<any> = [];
    //距离上一次更新毫秒数
    public update(ms:number):void {
        for (let i in this.animations_fun) {
            this.start_point.x += (this.animations_fun[i].dsp.x * ms);
            this.start_point.y += (this.animations_fun[i].dsp.y * ms);
            this.end_point.x += (this.animations_fun[i].dep.x * ms);
            this.end_point.y += (this.animations_fun[i].dep.y * ms);

            let dstyle = this.animations_fun[i].dstyle;
            for (let k in dstyle) {
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
    }



    public animationStyle(style = {}, ms:number = 1000, callback = null) {
        let new_arg = {
            start_point: null,
            end_point: null,
            style: style
        };
        this.animation(new_arg, ms, callback);
    }



    public move(start_point:{
        x: number,
        y: number
    } = null, end_point:{
        x: number,
        y: number,
    } = null, ms:number = 1000, callback = null) {
        let new_arg = {
            start_point: start_point,
            end_point: end_point,
            style: {}
        };
        this.animation(new_arg, ms, callback);
    }



    public animation(new_arg = {
        start_point: null,
        end_point: null,
        style: {}
    }, ms:number = 1000, callback = null) {
        let dstyle = {};
        for (let i in new_arg.style) {
            if (System.isNumber(this.style[i])) {
                dstyle[i] = (new_arg.style[i] - this.style[i]) / ms;
            }
        }


        let dsp = {
            x: 0,
            y: 0
        };
        if (new_arg.start_point) {
            dsp.x = (new_arg.start_point.x - this.start_point.x) / ms;
            dsp.y = (new_arg.start_point.y - this.start_point.y) / ms;
        }


        let dep = {
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
    }


}