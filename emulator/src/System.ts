export class System {

    public static print(str:any):void {
        console.log(str);
    }


    public static load(filename:string):ArrayBuffer {
        let fs = require("fs");
        let data = fs.readFileSync(filename);
        return data;
    }
}