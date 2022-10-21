const fs = require('fs');

const PERC_from = 0.00290;  //0.00060
const PERC_to = 0.00290;    //0.00700

var sum = 100;
var I_succ = 0;
var I_loss = 0;
var ttl = 0;

var TimeArr1 = [];
var lossArr2 = [];


var dir = `./data/klines/BTCUSDT/csv/1m`;
const filesPairs = fs.readdirSync(dir);
for (let fileNamePairs of filesPairs) {
    let mo = fileNamePairs.split('-')
    if(mo[2] == '2022' && mo[3] == '10') {
        let ARR = fs.readFileSync(dir + '/' + fileNamePairs, 'utf-8').split('\n');
        for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
            var sell = 0;
            var timeOpen = 0;
            var isFind = false;
            for (let i = 0; i < ARR.length - 1; i++) {
                var lineArr = ARR[i].split(',');
                var time = Number(lineArr[0]) / 1000 / 60;

                if(time % 60 == 0) {
                    isFind = false;
                    timeOpen = Number(lineArr[0]);
                    //console.log(timeOpen)
                    var lineArr = ARR[i].split(',');
                    var open = Number(lineArr[1]);
                    sell = open * (1 + PERC);
                    // var sell2 = sell * (1 + PERC);

                    // var max = Number(lineArr[2]);
                    // var close = Number(lineArr[4]);
                }
                else {
                    var max = Number(lineArr[2]);
                    if(max >= sell && isFind == false) {
                        isFind = true;
                        TimeArr1.push((Number(lineArr[0]) - timeOpen) / 1000 / 60);
                        // break;
                    }
                }
            }
        }
    }
}

// console.log(TimeArr1);
const minut = 25;
var c = 0;
for (let i = 0; i < TimeArr1.length; i++) {
    if(TimeArr1[i] <= minut) c++
}
console.log(c,TimeArr1.length)