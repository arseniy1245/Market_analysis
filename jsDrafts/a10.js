const fs = require('fs');

const PERC_from = 0.00290;  //0.00060
const PERC_to = 0.00290;    //0.00700
const SL = 1;
const month = '10';

var sum = 100;
var I_succ = 0;
var I_loss = 0;
var ttl = 0;

var TimeArr1 = [];
var lossArr2 = [];

var dir = `./data/klines/BTCUSDT/csv/1h`;
const filesPairs = fs.readdirSync(dir);
for (let fileNamePairs of filesPairs) {
    let mo = fileNamePairs.split('-')
    if(mo[2] == '2022' && mo[3] == month) {
        let ARR = fs.readFileSync(dir + '/' + fileNamePairs, 'utf-8').split('\n');
        for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
            var sell = 0;
            var timeOpen = 0;
            var isFind = false;
            for (let i = 0; i < ARR.length - 1; i++) {
                var lineArr = ARR[i].split(',');
                var open = Number(lineArr[1]);
                var min = Number(lineArr[3]);
                var max = Number(lineArr[2]);
                var close = Number(lineArr[4]);
                var sell = open * (1 + SL *PERC);

                if(SL === -1) {
                    if(min <= sell) {
                        sum = sum * (1 + SL * (sell / open - 1));
                        I_succ++;
                    }
                    else {
                        sum = sum * (1 + SL * (close / open - 1));
                        I_loss++;
                    }
                }
                else {
                    if(max >= sell) {
                        sum = sum * (1 + SL * (sell / open - 1));
                        I_succ++;
                    }
                    else {
                        sum = sum * (1 + SL * (close / open - 1));
                        I_loss++;
                    }
                }
            }
        }
    }
}
console.log(SL,month,sum.toFixed(3),I_succ,I_loss)