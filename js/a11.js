const fs = require('fs');

const PERC_from = 0.00100;  //0.00060
const PERC_to =   0.00100;    //0.00700
const SL = 1;
const month = '09';

var sum = 100;
var I_succ = 0;
var I_loss = 0;
var I_ttl = 0;

var maxi = 0;
var p = 0;

var prev_month = '03'

var dir = `./data/klines/BTCUSDT/csv/1h`;
const filesPairs = fs.readdirSync(dir);

for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
    sum = 100;
    for (let fileNamePairs of filesPairs) {
        let mo = fileNamePairs.split('-')
        if(mo[2] == '2022' && mo[3] == month) {  //mo[2] == '2022' && mo[3] == month  //prev_month != mo[3]

        // console.log(prev_month, sum.toFixed(3),I_succ,I_loss,I_ttl);
        // prev_month = mo[3];
        // sum = 1;
        // I_succ = 0;
        // I_loss = 0;
        // I_ttl = 0;
    // }
    // else {
            let ARR = fs.readFileSync(dir + '/' + fileNamePairs, 'utf-8').split('\n');

            for (let i = 0; i < ARR.length - 1; i++) {
                I_ttl++
                var lineArr = ARR[i].split(',');

                var open = Number(lineArr[1]);
                var max = Number(lineArr[2]);
                var min = Number(lineArr[3]);
                var close = Number(lineArr[4]);
                
                //var sell = open * (1 +  PERC);
                var shortSell = +(open * (1- PERC)).toFixed(2);



                if(min <= shortSell) {
                    // sum = sum * ((1 - buy / open) + 1);
                    // sum = sum * (close / buy );
                    // I_succ++;

                    sum += (1 - (shortSell / open)) * sum;
                    sum += ((close / shortSell) - 1) * sum;
                    I_succ++;



                    // sum += (1 - buy / open);
                    // sum += (close / buy - 1);
                    // I_succ++;
                }
                else {
                    // sum = sum * (1- (close / open - 1));
                    // I_loss++;


                    sum -= ((close / open) -1) * sum;
                    I_loss++;


                    // sum += -(close / buy - 1)
                    // I_loss++;
                }

            }
        }
    }
    if(maxi < sum) {maxi = sum; p = PERC}
}
// console.log(sum.toFixed(3),I_succ,I_loss,I_ttl)
console.log(maxi,p)