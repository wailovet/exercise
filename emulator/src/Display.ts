import {System} from "./System";
export class Display {


    public clean():void {
        console.log("clean");
    }

    private _data:any = [];

    public data(data):Display {
        this._data = data;
        return this;
    }


    public start() {
        var _this = this;
        setInterval(function () {
            //
            var str = "\n\n";
            for (let k = 0; k < 32; k++) {
                for (let i = 0; i < 64; i++) {
                    if (_this._data[k * 64 + i] == 1) {
                        str += "*";
                    } else {
                        str += " ";
                    }
                }
                str += "\n";
            }
            System.print(str);
            System.print(System.run_num);
        }, 20);
    }


}