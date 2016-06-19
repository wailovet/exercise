///<reference path="../d.ts/node-0.10.d.ts"/>
import {exec} from "child_process";
import {Ats} from "./Ats";


Ats(function (ats) {

    ats.then(function () {
        exec("sudo wpa_cli scan", function (error, stdout, stderr) {
            //console.log(stdout);
            if (error != null) {

                console.log(stderr);
            } else {

                ats.next();
            }
        });
    }).then(function () {

        exec("sudo wpa_cli scan_result", function (error, stdout, stderr) {
            //console.log(stdout);
            if (error != null) {
                console.log(stderr);
            } else {
                let wifi_data = stdout.toString().split("\n");
                ats.next(wifi_data);
            }
        });

    }).then(function (wifi_data) {
        var wifi_array:Array<{
            ssid:string,
            flags:string
        }> = [];
        for (let i = 2; i < wifi_data.length; i++) {
            let tmp = wifi_data[i].split("\t");
            let item = {
                ssid: tmp.pop(),
                flags: tmp.pop()
            };

            if (item.flags) {
                wifi_array.push(item);
            }
        }
        //console.log(wifi_array);


        var wifi_select_string:string = "";
        for (let i in wifi_array) {
            wifi_select_string += "\n " + i + "={";
            var wifi_array_item = wifi_array[i];
            for (let k in wifi_array_item) {
                wifi_select_string += "'" + k + "':'" + wifi_array_item[k] + "',";
            }
            wifi_select_string += "}";
        }
        process.stdout.write(wifi_select_string + "\n");
        process.stdin.setEncoding('utf8');


        process.stdout.write(`select wifi:`);
        var data:{
            ssid:string,
            flags:string
        };
        var key_mgmt;
        var password;

        process.stdin.on("data", function (chunk) {

            var i = +chunk;

            if (!data) {
                if (chunk !== null && wifi_array[i]) {
                    process.stdout.write(wifi_array[i].ssid + "\n");
                    data = wifi_array[i];
                    process.stdout.write(`0:NONE,1:WPA-PSK\nselect key_mgmt:`);
                } else {
                    process.stdout.write(`select wifi:`);
                }
            } else {
                if (!key_mgmt) {
                    let tmp = {
                        "0": "NONE",
                        "1": "WPA-PSK",
                        "2": "WPA2-PSK",
                    };
                    if (chunk !== null) {
                        key_mgmt = tmp[i];
                        if (i == 0) {
                            save(data, key_mgmt);
                        } else {
                            process.stdout.write(`input password:`);
                        }
                    } else {
                        process.stdout.write(`0:NONE,1:WPA-PSK\nselect key_mgmt:`);
                    }
                } else {
                    if (chunk !== null) {
                        password = chunk.toString().trim();
                        save(data, key_mgmt, password);
                    } else {
                        process.stdout.write(`input password:`);
                    }
                }
            }

        });


    });


    function save(data, key_mgmt, password?) {

    }

});
