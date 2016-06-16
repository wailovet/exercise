export class System {

    public static print(str:any):void {
        console.log(str);
    }


    public static load(filename:string):ArrayBuffer {
        let fs = require("fs");
        let data:ArrayBuffer;
        if (fs.readFileSync) {
            data = fs.readFileSync(filename);
        } else {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", filename, false);
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
            xhr.send(null);

            function str2ab(str) {
                var buf = new ArrayBuffer(str.length); // 2 bytes for each char
                for (var i = 0, strLen = str.length; i < strLen; i++) {
                    buf[i] = str.charCodeAt(i) & 0x00FF;
                }
                return buf;
            }

            data = str2ab(xhr.response);
        }

        return data;
    }

    public static run_num = 0;
}