const fs = require('fs');

const PERC_from = 0.00060;  //0.00060
const PERC_to = 0.00700;    //0.00700
const PAIR = 'BTCUSDT';
const TF = '15m';


const dir = `./data/klines/${PAIR}/csv/${TF}`
const files = fs.readdirSync(dir);

console.log('All files\nFrom: ' + PERC_from + ' to: ' + PERC_to + '\nTF: ' + TF);
var max = 0;
var p = 0;

for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
    var I_succ = 0;
    var I_loss = 0;
    var ttlProfit = 0;

    for (let file_name of files) {
        let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

        for (let i = 0; i < ARR.length - 1; i++) {
            var lineArr = ARR[i].split(',');
            var sell = Number(lineArr[1]) * (1 + PERC);
            var open = Number(lineArr[1]);
            if(Number(lineArr[2]) >= sell) {
                ttlProfit += sell / open - 1;
                I_succ++;
            }
            else {
                let close = Number(lineArr[4]);
                ttlProfit += close / open - 1;
                I_loss++;
            }
        }
    }
    if(max < ttlProfit) {
        max = ttlProfit;
        p = PERC;
    }
}
console.log('----\nTotal profit: ' + (max * 100).toFixed(1) + '%', '\nBest perc: ' + p.toFixed(5));